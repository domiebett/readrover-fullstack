import shutil
from pathlib import Path
from typing import BinaryIO
from app.core.storage.interface import StorageProvider


class LocalStorageProvider(StorageProvider):
    """Local filesystem storage provider using mounted volume."""

    def __init__(self, base_path: str = "uploads"):
        self.base_path = Path(base_path)
        self.base_path.mkdir(exist_ok=True)

    async def save_file(self, file_path: str, file_content: BinaryIO) -> str:
        """Save file to local filesystem."""
        full_path = self.base_path / file_path
        full_path.parent.mkdir(parents=True, exist_ok=True)

        with open(full_path, 'wb') as f:
            shutil.copyfileobj(file_content, f)

        return str(full_path)

    async def get_file(self, file_path: str) -> BinaryIO:
        """Get file from local filesystem."""
        full_path = self.base_path / file_path
        if not full_path.exists():
            raise FileNotFoundError(f"File not found: {file_path}")
        return open(full_path, 'rb')

    async def delete_file(self, file_path: str) -> bool:
        """Delete file from local filesystem."""
        full_path = self.base_path / file_path
        if full_path.exists():
            full_path.unlink()
            return True
        return False

    async def file_exists(self, file_path: str) -> bool:
        """Check if file exists in local filesystem."""
        return (self.base_path / file_path).exists()
