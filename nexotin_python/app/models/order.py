from __future__ import annotations

import uuid
from datetime import datetime
from decimal import Decimal
from typing import Any

from sqlalchemy import DateTime, Integer, Numeric, String, Uuid, func
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.ext.mutable import MutableDict, MutableList
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base


class Order(Base):
    """Port of the Node ``ordersModel``."""

    __tablename__ = "orders"

    id: Mapped[uuid.UUID] = mapped_column(
        Uuid, primary_key=True, default=uuid.uuid4
    )

    order_number: Mapped[str] = mapped_column(String(64), nullable=False, index=True)
    total_price: Mapped[Decimal] = mapped_column(Numeric(12, 2), nullable=False)
    # 1 = pending, 2 = processing, 3 = completed, 4 = cancelled, 5 = refunded
    order_status: Mapped[int] = mapped_column(Integer, default=1, nullable=False)
    vendor_email: Mapped[str | None] = mapped_column(String(320), nullable=True)
    vendor_id: Mapped[uuid.UUID | None] = mapped_column(Uuid, nullable=True)
    buyer_id: Mapped[uuid.UUID | None] = mapped_column(Uuid, nullable=True)
    buyer_jwt_token: Mapped[str | None] = mapped_column(String, nullable=True)
    buyer_landmark: Mapped[str | None] = mapped_column(String, nullable=True)
    buyer_location: Mapped[dict[str, Any] | None] = mapped_column(
        MutableDict.as_mutable(JSONB), nullable=True
    )
    buyer_phone_number: Mapped[str | None] = mapped_column(String(32), nullable=True)
    vendor_account_type: Mapped[str | None] = mapped_column(String(20), nullable=True)
    # The list of purchased product docs.
    orders: Mapped[list[Any]] = mapped_column(
        MutableList.as_mutable(JSONB), nullable=False, default=list
    )
    # 1 = not paid, 2 = paid, 3 = pay on delivery
    paid: Mapped[int] = mapped_column(Integer, default=1, nullable=False)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now(), index=True
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )

    def __repr__(self) -> str:
        return f"<Order id={self.id!r} number={self.order_number!r}>"