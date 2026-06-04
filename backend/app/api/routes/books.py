from typing import List
from fastapi import (
    APIRouter, Depends, HTTPException, status, UploadFile, File, Form
)
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.utils.auth_utils import get_current_user
from app.services.book_service import (
    create_book, get_user_books, get_user_book, update_book,
    update_user_book, delete_book, share_book_func, get_shared_books,
    get_books_shared_by_user
)
from app.schemas.book import (
    BookResponse, BookListResponse, BookUpdate, BookUploadResponse,
    UserBookResponse, UserBookUpdate, BookShareRequest
)

router = APIRouter()


@router.get("/books", response_model=BookListResponse)
async def get_user_books_route(
    skip: int = 0,
    limit: int = 100,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get all books for the current user."""
    user_books = await get_user_books(
        db, current_user["user_id"], skip=skip, limit=limit
    )

    return BookListResponse(
        books=[BookResponse.model_validate(ub) for ub in user_books],
        total=len(user_books),
        page=skip // limit + 1,
        per_page=limit
    )


@router.get("/books/shared-with-me", response_model=List[UserBookResponse])
async def get_shared_books_route(
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get books shared with the current user."""
    shared_books = await get_shared_books(
        db, current_user["user_id"]
    )
    return [UserBookResponse.model_validate(ub) for ub in shared_books]


@router.get("/books/shared-by-me", response_model=List[UserBookResponse])
async def get_books_shared_by_me_route(
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get books shared by the current user."""
    shared_books = await get_books_shared_by_user(
        db, current_user["user_id"]
    )
    return [UserBookResponse.model_validate(ub) for ub in shared_books]


@router.get("/books/{book_id}", response_model=UserBookResponse)
async def get_user_book_route(
    book_id: int,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get a specific book for the current user."""
    user_book = await get_user_book(
        db, current_user["user_id"], book_id
    )
    if not user_book:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Book not found"
        )

    return UserBookResponse.model_validate(user_book)


@router.post("/books/upload", response_model=BookUploadResponse)
async def upload_book(
    file: UploadFile = File(...),
    title: str = Form(None),
    author: str = Form(None),
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Upload a book file."""
    # Validate file type
    if not file.filename or not file.filename.lower().endswith('.pdf'):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only PDF files are supported"
        )

    # Read file content
    file_content = await file.read()
    file_size = len(file_content)

    # Extract file type from filename
    file_type = file.filename.split('.')[-1].lower()

    # Use filename as title if not provided
    if not title:
        title = file.filename.replace(f'.{file_type}', '')

    if not author:
        author = "Unknown"

    # Create book data
    from app.schemas.book import BookCreate
    book_data = BookCreate(
        title=title,
        author=author,
        file_type=file_type,
        file_size=file_size
    )

    # Create book record
    book = await create_book(
        db, book_data, current_user["user_id"]
    )

    # Save file to storage
    import io
    file_bytes = io.BytesIO(file_content)
    from app.services.storage_service import StorageService
    storage_service = StorageService()
    await storage_service.save_book_file(
        book.uuid, file_type, file_bytes
    )

    return BookUploadResponse(
        book=BookResponse.model_validate(book),
        message="Book uploaded successfully"
    )


@router.put("/books/{book_id}", response_model=BookResponse)
async def update_book_route(
    book_id: int,
    book_data: BookUpdate,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Update a book."""
    # Check if user has access to the book
    user_book = await get_user_book(
        db, current_user["user_id"], book_id
    )
    if not user_book:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Book not found"
        )

    book = await update_book(db, book_id, book_data)
    if not book:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Book not found"
        )

    return BookResponse.model_validate(book)


@router.put("/books/{book_id}/user-book", response_model=UserBookResponse)
async def update_user_book_route(
    book_id: int,
    user_book_data: UserBookUpdate,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Update user's book relationship (reading progress, notes, etc.)."""
    user_book = await update_user_book(
        db, current_user["user_id"], book_id, user_book_data
    )
    if not user_book:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Book not found"
        )

    return UserBookResponse.model_validate(user_book)


@router.delete("/books/{book_id}")
async def delete_book_route(
    book_id: int,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Delete a book."""
    success = await delete_book(
        db, book_id, current_user["user_id"]
    )
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Book not found"
        )

    return {"message": "Book deleted successfully"}


@router.post("/books/{book_id}/share")
async def share_book_route(
    book_id: int,
    share_request: BookShareRequest,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Share a book with another user."""
    await share_book_func(
        db, current_user["user_id"], book_id, share_request.recipient_email
    )

    return {"message": f"Book shared with {share_request.recipient_email}"}
