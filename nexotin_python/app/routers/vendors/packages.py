from __future__ import annotations

import uuid
from datetime import datetime, timezone
from typing import Any

from dateutil.relativedelta import relativedelta
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import VendorPackage
from app.security import get_bearer_token

router = APIRouter()


# POST /api/vendors/get-vendor-packages-details
@router.post("/get-vendor-packages-details")
def get_vendor_packages_details(
    token: dict[str, Any] = Depends(get_bearer_token),
    db: Session = Depends(get_db),
) -> dict[str, Any]:
    account_id = uuid.UUID(token["id"])
    account_type = token["accountType"]
    package = db.scalar(
        select(VendorPackage).where(
            VendorPackage.vendor_id == account_id,
            VendorPackage.vendor_account_type == account_type,
        )
    )
    if package is None:
        return {"msg": None}
    return {
        "msg": {
            "id": package.id,
            "expiresAt": package.expires_at,
            "vendorId": str(package.vendor_id),
            "vendorAccountType": package.vendor_account_type,
            "packageType": package.package_type,
            "createdAt": package.created_at,
        }
    }
