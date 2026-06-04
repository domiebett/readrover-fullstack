from abc import ABC, abstractmethod
from typing import BinaryIO


class StorageProvider(ABC):
    """Abstract base class for storage providers."""

    @abstractmethod
    async def save_file(self, file_path: str, file_content: BinaryIO) -> str:
        """Save file and return the storage path/URL."""
        pass

    @abstractmethod
    async def get_file(self, file_path: str) -> BinaryIO:
        """Retrieve file content."""
        pass

    @abstractmethod
    async def delete_file(self, file_path: str) -> bool:
        """Delete file and return success status."""
        pass

    @abstractmethod
    async def file_exists(self, file_path: str) -> bool:
        """Check if file exists."""
        pass
