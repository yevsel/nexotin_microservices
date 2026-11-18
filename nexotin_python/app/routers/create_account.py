from __future__ import annotations

from datetime import datetime, timezone
from typing import Any

from dateutil.relativedelta import relativedelta
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import or_, select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import BusinessAccount, IndividualAccount, VendorPackage
from app.schemas.create_account import (
    BusinessSignupRequest,
    IndividualSignupRequest,
)
from app.security import generate_short_id, hash_password
from app.tasks.email import send_vendor_welcome_email

router = APIRouter()


# POST /api/create-account
#
# FastAPI reads the JSON body into either IndividualSignupRequest or
# BusinessSignupRequest. The "accountType" field decides which one.
@router.post("/create-account")
def create_account(
    payload: IndividualSignupRequest | BusinessSignupRequest,
    db: Session = Depends(get_db),  # get_db gives this request a DB session
) -> dict[str, Any]:
    # ------------------------- INDIVIDUAL VENDOR -------------------------
    if isinstance(payload, IndividualSignupRequest):
        # Match the Node route: trim the phone and lowercase the email.
        email = str(payload.email).strip().lower()
        phone_number = payload.phone_number.strip()

        # Check if this email or phone number is already used.
        existing = db.scalar(
            select(IndividualAccount).where(
                or_(
                    IndividualAccount.email == email,
                    IndividualAccount.phone_number == phone_number,
                )
            )
        )
        if existing:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Account already exist",
            )

        # Public vendor URL, for example:
        # https://www.nexotin.com/v/KgsYUJ
        short_path = f"https://www.nexotin.com/v/{generate_short_id()}"

        # Build the new account row. The password is hashed before saving.
        account = IndividualAccount(
            account_type="individual",
            first_name=payload.first_name.strip(),
            last_name=payload.last_name.strip(),
            password=hash_password(payload.password.strip()),
            phone_number=phone_number,
            email=email,
            location=payload.location,
            stock_cycle=payload.stock_cycle.strip(),
            short_path=short_path,
        )

        try:
            # Add the account to the session.
            db.add(account)

            # flush() runs the INSERT so account.id is generated, but it does
            # not save permanently yet. That lets us use account.id below.
            db.flush()

            # Every new vendor gets the free Starter package.
            db.add(
                VendorPackage(
                    expires_at=datetime.now(timezone.utc)
                    + relativedelta(months=3),
                    vendor_id=account.id,
                    vendor_account_type="individual",
                    package_type={
                        "id": 1,
                        "title": "Starter",
                        "price": 0,
                        "period": "First 3 months",
                        "description1": "Unlimited products",
                        "description2": "unlimited videos",
                        "paymentOptions": ["3 Months"],
                    },
                )
            )

            # The account and its package are saved together. If one fails,
            # neither is saved.
            db.commit()
        except IntegrityError:
            # A database UNIQUE constraint failed, usually a duplicate email.
            db.rollback()
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Account already exist",
            ) from None

        # Reload the row so values created by the database are available
        # (for example created_at).
        db.refresh(account)

        # The account is saved. Now hand the email to Celery.
        # .delay() only puts a message on RabbitMQ and returns immediately,
        # so the phone doesn't wait for Gmail.
        # The Node route used lastName + " " + firstName.
        send_vendor_welcome_email.delay(
            account.email,
            f"{account.last_name} {account.first_name}",
        )

        return {
            "msg": "Account created successfully",
            "data": {
                "id": str(account.id),
                "accountType": account.account_type,
                "shortPath": account.short_path,
            },
        }

    # ------------------------- BUSINESS VENDOR ---------------------------
    # Same flow as above, but business accounts use shop/company fields.
    if isinstance(payload, BusinessSignupRequest):
        email = str(payload.business_email).strip().lower()
        phone_number = payload.business_phone_number.strip()

        # Check if this business email or phone number is already used.
        existing = db.scalar(
            select(BusinessAccount).where(
                or_(
                    BusinessAccount.business_email == email,
                    BusinessAccount.business_phone_number == phone_number,
                )
            )
        )
        if existing:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Account already exist",
            )

        short_path = f"https://www.nexotin.com/v/{generate_short_id()}"

        account = BusinessAccount(
            account_type="business",
            shop_name=payload.shop_name.strip(),
            what_do_you_sell=payload.what_do_you_sell.strip(),
            password=hash_password(payload.password.strip()),
            business_phone_number=phone_number,
            business_email=email,
            momo_account_number=payload.momo_account_number.strip(),
            location=payload.location,
            stock_cycle=payload.stock_cycle.strip(),
            short_path=short_path,
        )

        try:
            # Insert the business account and get its generated UUID.
            db.add(account)
            db.flush()

            # Give the business the same free Starter package.
            db.add(
                VendorPackage(
                    expires_at=datetime.now(timezone.utc)
                    + relativedelta(months=3),
                    vendor_id=account.id,
                    vendor_account_type="business",
                    package_type={
                        "id": 1,
                        "title": "Starter",
                        "price": 0,
                        "period": "First 3 months",
                        "description1": "Unlimited products",
                        "description2": "unlimited videos",
                        "paymentOptions": ["3 Months"],
                    },
                )
            )

            db.commit()
        except IntegrityError:
            db.rollback()
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Account already exist",
            ) from None

        db.refresh(account)

        # Same handover as the individual branch.
        # The Node route used the shop name for business accounts.
        send_vendor_welcome_email.delay(account.business_email, account.shop_name)

        return {
            "msg": "Account created successfully",
            "data": {
                "id": str(account.id),
                "accountType": account.account_type,
                "shortPath": account.short_path,
            },
        }

    # Pydantic should already reject unknown account types, but this is a
    # fallback in case the type changes later.
    raise HTTPException(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        detail="Invalid account type",
    )
