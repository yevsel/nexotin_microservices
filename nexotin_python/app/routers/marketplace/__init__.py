from fastapi import APIRouter

from app.routers.marketplace import (
    buyers,
    catalog,
    orders,
    reviews,
    search,
    subscriptions,
)

router = APIRouter()

router.include_router(catalog.router, prefix="/api/marketplace")
router.include_router(search.router, prefix="/api/marketplace")
router.include_router(orders.router, prefix="/api/marketplace")
router.include_router(reviews.router, prefix="/api/marketplace")
router.include_router(subscriptions.router, prefix="/api/marketplace")
router.include_router(buyers.router, prefix="/api/marketplace")

__all__ = ["router"]
