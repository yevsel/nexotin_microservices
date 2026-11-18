from __future__ import annotations

import uuid
from datetime import datetime
from typing import Any

from sqlalchemy import DateTime, String, Uuid, func
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.ext.mutable import MutableDict
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base


class ProductComplain(Base):
    """Port of the Node ``productComplainsModel``."""

    __tablename__ = "product_complains"

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=uuid.uuid4)

    product_id: Mapped[str] = mapped_column(String(64), nullable=False, index=True)
    complain_text: Mapped[str] = mapped_column(String, nullable=False)
    complain_by: Mapped[dict[str, Any] | None] = mapped_column(
        MutableDict.as_mutable(JSONB), nullable=True
    )
    complain_to: Mapped[dict[str, Any] | None] = mapped_column(
        MutableDict.as_mutable(JSONB), nullable=True
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now(), index=True
    )