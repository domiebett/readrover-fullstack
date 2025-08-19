import pytest
from unittest.mock import AsyncMock, Mock, MagicMock
from sqlalchemy.exc import IntegrityError
from fastapi import HTTPException

from app.services.book_service import BookService
from app.models.book import Book
from app.models.user_book import UserBook
from app.schemas.book import BookCreate, BookUpdate, UserBookUpdate
from tests.unit.test_utils import make_mock_db_execute, make_mock_db_commit


@pytest.fixture
def book_service():
    return BookService()


@pytest.fixture
def sample_book_data():
    return BookCreate(
        title="Test Book",
        author="Test Author",
        isbn="1234567890123",
        description="A test book",
        genre="Fiction",
        publication_year=2023,
        page_count=300,
        file_type="pdf",
        file_size=1024000,
    )


@pytest.fixture
def sample_book():
    return Book(
        id=1,
        uuid="test-uuid-123",
        title="Test Book",
        author="Test Author",
        isbn="1234567890123",
        description="A test book",
        genre="Fiction",
        publication_year=2023,
        page_count=300,
        file_type="pdf",
        file_size=1024000,
        source="uploaded",
        original_uploader_id=1,
        parsing_status="pending",
    )


@pytest.fixture
def sample_user_book():
    return UserBook(
        id=1,
        user_id=1,
        book_id=1,
        reading_status="to_read",
        reading_progress=0,
        progress_percentage=0.0,
        can_share=True,
    )


