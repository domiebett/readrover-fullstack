import pytest
from unittest.mock import AsyncMock, MagicMock, patch
from fastapi import HTTPException, status
from app.api.routes import auth
from app.schemas.user import UserCreate
from app.models.user import User
from sqlalchemy.exc import IntegrityError

@pytest.mark.asyncio
async def test_register_user_success(monkeypatch):
    user_in = UserCreate(first_name="A", last_name="B", email="test@example.com", password="password123")
    db = AsyncMock()
    monkeypatch.setattr(auth, "get_user_by_email_case_insensitive", AsyncMock(return_value=None))
    monkeypatch.setattr(auth, "get_password_hash", MagicMock(return_value="hashed_pw"))
    fake_user = User(id=1, first_name="A", last_name="B", email="test@example.com", hashed_password="hashed_pw")
    monkeypatch.setattr(auth, "create_new_user", AsyncMock(return_value=fake_user))
    result = await auth.register_user(user_in, db)
    assert result["id"] == 1
    assert result["email"] == "test@example.com"

@pytest.mark.asyncio
async def test_register_user_already_exists(monkeypatch):
    user_in = UserCreate(first_name="A", last_name="B", email="test@example.com", password="password123")
    db = AsyncMock()
    monkeypatch.setattr(auth, "get_user_by_email_case_insensitive", AsyncMock(return_value=User(id=1)))
    with pytest.raises(HTTPException) as exc:
        await auth.register_user(user_in, db)
    assert exc.value.status_code == 400
    assert "already registered" in exc.value.detail

@pytest.mark.asyncio
async def test_register_user_integrity_error(monkeypatch):
    user_in = UserCreate(first_name="A", last_name="B", email="test@example.com", password="password123")
    db = AsyncMock()
    monkeypatch.setattr(auth, "get_user_by_email_case_insensitive", AsyncMock(return_value=None))
    monkeypatch.setattr(auth, "get_password_hash", MagicMock(return_value="hashed_pw"))
    monkeypatch.setattr(auth, "create_new_user", AsyncMock(side_effect=IntegrityError("", "", "")))
    with pytest.raises(HTTPException) as exc:
        await auth.register_user(user_in, db)
    assert exc.value.status_code == 400
    assert "already registered" in exc.value.detail

@pytest.mark.asyncio
async def test_login_success(monkeypatch):
    response = MagicMock()
    form_data = MagicMock()
    form_data.username = "test@example.com"
    form_data.password = "password123"
    db = AsyncMock()
    fake_user = User(id=1, email="test@example.com", hashed_password="hashed_pw")
    monkeypatch.setattr(auth, "get_user_by_email_case_insensitive", AsyncMock(return_value=fake_user))
    monkeypatch.setattr(auth, "authenticate_user", MagicMock(return_value=fake_user))
    monkeypatch.setattr(auth, "create_access_token", MagicMock(return_value="token"))
    result = await auth.login(response, form_data, db)
    assert result["msg"] == "Login successful"
    response.set_cookie.assert_called_once()

@pytest.mark.asyncio
async def test_login_invalid_credentials(monkeypatch):
    response = MagicMock()
    form_data = MagicMock()
    form_data.username = "test@example.com"
    form_data.password = "wrongpw"
    db = AsyncMock()
    fake_user = User(id=1, email="test@example.com", hashed_password="hashed_pw")
    monkeypatch.setattr(auth, "get_user_by_email_case_insensitive", AsyncMock(return_value=fake_user))
    monkeypatch.setattr(auth, "authenticate_user", MagicMock(return_value=None))
    with pytest.raises(HTTPException) as exc:
        await auth.login(response, form_data, db)
    assert exc.value.status_code == status.HTTP_401_UNAUTHORIZED
    assert "Incorrect username or password" in exc.value.detail

def test_logout_sets_cookie_header():
    response = MagicMock()
    result = auth.logout(response)
    response.set_cookie.assert_called_once_with(key="access_token", value="", httponly=True, samesite="lax", expires=0)
    assert result == {"msg": "Logged out"}