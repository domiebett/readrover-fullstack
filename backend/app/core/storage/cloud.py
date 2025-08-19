import shutil
from pathlib import Path
from typing import BinaryIO
from app.core.storage.interface import StorageProvider


class CloudStorageProvider(StorageProvider):
    """
    Dummy cloud storage provider for development.
    Currently just uses local filesystem with cloud-like paths.
    TODO: Replace with actual cloud service (S3, Google Drive, etc.)
    """

    def __init__(self, base_path: str = "uploads/cloud"):
        self.base_path = Path(base_path)
        self.base_path.mkdir(parents=True, exist_ok=True)

    async def save_file(self, file_path: str, file_content: BinaryIO) -> str:
        """Save file and return cloud-like URL."""
        full_path = self.base_path / file_path
        full_path.parent.mkdir(parents=True, exist_ok=True)

        with open(full_path, 'wb') as f:
            shutil.copyfileobj(file_content, f)

        # Return a cloud-like URL for now
        return f"cloud://{file_path}"

    async def get_file(self, file_path: str) -> BinaryIO:
        """Get file from cloud storage."""
        # Strip cloud:// prefix if present
        if file_path.startswith("cloud://"):
            file_path = file_path[8:]

        full_path = self.base_path / file_path
        if not full_path.exists():
            raise FileNotFoundError(f"File not found: {file_path}")
        return open(full_path, 'rb')

    async def delete_file(self, file_path: str) -> bool:
        """Delete file from cloud storage."""
        # Strip cloud:// prefix if present
        if file_path.startswith("cloud://"):
            file_path = file_path[8:]

        full_path = self.base_path / file_path
        if full_path.exists():
            full_path.unlink()
            return True
        return False

    async def file_exists(self, file_path: str) -> bool:
        """Check if file exists in cloud storage."""
        # Strip cloud:// prefix if present
        if file_path.startswith("cloud://"):
            file_path = file_path[8:]

        return (self.base_path / file_path).exists()
