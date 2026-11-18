from __future__ import annotations

import uuid
from datetime import datetime
from decimal import Decimal
from typing import Any

from sqlalchemy import (
    Boolean,
    CheckConstraint,
    DateTime,
    Integer,
    Numeric,
    String,
    Uuid,
    func,
)
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.ext.mutable import MutableList
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base


class Product(Base):
    # Same idea as productModel in the Node app.
    __tablename__ = "products"

    __table_args__ = (
        # MongoDB had enum: ["in stock", "out of stock", "preorder"].
        # Postgres enforces the same three values with a check constraint.
        CheckConstraint(
            "availability IN ('in stock', 'out of stock', 'preorder')",
            name="availability",
        ),
    )

    id: Mapped[uuid.UUID] = mapped_column(
        Uuid,
        primary_key=True,
        default=uuid.uuid4,
    )

    # The vendor that owns this product. It can be an individual account or
    # a business account, so there is no foreign key here (same as Node).
    account_owner_id: Mapped[uuid.UUID] = mapped_column(
        Uuid,
        nullable=False,
        index=True,
    )
    account_type: Mapped[str] = mapped_column(String(20), nullable=False)

    # MongoDB stored this as [Mixed]. Here it is a JSONB array.
    # MutableList makes SQLAlchemy notice when the list is changed in place.
    images: Mapped[list[Any]] = mapped_column(
        MutableList.as_mutable(JSONB),
        nullable=False,
    )

    name: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    price: Mapped[Decimal] = mapped_column(Numeric(12, 2), nullable=False)
    gender: Mapped[str] = mapped_column(String(20), nullable=False)
    height: Mapped[Decimal] = mapped_column(Numeric(8, 2), nullable=False)
    unisex: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False,
    )
    main_category: Mapped[str] = mapped_column(String(100), nullable=False)
    # These four were commented out as required in Node, so they are nullable.
    sub_category: Mapped[str | None] = mapped_column(String(100), nullable=True)
    product_type: Mapped[str | None] = mapped_column(String(100), nullable=True)
    colors: Mapped[list[str] | None] = mapped_column(
        MutableList.as_mutable(JSONB),
        nullable=True,
    )
    selected_sizes: Mapped[list[str] | None] = mapped_column(
        MutableList.as_mutable(JSONB),
        nullable=True,
    )

    product_description: Mapped[str] = mapped_column(String, nullable=False)
    product_quantity: Mapped[int] = mapped_column(Integer, nullable=False)
    brand: Mapped[str] = mapped_column(String(150), nullable=False)
    condition: Mapped[str] = mapped_column(String(50), nullable=False)

    # MongoDB stored a JavaScript timestamp number. Postgres stores a real
    # timestamp with time zone instead.
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
        index=True,
    )

    # unique=True allows many NULLs in Postgres, which matches the Node model
    # where offerId defaults to null but must be unique when it is set.
    offer_id: Mapped[str | None] = mapped_column(
        String(255),
        unique=True,
        nullable=True,
    )
    link: Mapped[str | None] = mapped_column(String, nullable=True)
    image_link: Mapped[str | None] = mapped_column(String, nullable=True)
    availability: Mapped[str] = mapped_column(
        String(20),
        default="in stock",
        nullable=False,
    )
    content_language: Mapped[str] = mapped_column(
        String(10),
        default="en",
        nullable=False,
    )
    target_country: Mapped[str] = mapped_column(
        String(10),
        default="GH",
        nullable=False,
    )
    currency: Mapped[str] = mapped_column(
        String(10),
        default="GHS",
        nullable=False,
    )
    # Public product URL. unique=True allows NULL when it is not set yet.
    short_path: Mapped[str | None] = mapped_column(
        String(255),
        unique=True,
        nullable=True,
    )

    # NOTE: the Node model had a MongoDB text index on name, description,
    # subCategory, brand and gender. MongoDB text indexes do not exist in
    # Postgres, so it needs a separate GIN index built with to_tsvector.
    # For now there is a normal index on `name` above.
