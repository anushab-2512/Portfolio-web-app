"""
FastAPI entrypoint.

Serves:
- Frontend pages from / (landing) and /portfolio
- Static frontend assets from /static
- Auth API routes under /api
"""

from __future__ import annotations

import os
from pathlib import Path

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

from backend.app.db import close_mongo_connection, connect_to_mongo
from backend.app.routes.auth import router as auth_router

# Load env vars from backend/.env if present
load_dotenv()

app = FastAPI(title="Twenty20 Auth Demo", version="1.0.0")

# --- Static / Frontend paths ---
ROOT = Path(__file__).resolve().parents[2]  # .../twenty20/
FRONTEND_DIR = ROOT / "frontend"

app.mount("/static", StaticFiles(directory=str(FRONTEND_DIR)), name="static")


@app.on_event("startup")
async def _startup() -> None:
    await connect_to_mongo()


@app.on_event("shutdown")
async def _shutdown() -> None:
    await close_mongo_connection()


app.include_router(auth_router)


@app.get("/", include_in_schema=False)
async def landing_page() -> FileResponse:
    return FileResponse(path=str(FRONTEND_DIR / "index.html"))


@app.get("/portfolio", include_in_schema=False)
async def portfolio_page() -> FileResponse:
    return FileResponse(path=str(FRONTEND_DIR / "portfolio.html"))


# Health endpoint (useful for deployment checks)
@app.get("/health", include_in_schema=False)
async def health() -> dict:
    return {"status": "ok"}


def _main() -> None:
    """
    Optional local entrypoint:
    python -m backend.app.main
    """
    import uvicorn

    host = os.getenv("APP_HOST", "127.0.0.1")
    port = int(os.getenv("APP_PORT", "8000"))
    # reload_dirs: only watch backend/frontend, not .venv (avoids reload loops)
    uvicorn.run(
        "backend.app.main:app",
        host=host,
        port=port,
        reload=True,
        reload_dirs=["backend", "frontend"],
    )


if __name__ == "__main__":
    _main()

