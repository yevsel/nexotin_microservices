from __future__ import annotations

import uuid
from datetime import datetime
from typing import Any

from sqlalchemy import Boolean, DateTime, String, Uuid, func
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.ext.mutable import MutableDict
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base


class IndividualAccount(Base):
    __tablename__ = "individual_accounts"

    id: Mapped[uuid.UUID] = mapped_column(
        Uuid,
        primary_key=True,
        default=uuid.uuid4,
    )
    account_type: Mapped[str] = mapped_column(
        String(20),
        default="individual",
        nullable=False,
    )
    banner_image: Mapped[dict[str, Any] | None] = mapped_column(
        MutableDict.as_mutable(JSONB),
        nullable=True,
    )
    profile_image: Mapped[dict[str, Any] | None] = mapped_column(
        MutableDict.as_mutable(JSONB),
        nullable=True,
    )
    first_name: Mapped[str] = mapped_column(String(100), nullable=False)
    last_name: Mapped[str] = mapped_column(String(100), nullable=False)
    location: Mapped[dict[str, Any]] = mapped_column(
        MutableDict.as_mutable(JSONB),
        nullable=False,
    )
    password: Mapped[str] = mapped_column(String(255), nullable=False)
    phone_number: Mapped[str] = mapped_column(String(32), nullable=False)
    email: Mapped[str] = mapped_column(
        String(320),
        unique=True,
        nullable=False,
    )
    verified: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False,
    )
    stock_cycle: Mapped[str] = mapped_column(String(50), nullable=False)
    short_path: Mapped[str | None] = mapped_column(
        String(255),
        unique=True,
        nullable=True,
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
        index=True,
    )
