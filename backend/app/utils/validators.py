"""
Validation helpers (email + password strength).

We keep this logic centralized to ensure consistent error messages.
"""

from __future__ import annotations

import re
from typing import List, Tuple

# Practical (not perfect) email regex for assessments.
EMAIL_REGEX = re.compile(r"^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$")


def validate_email(email: str) -> Tuple[bool, str]:
    """
    Returns (ok, error_message).
    """
    email = (email or "").strip()
    if not email:
        return False, "Email is required."
    if not EMAIL_REGEX.match(email):
        return False, "Invalid email format."
    return True, ""


SPECIAL_CHARS_REGEX = re.compile(r"[^\w\s]")  # anything that's not alnum/_/space


def password_issues(password: str) -> List[str]:
    """
    Return a list of human-friendly password rule violations.
    """
    password = password or ""
    issues: List[str] = []

    if len(password) < 8:
        issues.append("Password must be at least 8 characters long.")
    if not re.search(r"[A-Z]", password):
        issues.append("Password must include at least one uppercase letter (A-Z).")
    if not re.search(r"[a-z]", password):
        issues.append("Password must include at least one lowercase letter (a-z).")
    if not re.search(r"\d", password):
        issues.append("Password must include at least one digit (0-9).")
    if not SPECIAL_CHARS_REGEX.search(password):
        issues.append("Password must include at least one special character (e.g. !@#$%).")

    return issues


def validate_password(password: str) -> Tuple[bool, List[str]]:
    """
    Returns (ok, issues).
    """
    issues = password_issues(password)
    return len(issues) == 0, issues

