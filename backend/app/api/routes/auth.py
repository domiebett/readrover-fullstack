
from fastapi import APIRouter, Request, Response, HTTPException, status, Depends
from fastapi.security import OAuth2PasswordRequestForm
from datetime import timedelta
from app.utils.auth_utils import authenticate_user, create_access_token
from jose import jwt, JWTError
from app.utils.auth_utils import get_current_user


router = APIRouter()

@router.post("/login")
def login(response: Response, form_data: OAuth2PasswordRequestForm = Depends()):
    user = authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect username or password")
    access_token = create_access_token(data={"sub": user["username"]})
    response.set_cookie(key="access_token", value=access_token, httponly=True, samesite="lax")
    return {"msg": "Login successful"}


@router.post("/logout")
def logout(response: Response):
    response.set_cookie(key="access_token", value="", httponly=True, samesite="lax", expires=0)
    return {"msg": "Logged out"}

@router.get("/me")
def me(username: str = Depends(get_current_user)):
    return {"msg": f"Hello, {username}! This is a protected route."}
