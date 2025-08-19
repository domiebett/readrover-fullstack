from sqlalchemy import (
    Column, Integer, String, Text, DateTime, Boolean, func, ForeignKey
)
from sqlalchemy.orm import relationship
from sqlalchemy.types import JSON
from app.models.user import Base


class Book(Base):
    __tablename__ = "books"

    id = Column(Integer, primary_key=True, index=True)
    # UUID for file identification
    uuid = Column(String(36), unique=True, index=True, nullable=False)
    title = Column(String(255), nullable=False, index=True)
    author = Column(String(255), nullable=False, index=True)
    isbn = Column(String(13), unique=True, index=True, nullable=True)
    description = Column(Text, nullable=True)
    genre = Column(String(100), nullable=True, index=True)
    publication_year = Column(Integer, nullable=True)
    page_count = Column(Integer, nullable=True)
    # pdf, epub, mobi, etc.
    file_type = Column(String(10), nullable=True)
    file_size = Column(Integer, nullable=True)
    # uploaded, google_books, gutenberg, etc.
    source = Column(String(50), nullable=True)
    # external ID from source
    source_id = Column(String(255), nullable=True)
    original_uploader_id = Column(
        Integer, ForeignKey("users.id"), nullable=True
    )
    is_public = Column(Boolean, default=False)

    # Parsing info
    extracted_metadata = Column(JSON, nullable=True)
    # pending, processing, completed, failed
    parsing_status = Column(String(50), default="pending")
    last_parsed_at = Column(DateTime(timezone=True), nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    user_books = relationship("UserBook", back_populates="book")
    original_uploader = relationship(
        "User", foreign_keys=[original_uploader_id]
    )
