from __future__ import annotations

import uuid
from datetime import datetime, timezone
from decimal import Decimal
from typing import Any, Literal

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, ConfigDict, Field
from sqlalchemy import or_, select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import BusinessAccount, IndividualAccount, Product
from app.security import generate_short_id, get_bearer_token, hash_password

router = APIRouter()

ACCOUNT_TYPE_MODELS = {
    "individual": IndividualAccount,
    "business": BusinessAccount,
}


class ProductCreateRequest(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    images: list[Any] = Field(min_length=1)
    name: str = Field(min_length=1)
    price: Decimal
    gender: str = Field(min_length=1)
    height: Decimal
    unisex: bool = False
    main_category: str = Field(alias="mainCategory", min_length=1)
    sub_category: str | None = Field(default=None, alias="subCategory")
    product_type: str | None = Field(default=None, alias="productType")
    colors: list[str] | None = None
    selected_sizes: list[str] | None = Field(default=None, alias="selectedSizes")
    product_description: str = Field(alias="productDescription", min_length=1)
    product_quantity: int = Field(alias="productQuantity", ge=0)
    brand: str = Field(min_length=1)
    condition: str = Field(min_length=1)


class ProductUpdateRequest(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    id: uuid.UUID
    images: list[Any] | None = None
    name: str | None = None
    price: Decimal | None = None
    gender: str | None = None
    main_category: str | None = Field(default=None, alias="mainCategory")
    sub_category: str | None = Field(default=None, alias="subCategory")
    product_type: str | None = Field(default=None, alias="productType")
    colors: list[str] | None = None
    selected_sizes: list[str] | None = Field(default=None, alias="selectedSizes")
    product_description: str | None = Field(default=None, alias="productDescription")
    product_quantity: int | None = Field(default=None, alias="productQuantity")
    brand: str | None = None
    condition: str | None = None


class VendorLookupDetail(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    vendor_id: uuid.UUID = Field(alias="vendorId")
    account_type: Literal["individual", "business"] = Field(alias="accountType")


class VendorLookupRequest(BaseModel):
    details: list[VendorLookupDetail]


def _product_data(product: Product) -> dict[str, Any]:
    return {
        "id": str(product.id),
        "accountOwnerID": str(product.account_owner_id),
        "accountType": product.account_type,
        "images": product.images,
        "name": product.name,
        "price": float(product.price),
        "gender": product.gender,
        "height": float(product.height),
        "unisex": product.unisex,
        "mainCategory": product.main_category,
        "subCategory": product.sub_category,
        "productType": product.product_type,
        "colors": product.colors,
        "selectedSizes": product.selected_sizes,
        "productDescription": product.product_description,
        "productQuantity": product.product_quantity,
        "brand": product.brand,
        "condition": product.condition,
        "createdAt": product.created_at,
        "availability": product.availability,
        "shortPath": product.short_path,
    }


def _vendor_data(account: Any, account_type: str) -> dict[str, Any]:
    if account_type == "business":
        return {
            "id": str(account.id),
            "accountType": account.account_type,
            "shopName": account.shop_name,
            "whatDoYouSell": account.what_do_you_sell,
            "businessPhoneNumber": account.business_phone_number,
            "businessEmail": account.business_email,
            "location": account.location,
            "profileImage": account.profile_image,
            "bannerImage": account.banner_image,
            "verified": account.verified,
            "shortPath": account.short_path,
            "createdAt": account.created_at,
        }
    return {
        "id": str(account.id),
        "accountType": account.account_type,
        "firstName": account.first_name,
        "lastName": account.last_name,
        "phoneNumber": account.phone_number,
        "email": account.email,
        "location": account.location,
        "profileImage": account.profile_image,
        "bannerImage": account.banner_image,
        "verified": account.verified,
        "shortPath": account.short_path,
        "createdAt": account.created_at,
    }


# POST /api/vendors/post-product
@router.post("/post-product")
def post_product(
    payload: dict[str, Any],
    token: dict[str, Any] = Depends(get_bearer_token),
    db: Session = Depends(get_db),
) -> dict[str, Any]:
    data = payload.get("data") or {}
    req = ProductCreateRequest(**data)

    account_id = uuid.UUID(token["id"])
    account_type = token["accountType"]

    product = Product(
        account_owner_id=account_id,
        account_type=account_type,
        images=req.images,
        name=req.name.strip(),
        price=req.price,
        gender=req.gender.strip(),
        height=req.height,
        unisex=req.unisex,
        main_category=req.main_category.strip(),
        sub_category=req.sub_category.strip() if req.sub_category else None,
        product_type=req.product_type.strip() if req.product_type else None,
        colors=req.colors,
        selected_sizes=req.selected_sizes,
        product_description=req.product_description.strip(),
        product_quantity=req.product_quantity,
        brand=req.brand.strip(),
        condition=req.condition.strip(),
        short_path=f"https://www.nexotin.com/p/{generate_short_id()}",
    )
    db.add(product)
    db.commit()
    db.refresh(product)
    return {"msg": True}


# POST /api/vendors/get-products
@router.post("/get-products")
def get_products(
    payload: dict[str, Any],
    token: dict[str, Any] = Depends(get_bearer_token),
    db: Session = Depends(get_db),
) -> dict[str, Any]:
    account_id = uuid.UUID(token["id"])
    created_at_raw = payload.get("createdAt")
    stmt = select(Product).where(Product.account_owner_id == account_id)
    if created_at_raw:
        try:
            cutoff = datetime.fromisoformat(str(created_at_raw).replace("Z", "+00:00"))
            stmt = stmt.where(Product.created_at < cutoff)
        except ValueError:
            pass
    stmt = stmt.order_by(Product.created_at.desc()).limit(10)
    products = db.scalars(stmt).all()
    return {"msg": [_product_data(p) for p in products]}


# POST /api/vendors/get-vendor-of-products
@router.post("/get-vendor-of-products")
def get_vendor_of_products(
    payload: VendorLookupRequest,
    db: Session = Depends(get_db),
) -> dict[str, Any]:
    results: list[Any] = []
    for detail in payload.details:
        model = ACCOUNT_TYPE_MODELS.get(detail.account_type)
        if model is None:
            results.append(None)
            continue
        account = db.scalar(select(model).where(model.id == detail.vendor_id))
        if account is None:
            results.append(None)
            continue
        results.append(_vendor_data(account, detail.account_type))
    return {"msg": results}


# POST /api/vendors/delete-product
@router.post("/delete-product")
def delete_product(
    payload: dict[str, Any],
    db: Session = Depends(get_db),
) -> dict[str, Any]:
    product_id = payload.get("productId")
    if not product_id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="productId required")
    db.query(Product).filter(Product.id == uuid.UUID(str(product_id))).delete()
    db.commit()
    return {"msg": True}


# POST /api/vendors/update-product
@router.post("/update-product")
def update_product(
    payload: dict[str, Any],
    token: dict[str, Any] = Depends(get_bearer_token),
    db: Session = Depends(get_db),
) -> dict[str, Any]:
    data = payload.get("data") or {}
    product_id = data.get("id")
    if not product_id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="id required")
    product = db.scalar(select(Product).where(Product.id == uuid.UUID(str(product_id))))
    if product is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")

    if data.get("images") is not None:
        product.images = data["images"]
    if data.get("name") is not None:
        product.name = str(data["name"]).strip()
    if data.get("price") is not None:
        product.price = Decimal(str(data["price"]))
    if data.get("gender") is not None:
        product.gender = str(data["gender"]).strip()
    if data.get("mainCategory") is not None:
        product.main_category = str(data["mainCategory"]).strip()
    if data.get("subCategory") is not None:
        product.sub_category = str(data["subCategory"]).strip() or None
    if data.get("productType") is not None:
        product.product_type = str(data["productType"]).strip() or None
    if data.get("colors") is not None:
        product.colors = data["colors"]
    if data.get("selectedSizes") is not None:
        product.selected_sizes = data["selectedSizes"]
    if data.get("productDescription") is not None:
        product.product_description = str(data["productDescription"]).strip()
    if data.get("productQuantity") is not None:
        product.product_quantity = int(data["productQuantity"])
    if data.get("brand") is not None:
        product.brand = str(data["brand"]).strip()
    if data.get("condition") is not None:
        product.condition = str(data["condition"]).strip()

    db.commit()
    return {"msg": True}


# POST /api/vendors/out-of-stock
@router.post("/out-of-stock")
def out_of_stock(
    payload: dict[str, Any],
    db: Session = Depends(get_db),
) -> dict[str, Any]:
    product_id = payload.get("id")
    if not product_id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="id required")
    product = db.scalar(select(Product).where(Product.id == uuid.UUID(str(product_id))))
    if product is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
    product.product_quantity = 0
    db.commit()
    db.refresh(product)
    return {"msg": "Product quantity updated successfully", "product": _product_data(product)}
