from __future__ import annotations

from typing import Any

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Subscription

router = APIRouter()


# POST /api/marketplace/subscribe-to-vendor
@router.post("/subscribe-to-vendor")
def subscribe_to_vendor(
    payload: dict[str, Any],
    db: Session = Depends(get_db),
) -> dict[str, Any]:
    vendor_email = payload.get("vendorEmail")
    buyer_email = payload.get("buyerEmail")
    if not vendor_email or not buyer_email:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="vendorEmail and buyerEmail required")
    existing = db.scalar(
        select(Subscription).where(
            Subscription.vendor_email == str(vendor_email).strip().lower(),
            Subscription.buyer_email == str(buyer_email).strip().lower(),
        )
    )
    if existing is not None:
        return {"msg": False}
    sub = Subscription(
        vendor_email=str(vendor_email).strip().lower(),
        buyer_email=str(buyer_email).strip().lower(),
    )
    db.add(sub)
    db.commit()
    return {"msg": True}


# POST /api/marketplace/check-subscription-route
@router.post("/check-subscription-route")
def check_subscription(
    payload: dict[str, Any],
    db: Session = Depends(get_db),
) -> dict[str, Any]:
    vendor_email = payload.get("vendorEmail")
    buyer_email = payload.get("buyerEmail")
    existing = db.scalar(
        select(Subscription).where(
            Subscription.vendor_email == str(vendor_email).strip().lower(),
            Subscription.buyer_email == str(buyer_email).strip().lower(),
        )
    )
    return {"msg": existing is not None}


# POST /api/marketplace/count-subscribers
@router.post("/count-subscribers")
def count_subscribers(
    payload: dict[str, Any],
    db: Session = Depends(get_db),
) -> dict[str, Any]:
    vendor_email = payload.get("vendorEmail")
    count = db.scalar(
        select(func.count()).select_from(Subscription).where(
            Subscription.vendor_email == str(vendor_email).strip().lower()
        )
    ) or 0
    return {"msg": int(count)}


# POST /api/marketplace/unsubscribe-vendor
@router.post("/unsubscribe-vendor")
def unsubscribe_vendor(
    payload: dict[str, Any],
    db: Session = Depends(get_db),
) -> dict[str, Any]:
    vendor_email = payload.get("vendorEmail")
    buyer_email = payload.get("buyerEmail")
    db.query(Subscription).filter(
        Subscription.vendor_email == str(vendor_email).strip().lower(),
        Subscription.buyer_email == str(buyer_email).strip().lower(),
    ).delete()
    db.commit()
    return {"msg": True}
