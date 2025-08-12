# --- Imports ---

from passlib.context import CryptContext
from typing import Optional
from jose import jwt, JWTError
from datetime import datetime, timedelta
from fastapi import HTTPException, Request
from app.core import config

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


# --- Config ---
def SECRET_KEY():
    return config.get_secret_key()


def ALGORITHM():
    return config.get_algorithm()


def ACCESS_TOKEN_EXPIRE_MINUTES():
    return config.get_access_token_expire_minutes()


# --- Password Hashing ---
def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


def authenticate_user(user, password: str):
    if not user:
        return False
    if not verify_password(password, user.hashed_password):
        return False
    return user


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta is None:
        expires_delta = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES())
    expire = datetime.utcnow() + expires_delta
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY(), algorithm=ALGORITHM())
    return encoded_jwt


# Dependency for extracting and validating user from JWT in cookie
def get_current_user(request: Request):
    token = request.cookies.get("access_token")
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = jwt.decode(token, SECRET_KEY(), algorithms=[ALGORITHM()])
        user_id = payload.get("sub")
        email = payload.get("email")
        if user_id is None or email is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        return {"user_id": user_id, "email": email}
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
