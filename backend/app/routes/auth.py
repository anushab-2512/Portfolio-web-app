"""
Authentication routes (register + login).

Constraints (per assessment):
- No sessions
- No JWT

So these endpoints only validate credentials and return user profile data
to the frontend, which can then redirect to the portfolio page.
"""

from __future__ import annotations

from typing import Any, Dict

from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, Field
from pymongo.errors import DuplicateKeyError

from backend.app.db import get_db
from backend.app.utils.security import hash_password, verify_password
from backend.app.utils.validators import validate_email, validate_password

router = APIRouter(prefix="/api", tags=["auth"])


class RegisterRequest(BaseModel):
    email: str = Field(..., examples=["user@example.com"])
    password: str = Field(..., min_length=1)
    confirm_password: str = Field(..., min_length=1)


class LoginRequest(BaseModel):
    email: str = Field(..., examples=["user@example.com"])
    password: str = Field(..., min_length=1)


def _public_user(doc: Dict[str, Any]) -> Dict[str, Any]:
    """Return only safe user fields for the browser."""
    return {
        "email": doc.get("email"),
        "username": doc.get("username"),
    }


@router.post("/register", status_code=status.HTTP_201_CREATED)
async def register(payload: RegisterRequest) -> Dict[str, Any]:
    email_ok, email_err = validate_email(payload.email)
    if not email_ok:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=email_err)

    if payload.password != payload.confirm_password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Passwords do not match.",
        )

    pw_ok, pw_issues = validate_password(payload.password)
    if not pw_ok:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={"message": "Weak password.", "issues": pw_issues},
        )

    db = get_db()

    existing = await db.users.find_one({"email": payload.email.strip().lower()})
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="User already exists.",
        )

    # Simple username derivation (since the schema only includes email/username/password).
    # Example: "alex.smith@gmail.com" -> "alex.smith"
    normalized_email = payload.email.strip().lower()
    username = normalized_email.split("@", 1)[0]

    try:
        hashed = hash_password(payload.password)
    except ValueError:
        # bcrypt 5+ can raise for very long passwords (>72 bytes)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password is too long.",
        )
    try:
        await db.users.insert_one(
            {
                "email": normalized_email,
                "username": username,
                "password": hashed,  # store only bcrypt hash
            }
        )
    except DuplicateKeyError:
        # If two requests race, the unique index is the source of truth.
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="User already exists.",
        )

    return {"message": "Registration successful."}


@router.post("/login", status_code=status.HTTP_200_OK)
async def login(payload: LoginRequest) -> Dict[str, Any]:
    email_ok, email_err = validate_email(payload.email)
    if not email_ok:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=email_err)

    if not payload.password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password is required.",
        )

    db = get_db()
    normalized_email = payload.email.strip().lower()
    user = await db.users.find_one({"email": normalized_email})
    if not user or not verify_password(payload.password, user.get("password", "")):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
        )

    return {"message": "Login successful.", "user": _public_user(user)}

