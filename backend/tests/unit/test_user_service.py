import pytest
from app.services import user_service
from app.schemas.user import UserCreate
from app.models.user import User
from sqlalchemy.exc import IntegrityError
from tests.unit.test_utils import make_mock_db_execute, make_mock_db_commit


@pytest.mark.asyncio
async def test_get_user_by_email_case_insensitive_found():
    user = User(
        id=1, first_name="A", last_name="B",
        email="test@example.com", hashed_password="password123"
    )
    db = make_mock_db_execute(user)
    result = await user_service.get_user_by_email_case_insensitive(
        db, "test@example.com"
    )
    assert result == user
    db.execute.assert_awaited()


@pytest.mark.asyncio
async def test_get_user_by_email_case_insensitive_not_found():
    db = make_mock_db_execute(None)
    result = await user_service.get_user_by_email_case_insensitive(
        db, "notfound@example.com"
    )
    assert result is None
    db.execute.assert_awaited()


@pytest.mark.asyncio
async def test_create_new_user_success():
    db = make_mock_db_commit()
    user_in = UserCreate(
        first_name="A",
        last_name="B",
        email="test@example.com",
        password="password123"
    )
    hashed_password = "hashed"
    user = await user_service.create_new_user(db, user_in, hashed_password)
    assert isinstance(user, User)
    db.add.assert_called_once()
    db.commit.assert_awaited_once()
    db.refresh.assert_awaited_once_with(user)


@pytest.mark.asyncio
async def test_create_new_user_integrity_error():
    db = make_mock_db_commit(commit_side_effect=IntegrityError("", "", ""))
    user_in = UserCreate(
        first_name="A",
        last_name="B",
        email="test@example.com",
        password="password123"
    )
    hashed_password = "hashed"
    with pytest.raises(IntegrityError):
        await user_service.create_new_user(db, user_in, hashed_password)
    db.rollback.assert_awaited_once()
