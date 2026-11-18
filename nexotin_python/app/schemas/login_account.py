from __future__ import annotations

from pydantic import BaseModel, EmailStr, Field


class LoginRequest(BaseModel):
    # The mobile app sends { email, password }, the same as the Node route.
    email: EmailStr
    password: str = Field(min_length=1)
