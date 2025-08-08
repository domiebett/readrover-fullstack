import pytest
from httpx import AsyncClient, ASGITransport
from fastapi import status
from app.main import app
from app.core.database import get_db
from tests.integration.test_db_setup import override_get_db
# --- Fixtures and helpers ---
import pytest_asyncio


@pytest_asyncio.fixture()
async def async_client(setup_test_db):
    app.dependency_overrides = {}
    app.dependency_overrides[get_db] = override_get_db
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac


async def register_user(client, data):
    resp = await client.post("/api/register", json=data)
    return resp


async def login_user(client, data):
    resp = await client.post("/api/login", data=data)
    return resp


# --- Tests ---
@pytest.mark.asyncio
async def test_register_and_login_flow(async_client):
    register_data = {
        "first_name": "A",
        "last_name": "B",
        "email": "integration@example.com",
        "password": "password123"
    }
    resp = await register_user(async_client, register_data)
    if resp.status_code != status.HTTP_201_CREATED:
        print("Register error:", resp.status_code, resp.json())
    assert resp.status_code == status.HTTP_201_CREATED
    assert resp.json()["email"] == "integration@example.com"

    login_data = {
        "username": "integration@example.com",
        "password": "password123"
    }
    resp = await login_user(async_client, login_data)
    assert resp.status_code == 200
    assert resp.json()["msg"] == "Login successful"
    assert "access_token" in resp.cookies

    resp = await async_client.post("/api/logout")
    assert resp.status_code == 200
    assert resp.json()["msg"] == "Logged out"


@pytest.mark.asyncio
async def test_register_duplicate(async_client):
    register_data = {
        "first_name": "A",
        "last_name": "B",
        "email": "dupe@example.com",
        "password": "password123"
    }
    resp = await register_user(async_client, register_data)
    if resp.status_code != status.HTTP_201_CREATED:
        print("Register error:", resp.status_code, resp.json())
    assert resp.status_code == status.HTTP_201_CREATED
    resp = await register_user(async_client, register_data)
    assert resp.status_code == 400
    assert "already registered" in resp.json()["detail"]


@pytest.mark.asyncio
async def test_login_invalid(async_client):
    login_data = {"username": "notfound@example.com", "password": "wrongpw"}
    resp = await login_user(async_client, login_data)
    assert resp.status_code == status.HTTP_401_UNAUTHORIZED
    assert "Incorrect username or password" in resp.json()["detail"]
