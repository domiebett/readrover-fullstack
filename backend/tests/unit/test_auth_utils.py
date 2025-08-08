import os
import pytest
from jose import jwt
from app.utils import auth_utils

# Set up test secrets for token tests
test_secret = "test-secret"
test_algorithm = "HS256"
os.environ["SECRET_KEY"] = test_secret
os.environ["ALGORITHM"] = test_algorithm


def test_get_password_hash_and_verify():
    password = "my_password"
    hashed = auth_utils.get_password_hash(password)
    assert isinstance(hashed, str)
    assert hashed != password
    assert auth_utils.verify_password(password, hashed)
    assert not auth_utils.verify_password("wrong", hashed)

def test_authenticate_user():
    class DummyUser:
        def __init__(self, hashed_password):
            self.hashed_password = hashed_password
    password = "pw"
    hashed = auth_utils.get_password_hash(password)
    user = DummyUser(hashed)
    assert auth_utils.authenticate_user(user, password) == user
    assert not auth_utils.authenticate_user(user, "bad")
    assert not auth_utils.authenticate_user(None, password)

def test_create_access_token():
    data = {"sub": "user1"}
    token = auth_utils.create_access_token(data)
    assert isinstance(token, str)
    decoded = jwt.decode(token, test_secret, algorithms=[test_algorithm])
    assert decoded["sub"] == "user1"
