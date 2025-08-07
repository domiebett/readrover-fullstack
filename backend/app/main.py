
from fastapi import FastAPI

from app.api.routes import health

app = FastAPI()

app.include_router(health.router, prefix="/api")

@app.get("/")
def read_root():
    return {"message": "Hello, World!"}
