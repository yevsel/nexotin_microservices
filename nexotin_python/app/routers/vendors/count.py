from __future__ import annotations

import uuid
from typing import Any

from fastapi import APIRouter, Depends
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Product

router = APIRouter()


# POST /api/vendors/count-vendor-product-and-video
@router.post("/count-vendor-product-and-video")
def count_vendor_product_and_video(
    payload: dict[str, Any],
    db: Session = Depends(get_db),
) -> dict[str, Any]:
    vendor_id_raw = payload.get("vendorId")
    if not vendor_id_raw:
        return {"msg": {"productCount": 0, "videoCount": 0}}
    vendor_id = uuid.UUID(str(vendor_id_raw))
    product_count = db.scalar(
        select(func.count()).select_from(Product).where(Product.account_owner_id == vendor_id)
    ) or 0
    # Videos not ported yet; return 0 until the Video model lands.
    video_count = 0
    return {"msg": {"productCount": int(product_count), "videoCount": int(video_count)}}
