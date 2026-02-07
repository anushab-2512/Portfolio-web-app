"""
Security utilities: bcrypt hashing + verification.
"""

from __future__ import annotations

import bcrypt


def hash_password(plain_password: str) -> str:
    """
    Hash a password using bcrypt and return a UTF-8 string for storage.
    """
    pw_bytes = (plain_password or "").encode("utf-8")
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(pw_bytes, salt)
    return hashed.decode("utf-8")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verify a password against a stored bcrypt hash.
    """
    try:
        pw_bytes = (plain_password or "").encode("utf-8")
        hash_bytes = (hashed_password or "").encode("utf-8")
        return bcrypt.checkpw(pw_bytes, hash_bytes)
    except Exception:
        # Any error counts as verification failure.
        return False

