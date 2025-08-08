import os
import pytest
from app.utils import database_utils

def test_get_db_connection_params(monkeypatch):
    monkeypatch.setenv("POSTGRES_USER", "testuser")
    monkeypatch.setenv("POSTGRES_PASSWORD", "testpass")
    monkeypatch.setenv("POSTGRES_HOST", "testhost")
    monkeypatch.setenv("POSTGRES_PORT", "1234")
    monkeypatch.setenv("POSTGRES_DB", "testdb")
    params = database_utils.get_db_connection_params()
    assert params == {
        'user': 'testuser',
        'password': 'testpass',
        'host': 'testhost',
        'port': '1234',
        'db': 'testdb',
    }

def test_get_async_database_url(monkeypatch):
    monkeypatch.setenv("POSTGRES_USER", "asyncuser")
    monkeypatch.setenv("POSTGRES_PASSWORD", "asyncpass")
    monkeypatch.setenv("POSTGRES_HOST", "asynchost")
    monkeypatch.setenv("POSTGRES_PORT", "5678")
    monkeypatch.setenv("POSTGRES_DB", "asyncdb")
    url = database_utils.get_async_database_url()
    assert url == "postgresql+asyncpg://asyncuser:asyncpass@asynchost:5678/asyncdb"

def test_get_sync_database_url(monkeypatch):
    monkeypatch.setenv("POSTGRES_USER", "syncuser")
    monkeypatch.setenv("POSTGRES_PASSWORD", "syncpass")
    monkeypatch.setenv("POSTGRES_HOST", "synchost")
    monkeypatch.setenv("POSTGRES_PORT", "9101")
    monkeypatch.setenv("POSTGRES_DB", "syncdb")
    url = database_utils.get_sync_database_url()
    assert url == "postgresql://syncuser:syncpass@synchost:9101/syncdb"
