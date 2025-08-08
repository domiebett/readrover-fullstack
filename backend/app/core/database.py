from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from app.utils.database_utils import get_async_database_url


_engine = None
def get_engine():
    global _engine
    if _engine is None:
        _engine = create_async_engine(get_async_database_url(), echo=True)
    return _engine


def get_session_maker():
    return sessionmaker(get_engine(), class_=AsyncSession, expire_on_commit=False)

async def get_db():
    SessionLocal = get_session_maker()
    async with SessionLocal() as session:
        yield session

async def setup_database():
    engine = get_engine()
    # Attempt to connect to the database and execute a simple query to verify connectivity
    try:
        async with engine.begin() as conn:
            await conn.execute("SELECT 1")
        print("Database connection successful.")
    except Exception as e:
        print(f"Database connection failed: {e}")
