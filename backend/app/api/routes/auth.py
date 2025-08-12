from fastapi import APIRouter, Response, HTTPException, status, Depends
from app.schemas.user import LoginRequest
from app.utils.auth_utils import (
    authenticate_user,
    create_access_token,
    get_password_hash,
)
from app.utils.auth_utils import get_current_user
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import IntegrityError
from app.schemas.user import UserCreate
from app.services.user_service import (
    get_user_by_email_case_insensitive,
    create_new_user,
)
from app.core.database import get_db


router = APIRouter()


@router.post("/register", status_code=status.HTTP_201_CREATED)
async def register_user(
    user_in: UserCreate,
    db: AsyncSession = Depends(get_db),
):
    # Check if user already exists (case-insensitive)
    existing_user = await get_user_by_email_case_insensitive(db, user_in.email)
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_password = get_password_hash(user_in.password)
    try:
        new_user = await create_new_user(db, user_in, hashed_password)
    except IntegrityError:
        raise HTTPException(status_code=400, detail="Email already registered")
    return {"id": new_user.id, "email": new_user.email}


@router.post("/login")
async def login(
    response: Response,
    body: LoginRequest,
    db: AsyncSession = Depends(get_db),
):
    db_user = await get_user_by_email_case_insensitive(db, body.email)
    user = authenticate_user(db_user, body.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    access_token = create_access_token(
        data={"sub": str(user.id), "email": user.email}
    )
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        samesite="lax"
    )
    return {"msg": "Login successful"}


@router.post("/logout")
def logout(response: Response):
    response.set_cookie(
        key="access_token", value="", httponly=True, samesite="lax", expires=0
    )
    return {"msg": "Logged out"}


@router.get("/me")
async def me(
    token_data: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    user = await get_user_by_email_case_insensitive(db, token_data["email"])
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return {
        "username": user.username,
        "email": user.email,
        "created_at": user.created_at,
        "updated_at": user.updated_at,
    }
