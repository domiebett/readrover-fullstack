import pytest
import io
import uuid
from unittest.mock import AsyncMock
from pathlib import Path

from app.services.storage_service import StorageService
from app.core.storage.local import LocalStorageProvider


@pytest.fixture
def storage_service():
    return StorageService()


@pytest.fixture
def sample_file_content():
    return b"Test PDF content for storage testing"


@pytest.fixture
def sample_uuid():
    return str(uuid.uuid4())


class TestStorageService:
    @pytest.mark.asyncio
    async def test_save_book_file_success(
        self, storage_service, sample_file_content, sample_uuid
    ):
        """Test successful file saving."""
        file_bytes = io.BytesIO(sample_file_content)
        file_type = "pdf"

        # Mock the storage provider
        storage_service.storage.save_file = AsyncMock(
            return_value=f"uploads/originals/{sample_uuid}.{file_type}"
        )

        result = await storage_service.save_book_file(
            sample_uuid, file_type, file_bytes
        )

        assert result == f"uploads/originals/{sample_uuid}.{file_type}"
        storage_service.storage.save_file.assert_awaited_once_with(
            f"originals/{sample_uuid}.{file_type}", file_bytes
        )

    @pytest.mark.asyncio
    async def test_save_book_content_success(self, storage_service, sample_uuid):
        """Test successful content saving."""
        content_data = {"title": "Test Book", "pages": 100}

        # Mock the storage provider
        storage_service.storage.save_file = AsyncMock(
            return_value=f"uploads/contents/{sample_uuid}.json"
        )

        result = await storage_service.save_book_content(sample_uuid, content_data)

        assert result == f"uploads/contents/{sample_uuid}.json"
        storage_service.storage.save_file.assert_awaited_once()

        # Verify the content was saved as JSON
        call_args = storage_service.storage.save_file.call_args
        assert call_args[0][0] == f"contents/{sample_uuid}.json"

    @pytest.mark.asyncio
    async def test_delete_book_files_success(self, storage_service, sample_uuid):
        """Test successful file deletion."""
        file_type = "pdf"

        # Mock the storage provider
        storage_service.storage.delete_file = AsyncMock(return_value=True)
        storage_service.storage.file_exists = AsyncMock(return_value=True)

        await storage_service.delete_book_files(sample_uuid, file_type)

        # Verify both files were attempted to be deleted
        expected_calls = [
            ((f"originals/{sample_uuid}.{file_type}",),),
            ((f"contents/{sample_uuid}.json",),),
        ]
        assert storage_service.storage.delete_file.call_args_list == expected_calls

    @pytest.mark.asyncio
    async def test_delete_book_files_not_exist(self, storage_service, sample_uuid):
        """Test file deletion when files don't exist."""
        file_type = "pdf"

        # Mock the storage provider
        storage_service.storage.delete_file = AsyncMock(return_value=False)
        storage_service.storage.file_exists = AsyncMock(return_value=False)

        await storage_service.delete_book_files(sample_uuid, file_type)

        # Should still attempt to delete
        assert storage_service.storage.delete_file.call_count == 2

    @pytest.mark.asyncio
    async def test_get_book_file_success(
        self, storage_service, sample_file_content, sample_uuid
    ):
        """Test successful file retrieval."""
        file_type = "pdf"
        file_bytes = io.BytesIO(sample_file_content)

        # Mock the storage provider
        storage_service.storage.get_file = AsyncMock(return_value=file_bytes)
        storage_service.storage.file_exists = AsyncMock(return_value=True)

        result = await storage_service.get_book_file(sample_uuid, file_type)

        assert result == file_bytes
        storage_service.storage.get_file.assert_awaited_once_with(
            f"originals/{sample_uuid}.{file_type}"
        )

    @pytest.mark.asyncio
    async def test_get_book_file_not_found(self, storage_service, sample_uuid):
        """Test file retrieval when file doesn't exist."""
        file_type = "pdf"

        # Mock the storage provider to raise FileNotFoundError
        storage_service.storage.get_file = AsyncMock(
            side_effect=FileNotFoundError("File not found")
        )

        with pytest.raises(FileNotFoundError):
            await storage_service.get_book_file(sample_uuid, file_type)

        storage_service.storage.get_file.assert_awaited_once()

    @pytest.mark.asyncio
    async def test_get_book_content_success(self, storage_service, sample_uuid):
        """Test successful content retrieval."""
        content_json = '{"title": "Test Book", "pages": 100}'
        file_bytes = io.BytesIO(content_json.encode())

        # Mock the storage provider
        storage_service.storage.get_file = AsyncMock(return_value=file_bytes)
        storage_service.storage.file_exists = AsyncMock(return_value=True)

        result = await storage_service.get_book_content(sample_uuid)

        assert result == {"title": "Test Book", "pages": 100}
        storage_service.storage.get_file.assert_awaited_once_with(
            f"contents/{sample_uuid}.json"
        )

    @pytest.mark.asyncio
    async def test_get_book_content_not_found(self, storage_service, sample_uuid):
        """Test content retrieval when file doesn't exist."""
        # Mock the storage provider to raise FileNotFoundError
        storage_service.storage.get_file = AsyncMock(
            side_effect=FileNotFoundError("File not found")
        )

        with pytest.raises(FileNotFoundError):
            await storage_service.get_book_content(sample_uuid)

        storage_service.storage.get_file.assert_awaited_once()

    @pytest.mark.asyncio
    async def test_get_book_content_invalid_json(self, storage_service, sample_uuid):
        """Test content retrieval with invalid JSON."""
        invalid_json = "invalid json content"
        file_bytes = io.BytesIO(invalid_json.encode())

        # Mock the storage provider
        storage_service.storage.get_file = AsyncMock(return_value=file_bytes)
        storage_service.storage.file_exists = AsyncMock(return_value=True)

        with pytest.raises(Exception):  # JSON decode error
            await storage_service.get_book_content(sample_uuid)

    @pytest.mark.asyncio
    async def test_file_exists_check(self, storage_service, sample_uuid):
        """Test file existence checking."""
        file_type = "pdf"

        # Mock the storage provider
        storage_service.storage.file_exists = AsyncMock(return_value=True)

        result = await storage_service.book_files_exist(sample_uuid, file_type)

        assert result is True
        storage_service.storage.file_exists.assert_awaited()

    @pytest.mark.asyncio
    async def test_content_exists_check(self, storage_service, sample_uuid):
        """Test content existence checking."""
        # Mock the storage provider
        storage_service.storage.file_exists = AsyncMock(return_value=False)

        result = await storage_service.book_files_exist(sample_uuid, "pdf")

        assert result is False
        storage_service.storage.file_exists.assert_awaited()


