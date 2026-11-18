from __future__ import annotations

from typing import Any, Literal

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class IndividualSignupRequest(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    account_type: Literal["individual"] = Field(alias="accountType")
    first_name: str = Field(alias="firstName", min_length=1)
    last_name: str = Field(alias="lastName", min_length=1)
    password: str = Field(min_length=1)
    phone_number: str = Field(alias="phoneNumber", min_length=1)
    email: EmailStr
    location: dict[str, Any]
    stock_cycle: str = Field(alias="stockCycle", min_length=1)


class BusinessSignupRequest(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    account_type: Literal["business"] = Field(alias="accountType")
    shop_name: str = Field(alias="shopName", min_length=1)
    what_do_you_sell: str = Field(alias="whatDoYouSell", min_length=1)
    business_phone_number: str = Field(alias="businessPhoneNumber", min_length=1)
    business_email: EmailStr = Field(alias="businessEmail")
    stock_cycle: str = Field(alias="stockCycle", min_length=1)
    momo_account_number: str = Field(alias="momoAccountNumber", min_length=1)
    location: dict[str, Any]
    password: str = Field(min_length=1)
