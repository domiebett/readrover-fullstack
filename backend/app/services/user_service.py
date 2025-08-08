from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import IntegrityError
from app.models.user import User
from app.schemas.user import UserCreate
from sqlalchemy import select

async def get_user_by_email_case_insensitive(db: AsyncSession, email: str):
    result = await db.execute(
        select(User).where(User.email.ilike(email))
    )
    return result.scalar_one_or_none()

async def create_new_user(db: AsyncSession, user_in: UserCreate, hashed_password: str):
    new_user = User(
        first_name=user_in.first_name,
        last_name=user_in.last_name,
        email=user_in.email,
        hashed_password=hashed_password,
    )
    db.add(new_user)
    try:
        await db.commit()
        await db.refresh(new_user)
    except IntegrityError:
        await db.rollback()
        raise
    return new_user
