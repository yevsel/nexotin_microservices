from fastapi import APIRouter

from app.routers.auth import buyer, vendor_create, vendor_login

router = APIRouter()

router.include_router(vendor_create.router, prefix="/api/auth")
router.include_router(vendor_login.router, prefix="/api/auth")
router.include_router(buyer.router, prefix="/api/auth")

__all__ = ["router"]
