from sqlalchemy import (
    Column, Integer, String, Text, DateTime, Boolean, Float, func, ForeignKey,
    UniqueConstraint, CheckConstraint
)
from sqlalchemy.orm import relationship
from sqlalchemy.types import JSON
from app.models.user import Base


class UserBook(Base):
    __tablename__ = "user_books"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    book_id = Column(Integer, ForeignKey("books.id"), nullable=False)

    # Reading progress and status
    # to_read, reading, completed, abandoned
    reading_status = Column(String(50), default="to_read")
    reading_progress = Column(Integer, default=0)  # current page number
    progress_percentage = Column(Float, default=0.0)  # 0.0 to 100.0

    # Personal data
    # User's personal notes about the book
    personal_notes = Column(Text, nullable=True)
    personal_rating = Column(Integer, nullable=True)  # 1-5 star rating
    # User's review/thoughts
    personal_review = Column(Text, nullable=True)

    # Reading metadata
    started_reading_at = Column(DateTime(timezone=True), nullable=True)
    finished_reading_at = Column(DateTime(timezone=True), nullable=True)
    # Last time user opened the book
    last_read_at = Column(DateTime(timezone=True), nullable=True)

    # Reading session data
    # Total minutes spent reading
    total_reading_time = Column(Integer, default=0)
    # Number of reading sessions
    reading_sessions_count = Column(Integer, default=0)

    # Sharing and permissions
    # Can this user share this book with others
    can_share = Column(Boolean, default=True)
    # Who shared it with this user
    shared_by_user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    is_favorite = Column(Boolean, default=False)  # User's favorite books

    # Personal metadata (JSON for flexibility)
    # User-specific data like highlights, bookmarks, etc.
    personal_metadata = Column(JSON, nullable=True)

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Constraints
    __table_args__ = (
        UniqueConstraint('user_id', 'book_id', name='unique_user_book'),
        CheckConstraint(
            'personal_rating >= 1 AND personal_rating <= 5',
            name='valid_rating'
        ),
        CheckConstraint(
            'progress_percentage >= 0.0 AND progress_percentage <= 100.0',
            name='valid_progress'
        ),
    )

    # Relationships
    user = relationship(
        "User", foreign_keys=[user_id], back_populates="user_books"
    )
    book = relationship("Book", back_populates="user_books")
    shared_by_user = relationship("User", foreign_keys=[shared_by_user_id], overlaps="shared_books")
