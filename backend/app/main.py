
from dotenv import load_dotenv
from fastapi import FastAPI
from app.api.routes import health
from app.api.routes import auth
from app.core.database import setup_database
from contextlib import asynccontextmanager

load_dotenv()

@asynccontextmanager
async def lifespan(app: FastAPI):
    await setup_database()
    yield

app = FastAPI(lifespan=lifespan)

app.include_router(health.router, prefix="/api")
app.include_router(auth.router, prefix="/api")

@app.get("/")
def read_root():
    return {"message": "Hello, World!"}
