from app.core import config
from app.core.storage.interface import StorageProvider
from app.core.storage.local import LocalStorageProvider
from app.core.storage.cloud import CloudStorageProvider


def get_storage_provider() -> StorageProvider:
    """Get the appropriate storage provider based on configuration."""
    storage_type = config.get_storage_type().lower()

    if storage_type == "local":
        return LocalStorageProvider(config.get_local_storage_path())
    elif storage_type == "cloud":
        return CloudStorageProvider(config.get_cloud_storage_path())
    else:
        raise ValueError(f"Unsupported storage type: {storage_type}")
