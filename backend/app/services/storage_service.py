import json
import io
from typing import BinaryIO, Dict, Any
from app.core.storage.factory import get_storage_provider


class StorageService:
    """High-level storage service for book file operations."""

    def __init__(self):
        self.storage = get_storage_provider()

    async def save_book_file(
        self, uuid: str, file_type: str, file_content: BinaryIO
    ) -> str:
        """Save original book file using UUID."""
        file_path = f"originals/{uuid}.{file_type}"
        return await self.storage.save_file(file_path, file_content)

    async def save_book_content(
        self, uuid: str, content: Dict[str, Any]
    ) -> str:
        """Save parsed book content as JSON."""
        content_path = f"contents/{uuid}.json"
        content_json = json.dumps(content, indent=2)
        content_bytes = io.BytesIO(content_json.encode('utf-8'))
        return await self.storage.save_file(content_path, content_bytes)

    async def get_book_file(self, uuid: str, file_type: str) -> BinaryIO:
        """Get original book file using UUID."""
        file_path = f"originals/{uuid}.{file_type}"
        return await self.storage.get_file(file_path)

    async def get_book_content(self, uuid: str) -> Dict[str, Any]:
        """Get parsed book content as JSON."""
        content_path = f"contents/{uuid}.json"
        content_file = await self.storage.get_file(content_path)
        content_bytes = content_file.read()
        return json.loads(content_bytes.decode('utf-8'))

    async def delete_book_files(self, uuid: str, file_type: str) -> bool:
        """Delete both original file and content file."""
        original_path = f"originals/{uuid}.{file_type}"
        content_path = f"contents/{uuid}.json"

        original_deleted = await self.storage.delete_file(original_path)
        content_deleted = await self.storage.delete_file(content_path)

        return original_deleted and content_deleted

    async def book_files_exist(self, uuid: str, file_type: str) -> bool:
        """Check if both original file and content file exist."""
        original_path = f"originals/{uuid}.{file_type}"
        content_path = f"contents/{uuid}.json"

        return (
            await self.storage.file_exists(original_path) and await self.storage.file_exists(content_path)
        )
