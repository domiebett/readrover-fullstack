from pydantic import BaseModel, EmailStr, constr

class UserCreate(BaseModel):
    first_name: constr(strip_whitespace=True, min_length=1, max_length=100)
    last_name: constr(strip_whitespace=True, min_length=1, max_length=100)
    email: EmailStr
    password: constr(min_length=8, max_length=255)
