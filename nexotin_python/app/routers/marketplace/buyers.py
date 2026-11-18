from __future__ import annotations

import uuid
from typing import Any

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import User
from app.security import get_bearer_token

router = APIRouter()


# POST /api/marketplace/get-buyer-information-for-orders
@router.post("/get-buyer-information-for-orders")
def get_buyer_information_for_orders(
    token: dict[str, Any] = Depends(get_bearer_token),
    db: Session = Depends(get_db),
) -> dict[str, Any]:
    buyer_id = uuid.UUID(token["id"])
    user = db.scalar(select(User).where(User.id == buyer_id))
    if user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Buyer not found")
    return {
        "msg": {
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
    }
