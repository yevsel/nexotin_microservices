from __future__ import annotations

import uuid
from typing import Any

from fastapi import APIRouter, Depends
from sqlalchemy import or_, select
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import BusinessAccount, IndividualAccount, Product, User
from app.routers.vendors.products import _product_data

router = APIRouter()


# POST /api/marketplace/full-text-search  (also exposed as /search-products)
@router.post("/full-text-search")
@router.post("/search-products")
def full_text_search(
    payload: dict[str, Any],
    db: Session = Depends(get_db),
) -> dict[str, Any]:
    name = payload.get("name") or ""
    stmt = select(Product)
    if name:
        like = f"%{name}%"
        stmt = stmt.where(
            or_(
                Product.name.ilike(like),
                Product.product_description.ilike(like),
                Product.sub_category.ilike(like),
                Product.brand.ilike(like),
            )
        )
    stmt = stmt.order_by(Product.created_at.desc()).limit(40)
    products = db.scalars(stmt).all()
    # Node returned a trimmed projection.
    msg = [
        {
            "id": str(p.id),
            "images": p.images,
            "name": p.name,
            "colors": p.colors,
            "price": float(p.price),
            "height": float(p.height),
            "productQuantity": p.product_quantity,
        }
        for p in products
    ]
    return {"msg": msg}


# POST /api/marketplace/search-vendors
@router.post("/search-vendors")
def search_vendors(
    payload: dict[str, Any],
    db: Session = Depends(get_db),
) -> dict[str, Any]:
    name = payload.get("name") or ""
    like = f"%{name}%"
    results: list[dict[str, Any]] = []

    individuals = db.scalars(
        select(IndividualAccount).where(
            or_(
                IndividualAccount.first_name.ilike(like),
                IndividualAccount.last_name.ilike(like),
            )
        )
    ).all()
    for acc in individuals:
        results.append(
            {
                "id": str(acc.id),
                "accountType": acc.account_type,
                "firstName": acc.first_name,
                "lastName": acc.last_name,
                "profileImage": acc.profile_image,
            }
        )

    businesses = db.scalars(
        select(BusinessAccount).where(BusinessAccount.shop_name.ilike(like))
    ).all()
    for acc in businesses:
        results.append(
            {
                "id": str(acc.id),
                "accountType": acc.account_type,
                "shopName": acc.shop_name,
                "profileImage": acc.profile_image,
            }
        )

    return {"msg": results}
