from __future__ import annotations

import uuid
from typing import Any

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, ConfigDict, Field
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import BusinessAccount, IndividualAccount
from app.security import get_bearer_token

router = APIRouter()

ACCOUNT_TYPE_MODELS = {
    "individual": IndividualAccount,
    "business": BusinessAccount,
}


class VendorEditProfileRequest(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    account_type: str = Field(alias="accountType")
    # Individual fields
    first_name: str | None = Field(default=None, alias="firstName")
    last_name: str | None = Field(default=None, alias="lastName")
    phone_number: str | None = Field(default=None, alias="phoneNumber")
    location: dict[str, Any] | None = None
    stock_cycle: str | None = Field(default=None, alias="stockCycle")
    # Business fields
    shop_name: str | None = Field(default=None, alias="shopName")
    what_do_you_sell: str | None = Field(default=None, alias="whatDoYouSell")
    business_phone_number: str | None = Field(default=None, alias="businessPhoneNumber")
    momo_account_number: str | None = Field(default=None, alias="momoAccountNumber")


class VendorEmailDetail(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    account_type: str = Field(alias="accountType")
    account_owner_id: uuid.UUID = Field(alias="accountOwnerID")


class VendorEmailRequest(BaseModel):
    details: list[VendorEmailDetail]


class VerifyVendorRequest(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    registered: bool = False
    images: list[str] = Field(default_factory=list)


# POST /api/vendors/get-vendor-info-from-token
@router.post("/get-vendor-info-from-token")
def get_vendor_info_from_token(
    token: dict[str, Any] = Depends(get_bearer_token),
    db: Session = Depends(get_db),
) -> dict[str, Any]:
    account_id = uuid.UUID(token["id"])
    account_type = token["accountType"]
    model = ACCOUNT_TYPE_MODELS.get(account_type)
    if model is None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid account type")
    account = db.scalar(select(model).where(model.id == account_id))
    if account is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Vendor not found")
    return {"msg": {"shortPath": account.short_path}}


# POST /api/vendors/get-vendor-email
@router.post("/get-vendor-email")
def get_vendor_email(
    payload: VendorEmailRequest,
    db: Session = Depends(get_db),
) -> dict[str, Any]:
    detail = payload.details[0] if payload.details else None
    if detail is None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="details required")
    model = ACCOUNT_TYPE_MODELS.get(detail.account_type)
    if model is None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid account type")
    account = db.scalar(select(model).where(model.id == detail.account_owner_id))
    if account is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Vendor not found")
    if detail.account_type == "business":
        return {
            "msg": {
                "email": account.business_email,
                "name": account.shop_name,
                "profileImage": account.profile_image,
            }
        }
    return {
        "msg": {
            "email": account.email,
            "name": f"{account.first_name} {account.last_name}",
            "profileImage": account.profile_image,
        }
    }


# POST /api/vendors/check-vendor-verification
@router.post("/check-vendor-verification")
def check_vendor_verification(
    token: dict[str, Any] = Depends(get_bearer_token),
    db: Session = Depends(get_db),
) -> dict[str, Any]:
    account_id = uuid.UUID(token["id"])
    account_type = token["accountType"]
    model = ACCOUNT_TYPE_MODELS.get(account_type)
    if model is None:
        return {"msg": False}
    account = db.scalar(select(model).where(model.id == account_id))
    if account is None:
        return {"msg": False}
    return {"msg": bool(account.verified)}


# POST /api/vendors/vendor-edit-profile
@router.post("/vendor-edit-profile")
def vendor_edit_profile(
    payload: VendorEditProfileRequest,
    token: dict[str, Any] = Depends(get_bearer_token),
    db: Session = Depends(get_db),
) -> dict[str, Any]:
    account_id = uuid.UUID(token["id"])
    model = ACCOUNT_TYPE_MODELS.get(payload.account_type)
    if model is None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid account type")
    account = db.scalar(select(model).where(model.id == account_id))
    if account is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Vendor not found")

    if payload.account_type == "individual":
        if payload.first_name is not None:
            account.first_name = payload.first_name.strip()
        if payload.last_name is not None:
            account.last_name = payload.last_name.strip()
        if payload.phone_number is not None:
            account.phone_number = payload.phone_number.strip()
        if payload.location is not None:
            account.location = payload.location
        if payload.stock_cycle is not None:
            account.stock_cycle = payload.stock_cycle.strip()
    else:
        if payload.shop_name is not None:
            account.shop_name = payload.shop_name.strip()
        if payload.what_do_you_sell is not None:
            account.what_do_you_sell = payload.what_do_you_sell.strip()
        if payload.business_phone_number is not None:
            account.business_phone_number = payload.business_phone_number.strip()
        if payload.momo_account_number is not None:
            account.momo_account_number = payload.momo_account_number.strip()
        if payload.location is not None:
            account.location = payload.location
        if payload.stock_cycle is not None:
            account.stock_cycle = payload.stock_cycle.strip()

    db.commit()
    return {"msg": {"modified": True}}
