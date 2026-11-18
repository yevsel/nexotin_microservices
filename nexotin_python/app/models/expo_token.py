from __future__ import annotations

import uuid
from datetime import datetime

from sqlalchemy import DateTime, String, Uuid, func
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base


class ExpoToken(Base):
    """Port of the Node ``expoNotificationTokensModel`` (per-owner tokens)."""

    __tablename__ = "expo_tokens"

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=uuid.uuid4)

    owner_id: Mapped[uuid.UUID] = mapped_column(Uuid, nullable=False, index=True)
    expo_token: Mapped[str] = mapped_column(String(255), nullable=False)
    role: Mapped[str] = mapped_column(String(32), nullable=False, default="mobile")


class ExpoFreeToken(Base):
    """Port of the Node ``expoTokenFreeModel`` (broadcast tokens)."""

    __tablename__ = "expo_free_tokens"

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=uuid.uuid4)

    expo_token: Mapped[str] = mapped_column(String(255), nullable=False, unique=True)
    role: Mapped[str] = mapped_column(String(32), nullable=False, default="mobile")