
from app.core import config


def get_db_connection_params():
    """Return DB connection parameters from config accessors."""
    return {
        'user': config.get_db_user(),
        'password': config.get_db_password(),
        'host': config.get_db_host(),
        'port': config.get_db_port(),
        'db': config.get_db_name(),
    }


def get_async_database_url():
    p = get_db_connection_params()
    return f"postgresql+asyncpg://{p['user']}:{p['password']}@{p['host']}:{p['port']}/{p['db']}"


def get_sync_database_url():
    p = get_db_connection_params()
    return f"postgresql://{p['user']}:{p['password']}@{p['host']}:{p['port']}/{p['db']}"
