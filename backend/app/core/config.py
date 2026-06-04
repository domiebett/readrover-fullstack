import os


def get_secret_key():
    return os.getenv("SECRET_KEY", "your-secret-key")


def get_algorithm():
    return os.getenv("ALGORITHM", "HS256")


def get_access_token_expire_minutes():
    return int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 60))


# Database config accessors
def get_db_user():
    return os.getenv("POSTGRES_USER", "postgres")


def get_db_password():
    return os.getenv("POSTGRES_PASSWORD", "password")


def get_db_host():
    return os.getenv("POSTGRES_HOST", "localhost")


def get_db_port():
    return os.getenv("POSTGRES_PORT", "5432")


def get_db_name():
    return os.getenv("POSTGRES_DB", "postgres")


def get_db_url():
    return os.getenv(
        "DATABASE_URL",
        (
            f"postgresql+asyncpg://{get_db_user()}:{get_db_password()}"
            f"@{get_db_host()}:{get_db_port()}/{get_db_name()}"
        ),
    )


# Storage configuration functions
def get_storage_type():
    return os.getenv("STORAGE_TYPE", "local")


def get_local_storage_path():
    return os.getenv("LOCAL_STORAGE_PATH", "uploads")


def get_cloud_storage_path():
    return os.getenv("CLOUD_STORAGE_PATH", "uploads/cloud")
