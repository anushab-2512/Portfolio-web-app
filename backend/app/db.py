"""
MongoDB connection utilities.

Uses Motor (async MongoDB driver).
"""

from __future__ import annotations

import os
from typing import Optional

from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase

_client: Optional[AsyncIOMotorClient] = None
_db: Optional[AsyncIOMotorDatabase] = None


def _get_settings() -> tuple[str, str]:
    uri = os.getenv("MONGODB_URI", "mongodb://localhost:27017")
    db_name = os.getenv("MONGODB_DB", "twenty20")
    return uri, db_name


async def connect_to_mongo() -> None:
    """
    Initialize a global Motor client + database handle.

    Called on application startup.
    """
    global _client, _db
    if _client is not None and _db is not None:
        return

    uri, db_name = _get_settings()
    _client = AsyncIOMotorClient(uri)
    _db = _client[db_name]

    # Create a unique index for email to prevent duplicates.
    await _db.users.create_index("email", unique=True)


async def close_mongo_connection() -> None:
    """Close the global client on shutdown."""
    global _client, _db
    if _client is not None:
        _client.close()
    _client = None
    _db = None


def get_db() -> AsyncIOMotorDatabase:
    """
    Get the global database handle.

    Note: this assumes `connect_to_mongo()` already ran.
    """
    if _db is None:
        raise RuntimeError("MongoDB is not initialized. Did startup event run?")
    return _db

