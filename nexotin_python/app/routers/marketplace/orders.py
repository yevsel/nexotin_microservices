from __future__ import annotations

import uuid
from datetime import datetime, timezone
from decimal import Decimal
from typing import Any

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select, update
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Order, User
from app.security import decode_token, get_bearer_token

router = APIRouter()


def _order_data(order: Order) -> dict[str, Any]:
    return {
        "id": str(order.id),
        "orderNumber": order.order_number,
        "totalPrice": float(order.total_price),
        "orderStatus": order.order_status,
        "vendorEmail": order.vendor_email,
        "vendorId": str(order.vendor_id) if order.vendor_id else None,
        "buyerId": str(order.buyer_id) if order.buyer_id else None,
        "buyerLandmark": order.buyer_landmark,
        "buyerLocation": order.buyer_location,
        "buyerPhoneNumber": order.buyer_phone_number,
        "vendorAccountType": order.vendor_account_type,
        "orders": order.orders,
        "paid": order.paid,
        "createdAt": order.created_at,
        "updatedAt": order.updated_at,
    }


# POST /api/marketplace/make-order
@router.post("/make-order")
def make_order(
    payload: dict[str, Any],
    db: Session = Depends(get_db),
) -> dict[str, Any]:
    products = payload.get("products") or []
    total_price = payload.get("totalPrice")
    order_number = payload.get("orderNumber")
    buyer_location = payload.get("buyerLocation")
    buyer_jwt = payload.get("buyerJWTToken")
    landmark = payload.get("landmark")
    vendors_email = payload.get("vendorsEmail")
    phone_number = payload.get("phoneNumber")

    buyer_id: uuid.UUID | None = None
    if buyer_jwt:
        try:
            info = decode_token(str(buyer_jwt))
            buyer_id = uuid.UUID(info["id"])
        except Exception:
            buyer_id = None

    if not isinstance(vendors_email, list):
        vendors_email = [vendors_email] if vendors_email else []

    # Unique vendors in the cart (by accountOwnerID + accountType).
    unique_vendors: list[tuple[str, str]] = []
    seen: set[tuple[str, str]] = set()
    for p in products:
        key = (str(p.get("accountOwnerID")), str(p.get("accountType")))
        if key not in seen:
            seen.add(key)
            unique_vendors.append(key)

    for idx, (vendor_id_str, account_type) in enumerate(unique_vendors):
        vendor_products = [
            p for p in products
            if str(p.get("accountOwnerID")) == vendor_id_str
            and str(p.get("accountType")) == account_type
        ]
        vendor_email = vendors_email[idx] if idx < len(vendors_email) else None
        try:
            vendor_uuid = uuid.UUID(vendor_id_str)
        except (ValueError, TypeError):
            vendor_uuid = None

        order = Order(
            order_number=str(order_number),
            total_price=Decimal(str(total_price)) if total_price is not None else Decimal("0"),
            vendor_email=vendor_email,
            vendor_id=vendor_uuid,
            buyer_id=buyer_id,
            buyer_jwt_token=buyer_jwt,
            buyer_landmark=landmark,
            buyer_location=buyer_location,
            buyer_phone_number=phone_number,
            vendor_account_type=account_type,
            orders=vendor_products,
            paid=1,
            order_status=1,
        )
        db.add(order)

    db.commit()
    return {"msg": "Order made successfully, you will be notified if any update."}


# POST /api/marketplace/get-orders-for-buyer
@router.post("/get-orders-for-buyer")
def get_orders_for_buyer(
    token: dict[str, Any] = Depends(get_bearer_token),
    db: Session = Depends(get_db),
) -> dict[str, Any]:
    buyer_id = uuid.UUID(token["id"])
    orders = db.scalars(
        select(Order).where(Order.buyer_id == buyer_id).order_by(Order.created_at.desc())
    ).all()
    return {"msg": [_order_data(o) for o in orders]}


# POST /api/marketplace/update-order-payment-status
@router.post("/update-order-payment-status")
def update_order_payment_status(
    payload: dict[str, Any],
    db: Session = Depends(get_db),
) -> dict[str, Any]:
    order_number = payload.get("orderNumber")
    payment_status = payload.get("paymentStatus")
    if order_number is None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="orderNumber required")
    result = db.execute(
        update(Order).where(Order.order_number == str(order_number)).values(paid=int(payment_status))
    )
    db.commit()
    return {"msg": {"modified": result.rowcount}}


# POST /api/marketplace/calculate-delivery-price
@router.post("/calculate-delivery-price")
def calculate_delivery_price(payload: dict[str, Any]) -> dict[str, Any]:
    distance = payload.get("distanceInKM")
    try:
        d = float(distance)
    except (TypeError, ValueError):
        return {"deliveryFee": 0}
    if d < 13:
        price = 37
    elif d < 18:
        price = 47
    elif d < 26:
        price = 58
    elif d < 36:
        price = 68
    elif d < 46:
        price = 78
    elif d < 50:
        price = 88
    elif d < 100:
        price = 70
    elif d < 400:
        price = 80
    else:
        price = 120
    return {"deliveryFee": price}
