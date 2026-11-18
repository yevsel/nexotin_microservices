from __future__ import annotations

import os
from datetime import datetime, timezone
from typing import Any

import bcrypt
import jwt
from dateutil.relativedelta import relativedelta
from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import BusinessAccount, IndividualAccount, VendorDeletionRequest
from app.schemas.login_account import LoginRequest

router = APIRouter()

# Same env var name the Node route uses.
# If LOGIN_SECRET is not set, use a dev secret so the route still works.
LOGIN_SECRET = os.getenv("LOGIN_SECRET", "nexotin_dev_login_secret")


# POST /api/login-account
#
# Body:
# {
#   "email": "ama@example.com",
#   "password": "secret"
# }
#
# The old Node route looks for the email in individual accounts first, then
# in business accounts. If found, it checks the password and returns a token.
@router.post("/login-account")
def login_account(
    payload: LoginRequest,
    db: Session = Depends(get_db),  # get_db gives this request a DB session
) -> dict[str, Any]:
    # Trim and lowercase the email, same as the Node route.
    email = str(payload.email).strip().lower()

    # ------------------------- TRY INDIVIDUAL ----------------------------
    # Look for an individual vendor with this email.
    individual = db.scalar(
        select(IndividualAccount).where(IndividualAccount.email == email)
    )

    if individual is not None:
        # Check if this vendor asked for their account to be deleted.
        # If a deletion request exists, do not let them log in.
        deletion_request = db.scalar(
            select(VendorDeletionRequest).where(
                VendorDeletionRequest.vendor_id == individual.id
            )
        )
        if deletion_request is not None:
            # The Node route also returns 200 with a message here.
            return {"msg": "This account has been deleted."}

        # Compare the typed password with the stored bcrypt hash.
        password_is_correct = bcrypt.checkpw(
            payload.password.encode("utf-8"),
            individual.password.encode("utf-8"),
        )

        if not password_is_correct:
            return {"msg": "Wrong password"}

        # Create the token. The Node route used expiresIn: "100y".
        token = jwt.encode(
            {
                "id": str(individual.id),
                "accountType": individual.account_type,
                "exp": datetime.now(timezone.utc) + relativedelta(years=100),
            },
            LOGIN_SECRET,
            algorithm="HS256",
        )

        # The old route returned the whole Mongo document, including the
        # password hash. Here the hash is left out on purpose.
        account_data = {
            "id": str(individual.id),
            "accountType": individual.account_type,
            "bannerImage": individual.banner_image,
            "profileImage": individual.profile_image,
            "firstName": individual.first_name,
            "lastName": individual.last_name,
            "location": individual.location,
            "phoneNumber": individual.phone_number,
            "email": individual.email,
            "verified": individual.verified,
            "stockCycle": individual.stock_cycle,
            "shortPath": individual.short_path,
            "createdAt": individual.created_at,
        }

        # Matches the Node response shape: { msg: { data, token } }
        return {"msg": {"data": account_data, "token": token}}

    # -------------------------- TRY BUSINESS -----------------------------
    # No individual account, so look for a business with this email.
    business = db.scalar(
        select(BusinessAccount).where(BusinessAccount.business_email == email)
    )

    if business is not None:
        # Same deleted-account check as above.
        deletion_request = db.scalar(
            select(VendorDeletionRequest).where(
                VendorDeletionRequest.vendor_id == business.id
            )
        )
        if deletion_request is not None:
            return {"msg": "This account has been deleted."}

        # Compare the typed password with the stored bcrypt hash.
        password_is_correct = bcrypt.checkpw(
            payload.password.encode("utf-8"),
            business.password.encode("utf-8"),
        )

        if not password_is_correct:
            return {"msg": "Wrong password"}

        token = jwt.encode(
            {
                "id": str(business.id),
                "accountType": business.account_type,
                "exp": datetime.now(timezone.utc) + relativedelta(years=100),
            },
            LOGIN_SECRET,
            algorithm="HS256",
        )

        account_data = {
            "id": str(business.id),
            "accountType": business.account_type,
            "bannerImage": business.banner_image,
            "profileImage": business.profile_image,
            "shopName": business.shop_name,
            "whatDoYouSell": business.what_do_you_sell,
            "location": business.location,
            "businessPhoneNumber": business.business_phone_number,
            "businessEmail": business.business_email,
            "momoAccountNumber": business.momo_account_number,
            "stockCycle": business.stock_cycle,
            "verified": business.verified,
            "shortPath": business.short_path,
            "createdAt": business.created_at,
        }

        return {"msg": {"data": account_data, "token": token}}

    # ------------------------ NOT FOUND ANYWHERE -------------------------
    # Same message the Node route returns for an unknown email.
    return {"msg": "Please check credentials and remove white spaces"}
