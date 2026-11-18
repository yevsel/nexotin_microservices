from __future__ import annotations

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class BuyerRegisterRequest(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    first_name: str = Field(alias="firstName", min_length=1)
    last_name: str = Field(alias="lastName", min_length=1)
    phone_number: str = Field(alias="phoneNumber", min_length=1)
    password: str = Field(min_length=1)
    email: EmailStr


class BuyerLoginRequest(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    email: EmailStr
    password: str = Field(min_length=1)
