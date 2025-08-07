
from fastapi import FastAPI

from app.api.routes import health
from app.api.routes import auth

app = FastAPI()

app.include_router(health.router, prefix="/api")
app.include_router(auth.router, prefix="/api")

@app.get("/")
def read_root():
    return {"message": "Hello, World!"}
