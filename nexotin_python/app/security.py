import os
import secrets
import string
from typing import Any

import bcrypt
import jwt
from fastapi import Header, HTTPException, status


def hash_password(password: str) -> str:
    return bcrypt.hashpw(
        password.encode("utf-8"),
        bcrypt.gensalt(rounds=13),
    ).decode("utf-8")


def generate_short_id(length: int = 6) -> str:
    alphabet = string.ascii_letters + string.digits
    return "".join(secrets.choice(alphabet) for _ in range(length))


# Same env var name the Node routes used.
LOGIN_SECRET = os.getenv("LOGIN_SECRET", "nexotin_dev_login_secret")


def decode_token(token: str) -> dict[str, Any]:
    """Decode a Nexotin JWT. Raises jwt.PyJWTError on failure."""
    return jwt.decode(token, LOGIN_SECRET, algorithms=["HS256"])


def get_bearer_token(
    authorization: str | None = Header(default=None),
) -> dict[str, Any]:
    """FastAPI dependency: extract and verify the Bearer token.

    Returns the decoded payload (``{"id", "accountType", "exp"}``).
    Raises 401 on missing/invalid tokens.
    """
    if not authorization or not authorization.lower().startswith("bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing or invalid Authorization header",
        )
    token = authorization.split(" ", 1)[1].strip()
    try:
        return decode_token(token)
    except jwt.PyJWTError as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid or expired token: {exc}",
        ) from exc

