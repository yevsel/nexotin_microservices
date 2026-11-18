import os
from collections.abc import Generator

from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker

from app.models.base import Base

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql+psycopg://nexotin:nexotin_dev_password@localhost:5432/nexotin",
)

engine = create_engine(DATABASE_URL, pool_pre_ping=True)
SessionLocal = sessionmaker(
    bind=engine,
    autoflush=False,
    autocommit=False,
    expire_on_commit=False,
)


def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db() -> None:
    # Importing the package registers every model on Base.metadata.
    import app.models  # noqa: F401

    Base.metadata.create_all(bind=engine)
