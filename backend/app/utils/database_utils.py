import os

def get_db_connection_params():
    """Return DB connection parameters from environment variables."""
    return {
        'user': os.getenv('DB_USER'),
        'password': os.getenv('DB_PASSWORD'),
        'host': os.getenv('DB_HOST'),
        'port': os.getenv('DB_PORT'),
        'db': os.getenv('DB_NAME'),
    }

def get_async_database_url():
    p = get_db_connection_params()
    return f"postgresql+asyncpg://{p['user']}:{p['password']}@{p['host']}:{p['port']}/{p['db']}"

def get_sync_database_url():
    p = get_db_connection_params()
    return f"postgresql://{p['user']}:{p['password']}@{p['host']}:{p['port']}/{p['db']}"
