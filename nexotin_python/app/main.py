from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import init_db
from app.routers.create_account import router as create_account_router
from app.routers.get_one_product import router as get_one_product_router
from app.routers.login_account import router as login_account_router

@asynccontextmanager
async def lifespan(_: FastAPI):
    init_db()
    yield


app = FastAPI(
    title="Nexotin API",
    version="0.1.0",
    lifespan=lifespan,
)

# Matches the old Express server's permissive CORS setup. Tighten this
# before production.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(create_account_router, prefix="/api")
app.include_router(get_one_product_router, prefix="/api")
app.include_router(login_account_router, prefix="/api")


@app.get("/", tags=["health"])
def root() -> dict[str, str]:
    return {"message": "Nexotin API"}


@app.get("/health", tags=["health"])
def health() -> dict[str, str]:
    return {"status": "ok"}
