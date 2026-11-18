from fastapi import APIRouter

from app.routers.vendors import count, info, packages, products

router = APIRouter()

router.include_router(products.router, prefix="/api/vendors")
router.include_router(info.router, prefix="/api/vendors")
router.include_router(packages.router, prefix="/api/vendors")
router.include_router(count.router, prefix="/api/vendors")

__all__ = ["router"]
