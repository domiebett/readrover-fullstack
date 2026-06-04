
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import health
from app.api.routes import auth
from app.api.routes import books
from app.core.database import setup_database
from contextlib import asynccontextmanager

load_dotenv()


@asynccontextmanager
async def lifespan(app: FastAPI):
    await setup_database()
    yield


app = FastAPI(lifespan=lifespan)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Frontend development server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router, prefix="/api")
app.include_router(auth.router, prefix="/api")
app.include_router(books.router, prefix="/api")


@app.get("/")
def read_root():
    return {"message": "Hello, World!"}
