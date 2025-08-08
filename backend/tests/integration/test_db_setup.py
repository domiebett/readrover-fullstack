from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from app.core import database
from app.models.user import Base
import pytest
import asyncio




# Use a file-based SQLite database for tests
import os
TEST_DB_PATH = "./test.db"
# Always remove the test DB file before engine creation
if os.path.exists(TEST_DB_PATH):
    os.remove(TEST_DB_PATH)
TEST_DATABASE_URL = f"sqlite+aiosqlite:///{TEST_DB_PATH}"
test_engine = create_async_engine(TEST_DATABASE_URL, future=True)
TestSessionLocal = sessionmaker(test_engine, class_=AsyncSession, expire_on_commit=False)

async def override_get_db():
    # Ensure tables exist before yielding session
    async with test_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    async with TestSessionLocal() as session:
        yield session

@pytest.fixture(scope="function", autouse=True)
async def setup_test_db():
    # Remove old test DB if exists
    if os.path.exists(TEST_DB_PATH):
        os.remove(TEST_DB_PATH)
    # Create tables
    async with test_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
    # Drop tables and remove test DB file after each test
    async with test_engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
    if os.path.exists(TEST_DB_PATH):
        os.remove(TEST_DB_PATH)
