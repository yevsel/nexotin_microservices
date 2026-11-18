from __future__ import annotations

import bcrypt
import jwt
import os
from datetime import datetime, timedelta, timezone
from typing import Any

from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import User, VendorDeletionRequest
from app.schemas.auth import BuyerLoginRequest, BuyerRegisterRequest
from app.security import hash_password

router = APIRouter()

# Same env var name the Node routes used.
LOGIN_SECRET = os.getenv("LOGIN_SECRET", "nexotin_dev_login_secret")


def _buyer_token(user: User) -> str:
    return jwt.encode(
        {
            "id": str(user.id),
            "exp": datetime.now(timezone.utc) + timedelta(days=36500),
        },
        LOGIN_SECRET,
        algorithm="HS256",
    )


def _buyer_data(user: User) -> dict[str, Any]:
    return {
        "id": str(user.id),
        "firstName": user.first_name,
        "lastName": user.last_name,
        "email": user.email,
        "phoneNumber": user.phone_number,
        "profileImage": user.profile_image,
        "location": user.location,
        "gender": user.gender,
        "username": user.username,
        "createdAt": user.created_at,
    }


# POST /api/auth/register-user
#
# Body:
# {
#   "firstName": "Ama",
#   "lastName": "Mensah",
#   "phoneNumber": "0500000000",
#   "password": "secret",
#   "email": "ama@example.com"
# }
#
# The old Node route only creates buyer accounts. Email is checked for
# duplicates, password is hashed, then the user is saved.
@router.post("/register-user")
def register_user(
    payload: BuyerRegisterRequest,
    db: Session = Depends(get_db),
) -> dict[str, Any]:
    email = payload.email.strip().lower()

    existing = db.scalar(select(User).where(User.email == email))
    if existing is not None:
        return {"msg": "Email already exist"}

    user = User(
        first_name=payload.first_name.strip(),
        last_name=payload.last_name.strip(),
        phone_number=payload.phone_number.strip(),
        password=hash_password(payload.password.strip()),
        email=email,
        created_at=datetime.now(timezone.utc),
    )
    db.add(user)
    db.commit()

    return {"msg": True}


# POST /api/auth/login-user
#
# Body:
# {
#   "email": "ama@example.com",
#   "password": "secret"
# }
#
# Looks the buyer up by email, checks the deletion request, compares the
# bcrypt hash, then returns the same { msg: { data, token } } shape the
# vendor login returns.
@router.post("/login-user")
def login_user(
    payload: BuyerLoginRequest,
    db: Session = Depends(get_db),
) -> dict[str, Any]:
    email = payload.email.strip().lower()
    user = db.scalar(select(User).where(User.email == email))

    if user is None:
        return {"msg": "Wrong email"}

    if user.password is None:
        # Google sign-in accounts have no password.
        return {"msg": "Wrong password"}

    password_is_correct = bcrypt.checkpw(
        payload.password.encode("utf-8"),
        user.password.encode("utf-8"),
    )
    if not password_is_correct:
        return {"msg": "Wrong password"}

    deletion_request = db.scalar(
        select(VendorDeletionRequest).where(
            VendorDeletionRequest.vendor_id == user.id,
        )
    )
    if deletion_request is not None:
        return {"msg": "This account has been deleted."}

    token = _buyer_token(user)

    return {"msg": {"data": _buyer_data(user), "token": token}}