class TestLocalStorageProvider:
    @pytest.fixture
    def temp_dir(self, tmp_path):
        return tmp_path / "test_uploads"

    @pytest.fixture
    def local_storage(self, temp_dir):
        return LocalStorageProvider(str(temp_dir))

    @pytest.mark.asyncio
    async def test_save_file_success(self, local_storage, sample_file_content):
        """Test successful file saving to local filesystem."""
        file_path = "test/file.pdf"
        file_bytes = io.BytesIO(sample_file_content)

        result = await local_storage.save_file(file_path, file_bytes)

        # Check file was saved
        saved_file = Path(result)
        assert saved_file.exists()
        assert saved_file.read_bytes() == sample_file_content

    @pytest.mark.asyncio
    async def test_get_file_success(self, local_storage, sample_file_content):
        """Test successful file retrieval from local filesystem."""
        file_path = "test/file.pdf"
        file_bytes = io.BytesIO(sample_file_content)

        # Save file first
        await local_storage.save_file(file_path, file_bytes)

        # Retrieve file
        result = await local_storage.get_file(file_path)

        assert result.read() == sample_file_content

    @pytest.mark.asyncio
    async def test_delete_file_success(self, local_storage, sample_file_content):
        """Test successful file deletion from local filesystem."""
        file_path = "test/file.pdf"
        file_bytes = io.BytesIO(sample_file_content)

        # Save file first
        await local_storage.save_file(file_path, file_bytes)

        # Delete file
        result = await local_storage.delete_file(file_path)

        assert result is True
        assert not Path(local_storage.base_path / file_path).exists()

    @pytest.mark.asyncio
    async def test_delete_file_not_exists(self, local_storage):
        """Test deleting non-existent file."""
        file_path = "nonexistent/file.pdf"

        result = await local_storage.delete_file(file_path)

        assert result is False

    @pytest.mark.asyncio
    async def test_file_exists_true(self, local_storage, sample_file_content):
        """Test file existence check when file exists."""
        file_path = "test/file.pdf"
        file_bytes = io.BytesIO(sample_file_content)

        # Save file first
        await local_storage.save_file(file_path, file_bytes)

        # Check existence
        result = await local_storage.file_exists(file_path)

        assert result is True

    @pytest.mark.asyncio
    async def test_file_exists_false(self, local_storage):
        """Test file existence check when file doesn't exist."""
        file_path = "nonexistent/file.pdf"

        result = await local_storage.file_exists(file_path)

        assert result is False
