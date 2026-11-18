from __future__ import annotations

import uuid
from datetime import datetime
from typing import Any

from sqlalchemy import DateTime, String, Uuid, func
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.ext.mutable import MutableDict
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base


class User(Base):
    """Buyer/customer account, ported from the Node ``userModel``.

    Mongo's ``Mixed`` fields (``profileImage`` and ``location``) are stored
    as JSONB because they hold arbitrary Cloudinary/location objects.
    """

    __tablename__ = "users"

    id: Mapped[uuid.UUID] = mapped_column(
        Uuid,
        primary_key=True,
        default=uuid.uuid4,
    )

    profile_image: Mapped[dict[str, Any] | None] = mapped_column(
        MutableDict.as_mutable(JSONB),
        nullable=True,
    )
    first_name: Mapped[str] = mapped_column(String(100), nullable=False)
    last_name: Mapped[str | None] = mapped_column(String(100), nullable=True)
    phone_number: Mapped[str | None] = mapped_column(String(32), nullable=True)
    gender: Mapped[str | None] = mapped_column(String(32), nullable=True)
    username: Mapped[str | None] = mapped_column(
        String(50),
        unique=True,
        nullable=True,
    )
    # Stores the bcrypt/argon2 hash, never the plaintext password. Nullable
    # because Google sign-in creates users without a password.
    password: Mapped[str | None] = mapped_column(String(255), nullable=True)
    email: Mapped[str] = mapped_column(String(320), unique=True, nullable=False)
    location: Mapped[dict[str, Any] | None] = mapped_column(
        MutableDict.as_mutable(JSONB),
        nullable=True,
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
        index=True,
    )

    def __repr__(self) -> str:
        return f"<User id={self.id!r} email={self.email!r}>"
