from __future__ import annotations

import uuid
from datetime import datetime

from sqlalchemy import DateTime, String, Uuid, func
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base


class VendorDeletionRequest(Base):
    # Same idea as accountDeletionRequestModalVendor in the Node app.
    __tablename__ = "vendor_deletion_requests"

    id: Mapped[uuid.UUID] = mapped_column(
        Uuid,
        primary_key=True,
        default=uuid.uuid4,
    )
    # The vendor account that asked to be deleted. It can be an individual
    # account or a business account, so there is no foreign key here.
    vendor_id: Mapped[uuid.UUID] = mapped_column(
        Uuid,
        nullable=False,
        unique=True,
        index=True,
    )
    account_type: Mapped[str] = mapped_column(String(20), nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
    )
