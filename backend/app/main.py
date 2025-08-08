from dotenv import load_dotenv
from fastapi import FastAPI
from app.api.routes import health
from app.api.routes import auth
from app.core.database import setup_database

app = FastAPI()

load_dotenv()

# Run DB setup on startup
@app.on_event("startup")
async def on_startup():
    await setup_database()

app.include_router(health.router, prefix="/api")
app.include_router(auth.router, prefix="/api")

@app.get("/")
def read_root():
    return {"message": "Hello, World!"}
