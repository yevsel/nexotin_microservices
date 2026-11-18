import uuid

from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Product

router = APIRouter()


@router.get("/get-one-product")
def get_one_product(id: uuid.UUID, db: Session = Depends(get_db)):
    try:
        # Find the product with this id.
        product = db.scalar(select(Product).where(Product.id == id))

        # No product with that id.
        if product is None:
            return JSONResponse(status_code=404, content={"msg": None})

        product_info_to_send = {
            "id": str(product.id),
            "name": product.name,
        }
        return {"msg": product_info_to_send}

    except Exception as error:
        # Same as the Node route: send the error message back with 404.
        print(error)
        return JSONResponse(status_code=404, content={"msg": str(error)})
