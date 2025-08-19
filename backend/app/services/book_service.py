import uuid
from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_
from fastapi import HTTPException, status

from app.models.book import Book
from app.models.user_book import UserBook
from app.schemas.book import BookCreate, BookUpdate, UserBookUpdate
from app.services.storage_service import StorageService
from app.services.user_service import get_user_by_email_case_insensitive

# Initialize storage service as a module-level dependency
_storage_service = StorageService()


async def create_book(
    db: AsyncSession, book_data: BookCreate, user_id: int
) -> Book:
    """Create a new book and user-book relationship."""
    # Generate UUID for the book
    book_uuid = str(uuid.uuid4())

    # Create book record
    book = Book(
        uuid=book_uuid,
        title=book_data.title,
        author=book_data.author,
        isbn=book_data.isbn,
        description=book_data.description,
        genre=book_data.genre,
        publication_year=book_data.publication_year,
        page_count=book_data.page_count,
        file_type=book_data.file_type,
        file_size=book_data.file_size,
        source="uploaded",
        original_uploader_id=user_id,
        parsing_status="pending",
    )

    db.add(book)
    await db.commit()
    await db.refresh(book)

    # Create user-book relationship
    user_book = UserBook(user_id=user_id, book_id=book.id, can_share=True)

    db.add(user_book)
    await db.commit()
    await db.refresh(user_book)

    return book


async def get_user_books(
    db: AsyncSession, user_id: int, skip: int = 0, limit: int = 100
) -> List[UserBook]:
    """Get all books for a user."""
    result = await db.execute(
        select(UserBook)
        .where(UserBook.user_id == user_id)
        .offset(skip)
        .limit(limit)
    )
    return result.scalars().all()


async def get_user_book(
    db: AsyncSession, user_id: int, book_id: int
) -> Optional[UserBook]:
    """Get a specific book for a user."""
    result = await db.execute(
        select(UserBook).where(
            and_(UserBook.user_id == user_id, UserBook.book_id == book_id)
        )
    )
    return result.scalar_one_or_none()


async def get_book(db: AsyncSession, book_id: int) -> Optional[Book]:
    """Get a book by ID."""
    result = await db.execute(select(Book).where(Book.id == book_id))
    return result.scalar_one_or_none()


async def update_book(
    db: AsyncSession, book_id: int, book_data: BookUpdate
) -> Optional[Book]:
    """Update a book."""
    book = await get_book(db, book_id)
    if not book:
        return None

    # Update only provided fields
    update_data = book_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(book, field, value)

    await db.commit()
    await db.refresh(book)
    return book


async def update_user_book(
    db: AsyncSession,
    user_id: int,
    book_id: int,
    user_book_data: UserBookUpdate,
) -> Optional[UserBook]:
    """Update user's book relationship."""
    user_book = await get_user_book(db, user_id, book_id)
    if not user_book:
        return None

    # Update only provided fields
    update_data = user_book_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(user_book, field, value)

    await db.commit()
    await db.refresh(user_book)
    return user_book


async def delete_book(
    db: AsyncSession, book_id: int, user_id: int
) -> bool:
    """Delete a book and its files."""
    # Check if user owns the book
    user_book = await get_user_book(db, user_id, book_id)
    if not user_book:
        return False

    book = await get_book(db, book_id)
    if not book:
        return False

    # Delete files from storage
    if book.file_type:
        await _storage_service.delete_book_files(
            book.uuid, book.file_type
        )

    # Delete user-book relationship
    await db.delete(user_book)

    # Check if other users have this book
    other_users = await db.execute(
        select(UserBook).where(UserBook.book_id == book_id)
    )
    if not other_users.scalars().first():
        # No other users have this book, delete the book record
        await db.delete(book)

    await db.commit()
    return True


async def share_book_func(
    db: AsyncSession,
    sharer_id: int,
    book_id: int,
    recipient_email: str,
) -> UserBook:
    """Share a book with another user."""
    # Check if sharer has access to the book
    sharer_book = await get_user_book(db, sharer_id, book_id)
    if not sharer_book:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Book not found"
        )

    if not sharer_book.can_share:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Cannot share this book"
        )

    # Find recipient user
    recipient = await get_user_by_email_case_insensitive(
        db, recipient_email
    )
    if not recipient:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
        )

    # Check if recipient already has access
    existing_share = await get_user_book(db, recipient.id, book_id)
    if existing_share:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User already has access to this book",
        )

    # Create shared access for recipient
    shared_book = UserBook(
        user_id=recipient.id,
        book_id=book_id,
        shared_by_user_id=sharer_id,
        can_share=False,  # Recipients can't reshare by default
    )

    db.add(shared_book)
    await db.commit()
    await db.refresh(shared_book)

    return shared_book


async def get_shared_books(
    db: AsyncSession, user_id: int
) -> List[UserBook]:
    """Get books shared with a user."""
    result = await db.execute(
        select(UserBook).where(
            and_(
                UserBook.user_id == user_id,
                UserBook.shared_by_user_id.isnot(None)
            )
        )
    )
    return result.scalars().all()


async def get_books_shared_by_user(
    db: AsyncSession, user_id: int
) -> List[UserBook]:
    """Get books shared by a user."""
    result = await db.execute(
        select(UserBook).where(UserBook.shared_by_user_id == user_id)
    )
    return result.scalars().all()
