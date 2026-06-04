from pydantic import BaseModel, Field
from typing import Optional, Dict, Any
from datetime import datetime


class BookBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)
    author: str = Field(..., min_length=1, max_length=255)
    isbn: Optional[str] = Field(None, max_length=13)
    description: Optional[str] = None
    genre: Optional[str] = Field(None, max_length=100)
    publication_year: Optional[int] = Field(None, ge=1000, le=2100)
    page_count: Optional[int] = Field(None, ge=1)


class BookCreate(BookBase):
    file_type: str = Field(..., max_length=10)  # pdf, epub, mobi, etc.
    file_size: Optional[int] = Field(None, ge=0)


class BookUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=255)
    author: Optional[str] = Field(None, min_length=1, max_length=255)
    isbn: Optional[str] = Field(None, max_length=13)
    description: Optional[str] = None
    genre: Optional[str] = Field(None, max_length=100)
    publication_year: Optional[int] = Field(None, ge=1000, le=2100)
    page_count: Optional[int] = Field(None, ge=1)
    is_public: Optional[bool] = None


class BookResponse(BookBase):
    id: int
    uuid: str
    file_type: Optional[str] = None
    file_size: Optional[int] = None
    source: str = "uploaded"  # Always uploaded for now
    source_id: Optional[str] = None
    original_uploader_id: Optional[int] = None
    is_public: bool = False
    extracted_metadata: Optional[Dict[str, Any]] = None
    parsing_status: str = "pending"
    last_parsed_at: Optional[datetime] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    model_config = {"from_attributes": True}


class BookListResponse(BaseModel):
    books: list[BookResponse]
    total: int
    page: int
    per_page: int


class UserBookBase(BaseModel):
    # to_read, reading, completed, abandoned
    reading_status: str = Field("to_read", max_length=50)
    reading_progress: int = Field(0, ge=0)
    progress_percentage: float = Field(0.0, ge=0.0, le=100.0)
    personal_notes: Optional[str] = None
    personal_rating: Optional[int] = Field(None, ge=1, le=5)
    personal_review: Optional[str] = None
    is_favorite: bool = False


class UserBookCreate(UserBookBase):
    book_id: int


class UserBookUpdate(BaseModel):
    reading_status: Optional[str] = Field(None, max_length=50)
    reading_progress: Optional[int] = Field(None, ge=0)
    progress_percentage: Optional[float] = Field(None, ge=0.0, le=100.0)
    personal_notes: Optional[str] = None
    personal_rating: Optional[int] = Field(None, ge=1, le=5)
    personal_review: Optional[str] = None
    is_favorite: Optional[bool] = None


class UserBookResponse(UserBookBase):
    id: int
    user_id: int
    book_id: int
    started_reading_at: Optional[datetime] = None
    finished_reading_at: Optional[datetime] = None
    last_read_at: Optional[datetime] = None
    total_reading_time: int = 0
    reading_sessions_count: int = 0
    can_share: bool = True
    shared_by_user_id: Optional[int] = None
    personal_metadata: Optional[Dict[str, Any]] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    book: BookResponse

    model_config = {"from_attributes": True}


class BookShareRequest(BaseModel):
    recipient_email: str = Field(
        ..., description="Email of user to share book with"
    )


class BookUploadResponse(BaseModel):
    book: BookResponse
    message: str = "Book uploaded successfully"