class TestBookService:
    @pytest.mark.asyncio
    async def test_create_book_success(self, book_service, sample_book_data):
        """Test successful book creation."""
        db = make_mock_db_commit()

        # Mock the created book
        created_book = Book(
            id=1,
            uuid="test-uuid-123",
            title=sample_book_data.title,
            author=sample_book_data.author,
            original_uploader_id=1,
        )
        db.refresh.side_effect = [created_book, UserBook(id=1, user_id=1, book_id=1)]

        result = await book_service.create_book(db, sample_book_data, user_id=1)

        assert isinstance(result, Book)
        assert result.title == sample_book_data.title
        assert result.author == sample_book_data.author
        assert result.original_uploader_id == 1
        assert result.source == "uploaded"
        assert result.parsing_status == "pending"

        # Verify database operations
        assert db.add.call_count == 2  # Book + UserBook
        assert db.commit.await_count == 2
        assert db.refresh.await_count == 2

    @pytest.mark.asyncio
    async def test_create_book_database_error(self, book_service, sample_book_data):
        """Test book creation with database error."""
        db = make_mock_db_commit(commit_side_effect=IntegrityError("", "", ""))

        with pytest.raises(IntegrityError):
            await book_service.create_book(db, sample_book_data, user_id=1)

        # Note: rollback is not called in the current implementation
        # as the exception is raised before rollback

    @pytest.mark.asyncio
    async def test_get_user_books_success(self, book_service, sample_user_book):
        """Test getting user books."""
        db = make_mock_db_execute([sample_user_book])

        result = await book_service.get_user_books(db, user_id=1, skip=0, limit=10)

        assert len(result) == 1
        assert result[0] == sample_user_book
        db.execute.assert_awaited_once()

    @pytest.mark.asyncio
    async def test_get_user_books_empty(self, book_service):
        """Test getting user books when none exist."""
        db = make_mock_db_execute([])

        result = await book_service.get_user_books(db, user_id=1)

        assert len(result) == 0
        db.execute.assert_awaited_once()

    @pytest.mark.asyncio
    async def test_get_user_book_found(self, book_service, sample_user_book):
        """Test getting a specific user book."""
        db = make_mock_db_execute(sample_user_book)

        result = await book_service.get_user_book(db, user_id=1, book_id=1)

        assert result == sample_user_book
        db.execute.assert_awaited_once()

    @pytest.mark.asyncio
    async def test_get_user_book_not_found(self, book_service):
        """Test getting a user book that doesn't exist."""
        db = make_mock_db_execute(None)

        result = await book_service.get_user_book(db, user_id=1, book_id=999)

        assert result is None
        db.execute.assert_awaited_once()

    @pytest.mark.asyncio
    async def test_get_book_found(self, book_service, sample_book):
        """Test getting a book by ID."""
        db = make_mock_db_execute(sample_book)

        result = await book_service.get_book(db, book_id=1)

        assert result == sample_book
        db.execute.assert_awaited_once()

    @pytest.mark.asyncio
    async def test_get_book_not_found(self, book_service):
        """Test getting a book that doesn't exist."""
        db = make_mock_db_execute(None)

        result = await book_service.get_book(db, book_id=999)

        assert result is None
        db.execute.assert_awaited_once()

    @pytest.mark.asyncio
    async def test_update_book_success(self, book_service, sample_book):
        """Test updating a book."""
        db = make_mock_db_execute(sample_book)
        db.commit = AsyncMock()
        db.refresh = AsyncMock()

        update_data = BookUpdate(title="Updated Title", author="Updated Author")

        result = await book_service.update_book(db, book_id=1, book_data=update_data)

        assert result.title == "Updated Title"
        assert result.author == "Updated Author"
        db.commit.assert_awaited_once()
        db.refresh.assert_awaited_once()

    @pytest.mark.asyncio
    async def test_update_book_not_found(self, book_service):
        """Test updating a book that doesn't exist."""
        db = make_mock_db_execute(None)

        update_data = BookUpdate(title="Updated Title")
        result = await book_service.update_book(db, book_id=999, book_data=update_data)

        assert result is None

    @pytest.mark.asyncio
    async def test_update_user_book_success(self, book_service, sample_user_book):
        """Test updating user book relationship."""
        db = make_mock_db_execute(sample_user_book)
        db.commit = AsyncMock()
        db.refresh = AsyncMock()

        update_data = UserBookUpdate(
            reading_status="reading", reading_progress=50, progress_percentage=25.0
        )

        result = await book_service.update_user_book(
            db, user_id=1, book_id=1, user_book_data=update_data
        )

        assert result.reading_status == "reading"
        assert result.reading_progress == 50
        assert result.progress_percentage == 25.0
        db.commit.assert_awaited_once()
        db.refresh.assert_awaited_once()

    @pytest.mark.asyncio
    async def test_update_user_book_not_found(self, book_service):
        """Test updating user book that doesn't exist."""
        db = make_mock_db_execute(None)

        update_data = UserBookUpdate(reading_status="reading")
        result = await book_service.update_user_book(
            db, user_id=1, book_id=999, user_book_data=update_data
        )

        assert result is None

    @pytest.mark.asyncio
    async def test_delete_book_success(
        self, book_service, sample_user_book, sample_book
    ):
        """Test deleting a book."""
        # Mock the service methods directly
        book_service.get_user_book = AsyncMock(return_value=sample_user_book)
        book_service.get_book = AsyncMock(return_value=sample_book)
        book_service.storage_service.delete_book_files = AsyncMock()

        # Mock database operations
        db = AsyncMock()
        db.delete = AsyncMock()
        db.commit = AsyncMock()

        # Mock the query for other users
        mock_result = Mock()
        mock_result.scalars = Mock(return_value=mock_result)
        mock_result.first = Mock(return_value=None)
        db.execute = AsyncMock(return_value=mock_result)

        result = await book_service.delete_book(db, book_id=1, user_id=1)

        assert result is True
        book_service.storage_service.delete_book_files.assert_awaited_once_with(
            sample_book.uuid, sample_book.file_type
        )
        db.delete.assert_called()
        db.commit.assert_awaited_once()

    @pytest.mark.asyncio
    async def test_delete_book_user_not_found(self, book_service):
        """Test deleting a book when user doesn't have access."""
        db = make_mock_db_execute(None)

        result = await book_service.delete_book(db, book_id=1, user_id=1)

        assert result is False

    @pytest.mark.asyncio
    async def test_share_book_success(self, book_service, sample_user_book):
        """Test sharing a book successfully."""
        # Mock the service methods directly - first call returns sharer's book, second returns None
        book_service.get_user_book = AsyncMock(side_effect=[sample_user_book, None])

        # Mock database operations
        db = AsyncMock()
        db.add = MagicMock()
        db.commit = AsyncMock()
        db.refresh = AsyncMock()

        # Mock user service
        recipient_user = Mock(id=2, email="recipient@example.com")
        with pytest.MonkeyPatch().context() as m:
            m.setattr(
                "app.services.book_service.get_user_by_email_case_insensitive",
                AsyncMock(return_value=recipient_user),
            )

            result = await book_service.share_book(
                db, sharer_id=1, book_id=1, recipient_email="recipient@example.com"
            )

        assert isinstance(result, UserBook)
        assert result.user_id == 2
        assert result.book_id == 1
        assert result.shared_by_user_id == 1
        assert result.can_share is False
        db.add.assert_called_once()
        db.commit.assert_awaited_once()
        db.refresh.assert_awaited_once()

    @pytest.mark.asyncio
    async def test_share_book_not_found(self, book_service):
        """Test sharing a book that doesn't exist."""
        db = make_mock_db_execute(None)

        with pytest.raises(HTTPException) as exc_info:
            await book_service.share_book(
                db, sharer_id=1, book_id=999, recipient_email="recipient@example.com"
            )

        assert exc_info.value.status_code == 404
        assert exc_info.value.detail == "Book not found"

    @pytest.mark.asyncio
    async def test_share_book_cannot_share(self, book_service):
        """Test sharing a book when sharing is not allowed."""
        user_book = UserBook(id=1, user_id=1, book_id=1, can_share=False)
        db = make_mock_db_execute(user_book)

        with pytest.raises(HTTPException) as exc_info:
            await book_service.share_book(
                db, sharer_id=1, book_id=1, recipient_email="recipient@example.com"
            )

        assert exc_info.value.status_code == 403
        assert exc_info.value.detail == "Cannot share this book"

    @pytest.mark.asyncio
    async def test_share_book_recipient_not_found(self, book_service, sample_user_book):
        """Test sharing a book with non-existent recipient."""
        db = make_mock_db_execute(sample_user_book)

        with pytest.MonkeyPatch().context() as m:
            m.setattr(
                "app.services.book_service.get_user_by_email_case_insensitive",
                AsyncMock(return_value=None),
            )

            with pytest.raises(HTTPException) as exc_info:
                await book_service.share_book(
                    db,
                    sharer_id=1,
                    book_id=1,
                    recipient_email="nonexistent@example.com",
                )

            assert exc_info.value.status_code == 404
            assert exc_info.value.detail == "User not found"

    @pytest.mark.asyncio
    async def test_share_book_already_shared(self, book_service, sample_user_book):
        """Test sharing a book that's already shared with recipient."""
        # Mock the service methods directly
        book_service.get_user_book = AsyncMock(
            side_effect=[sample_user_book, sample_user_book]
        )

        recipient_user = Mock(id=2, email="recipient@example.com")
        with pytest.MonkeyPatch().context() as m:
            m.setattr(
                "app.services.book_service.get_user_by_email_case_insensitive",
                AsyncMock(return_value=recipient_user),
            )

            with pytest.raises(HTTPException) as exc_info:
                await book_service.share_book(
                    db=AsyncMock(),
                    sharer_id=1,
                    book_id=1,
                    recipient_email="recipient@example.com",
                )

            assert exc_info.value.status_code == 400
            assert exc_info.value.detail == "User already has access to this book"

    @pytest.mark.asyncio
    async def test_get_shared_books(self, book_service, sample_user_book):
        """Test getting books shared with a user."""
        db = make_mock_db_execute([sample_user_book])

        result = await book_service.get_shared_books(db, user_id=2)

        assert len(result) == 1
        assert result[0] == sample_user_book
        db.execute.assert_awaited_once()

    @pytest.mark.asyncio
    async def test_get_books_shared_by_user(self, book_service, sample_user_book):
        """Test getting books shared by a user."""
        db = make_mock_db_execute([sample_user_book])

        result = await book_service.get_books_shared_by_user(db, user_id=1)

        assert len(result) == 1
        assert result[0] == sample_user_book
        db.execute.assert_awaited_once()
