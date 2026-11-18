from __future__ import annotations

import uuid
from typing import Any

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import ProductComplain, ProductReview, User

router = APIRouter()


# POST /api/marketplace/post-product-review
@router.post("/post-product-review")
def post_product_review(
    payload: dict[str, Any],
    db: Session = Depends(get_db),
) -> dict[str, Any]:
    product_id = payload.get("productId")
    vendor_account_id = payload.get("vendorAccountId")
    vendor_account_type = payload.get("vendorAccountType")
    buyer_information = payload.get("buyerInformation")
    review = payload.get("review")

    if not product_id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="productId required")

    pr = ProductReview(
        product_id=str(product_id),
        vendor_account_id=str(vendor_account_id) if vendor_account_id else "",
        vendor_account_type=str(vendor_account_type) if vendor_account_type else "",
        buyer_information=buyer_information,
        review=review,
    )
    db.add(pr)
    db.commit()
    return {"msg": "Successful"}


# POST /api/marketplace/get-product-review
@router.post("/get-product-review")
def get_product_review(
    payload: dict[str, Any],
    db: Session = Depends(get_db),
) -> dict[str, Any]:
    product_id = payload.get("data")
    if not product_id:
        # also accept productId
        product_id = payload.get("productId")
    reviews = db.scalars(
        select(ProductReview).where(ProductReview.product_id == str(product_id)).order_by(ProductReview.created_at.desc())
    ).all()
    msg = [
        {
            "id": str(r.id),
            "productId": r.product_id,
            "vendorAccountId": r.vendor_account_id,
            "vendorAccountType": r.vendor_account_type,
            "buyerInformation": r.buyer_information,
            "review": r.review,
            "createdAt": r.created_at,
        }
        for r in reviews
    ]
    return {"msg": msg}


# POST /api/marketplace/complain-about-product
@router.post("/complain-about-product")
def complain_about_product(
    payload: dict[str, Any],
    db: Session = Depends(get_db),
) -> dict[str, Any]:
    complain = ProductComplain(
        product_id=str(payload.get("product_id")),
        complain_text=str(payload.get("complain_text") or ""),
        complain_by=payload.get("complain_by"),
        complain_to=payload.get("complain_to"),
    )
    db.add(complain)
    db.commit()
    return {"msg": "Your complain was made successfully."}


# POST /api/marketplace/get-buyer-images-for-reviews
@router.post("/get-buyer-images-for-reviews")
def get_buyer_images_for_reviews(
    payload: dict[str, Any],
    db: Session = Depends(get_db),
) -> dict[str, Any]:
    emails = payload.get("buyersEmails") or []
    images: list[Any] = []
    for email in emails:
        user = db.scalar(select(User).where(User.email == str(email).strip().lower()))
        images.append(user.profile_image if user is not None else None)
    return {"msg": images}
