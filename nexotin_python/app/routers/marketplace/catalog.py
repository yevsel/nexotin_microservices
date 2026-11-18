from __future__ import annotations

import uuid
from datetime import datetime, timezone
from decimal import Decimal
from typing import Any

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import func, or_, select
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Product
from app.routers.vendors.products import _product_data

router = APIRouter()


def _parse_cutoff(raw: Any) -> datetime | None:
    if not raw:
        return None
    try:
        return datetime.fromisoformat(str(raw).replace("Z", "+00:00"))
    except ValueError:
        return None


# POST /api/marketplace/get-buyers-products
@router.post("/get-buyers-products")
def get_buyers_products(
    payload: dict[str, Any],
    db: Session = Depends(get_db),
) -> dict[str, Any]:
    cutoff = _parse_cutoff(payload.get("createdAt"))
    platform = payload.get("platform")
    limit = 20 if platform else 10
    stmt = select(Product)
    if cutoff is not None:
        stmt = stmt.where(Product.created_at < cutoff)
    stmt = stmt.order_by(Product.created_at.desc()).limit(limit)
    products = db.scalars(stmt).all()
    return {"msg": [_product_data(p) for p in products]}


# GET /api/marketplace/get-one-product/{id}
@router.get("/get-one-product/{product_id}")
def get_one_product(
    product_id: uuid.UUID,
    db: Session = Depends(get_db),
) -> dict[str, Any]:
    product = db.scalar(select(Product).where(Product.id == product_id))
    if product is None:
        return {"msg": None}
    # vendor info
    from app.models import BusinessAccount, IndividualAccount

    account_model = IndividualAccount if product.account_type == "individual" else BusinessAccount
    vendor = db.scalar(select(account_model).where(account_model.id == product.account_owner_id))
    vendor_info = None
    if vendor is not None:
        if product.account_type == "business":
            vendor_info = {
                "id": str(vendor.id),
                "accountType": vendor.account_type,
                "shopName": vendor.shop_name,
                "profileImage": vendor.profile_image,
                "verified": vendor.verified,
                "shortPath": vendor.short_path,
            }
        else:
            vendor_info = {
                "id": str(vendor.id),
                "accountType": vendor.account_type,
                "firstName": vendor.first_name,
                "lastName": vendor.last_name,
                "profileImage": vendor.profile_image,
                "verified": vendor.verified,
                "shortPath": vendor.short_path,
            }
    data = _product_data(product)
    data["vendorInfo"] = vendor_info
    return {"msg": data}


# POST /api/marketplace/get-products-by-category
@router.post("/get-products-by-category")
def get_products_by_category(
    payload: dict[str, Any],
    db: Session = Depends(get_db),
) -> dict[str, Any]:
    category_name = payload.get("categoryName")
    specific_category = payload.get("specificCategory")
    gender = payload.get("gender")
    from_price = payload.get("from")
    to_price = payload.get("to")
    cutoff = _parse_cutoff(payload.get("createdAt"))

    stmt = select(Product)
    if category_name:
        stmt = stmt.where(Product.main_category == category_name)
    if specific_category:
        stmt = stmt.where(Product.sub_category == specific_category)
    if gender:
        stmt = stmt.where(Product.gender == gender)
    if from_price is not None:
        try:
            stmt = stmt.where(Product.price >= Decimal(str(from_price)))
        except Exception:
            pass
    if to_price is not None:
        try:
            stmt = stmt.where(Product.price <= Decimal(str(to_price)))
        except Exception:
            pass
    if cutoff is not None:
        stmt = stmt.where(Product.created_at < cutoff)
    stmt = stmt.order_by(Product.created_at.desc()).limit(15)
    products = db.scalars(stmt).all()
    return {"msg": [_product_data(p) for p in products]}


# POST /api/marketplace/get-new-arrivals
@router.post("/get-new-arrivals")
def get_new_arrivals(db: Session = Depends(get_db)) -> dict[str, Any]:
    products = db.scalars(select(Product).order_by(Product.created_at.desc()).limit(10)).all()
    return {"msg": [_product_data(p) for p in products]}


# GET /api/marketplace/get-hot-sales
@router.get("/get-hot-sales")
def get_hot_sales(db: Session = Depends(get_db)) -> dict[str, Any]:
    men = db.scalars(
        select(Product).where(Product.gender == "men").order_by(func.random()).limit(10)
    ).all()
    women = db.scalars(
        select(Product).where(Product.gender == "women").order_by(func.random()).limit(10)
    ).all()
    return {"msg": [_product_data(p) for p in list(men) + list(women)]}


# POST /api/marketplace/get-random-category-elements
@router.post("/get-random-category-elements")
def get_random_category_elements(
    payload: dict[str, Any],
    db: Session = Depends(get_db),
) -> dict[str, Any]:
    category_name = payload.get("categoryName")
    specific_category = payload.get("specificCategory")
    gender = payload.get("gender")

    stmt = select(Product)
    if category_name:
        stmt = stmt.where(Product.main_category == category_name)
    if specific_category:
        stmt = stmt.where(Product.sub_category == specific_category)
    if gender:
        stmt = stmt.where(Product.gender == gender)
    stmt = stmt.order_by(func.random()).limit(15)
    products = db.scalars(stmt).all()
    return {"msg": [_product_data(p) for p in products]}


# POST /api/marketplace/get-related-items
@router.post("/get-related-items")
def get_related_items(
    payload: dict[str, Any],
    db: Session = Depends(get_db),
) -> dict[str, Any]:
    main_category = payload.get("mainCategory")
    stmt = select(Product)
    if main_category:
        stmt = stmt.where(Product.main_category == main_category)
    stmt = stmt.order_by(func.random()).limit(6)
    products = db.scalars(stmt).all()
    return {"msg": [_product_data(p) for p in products]}


# POST /api/marketplace/get-sub-category-related-items
@router.post("/get-sub-category-related-items")
def get_sub_category_related_items(
    payload: dict[str, Any],
    db: Session = Depends(get_db),
) -> dict[str, Any]:
    sub_category = payload.get("subCategory")
    stmt = select(Product)
    if sub_category:
        stmt = stmt.where(Product.sub_category == sub_category)
    stmt = stmt.order_by(func.random()).limit(10)
    products = db.scalars(stmt).all()
    return {"msg": [_product_data(p) for p in products]}


# POST /api/marketplace/resolve-product-short-path
@router.post("/resolve-product-short-path")
def resolve_product_short_path(
    payload: dict[str, Any],
    db: Session = Depends(get_db),
) -> dict[str, Any]:
    short_path = payload.get("shortPath")
    if not short_path:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="shortPath is required")
    product = db.scalar(select(Product).where(Product.short_path == short_path))
    if product is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Short path not found")
    return {
        "redirectTo": f"https://www.nexotin.com/shop/products/{product.id}",
        "name": product.name,
        "productDescription": product.product_description,
        "imageUrl": product.images[0].get("secure_url") if product.images else None,
        "brand": product.brand,
        "price": float(product.price),
        "currency": product.currency,
        "availability": product.availability,
        "condition": product.condition,
    }
