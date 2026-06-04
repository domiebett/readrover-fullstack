import io

from app.core.database import get_db
from app.main import app
from httpx import ASGITransport, AsyncClient
import pytest
import pytest_asyncio
from tests.integration.test_db_setup import override_get_db


@pytest_asyncio.fixture()
async def async_client(setup_test_db):
    app.dependency_overrides = {}
    app.dependency_overrides[get_db] = override_get_db
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac


@pytest.fixture
async def auth_headers(async_client):
    """Create a test user and return auth headers."""
    # Register a test user
    register_data = {
        "username": "testuser",
        "email": "test@example.com",
        "password": "password123",
    }
    resp = await async_client.post("/api/register", json=register_data)
    assert resp.status_code == 201

    # Login to get the token
    login_data = {"email": "test@example.com", "password": "password123"}
    resp = await async_client.post("/api/login", json=login_data)
    assert resp.status_code == 200

    # Get the token from cookies
    token = resp.cookies.get("access_token")
    assert token is not None

    return {"Authorization": f"Bearer {token}"}


@pytest.fixture
def sample_pdf_file():
    """Create a mock PDF file for testing."""
    return io.BytesIO(b"%PDF-1.4\nTest PDF content")


@pytest.mark.asyncio
async def test_get_user_books_empty(async_client, auth_headers):
    """Test getting user books when none exist."""
    headers = await auth_headers
    response = await async_client.get("/api/books", headers=headers)

    assert response.status_code == 200
    data = response.json()
    assert data["books"] == []
    assert data["total"] == 0
    assert data["page"] == 1
    assert data["per_page"] == 100


@pytest.mark.asyncio
async def test_upload_book_success(
    async_client, auth_headers, sample_pdf_file
):
    """Test successful book upload."""
    headers = await auth_headers
    files = {"file": ("test_book.pdf", sample_pdf_file, "application/pdf")}
    data = {"title": "Test Book", "author": "Test Author"}

    response = await async_client.post(
        "/api/books/upload", headers=headers, files=files, data=data
    )

    assert response.status_code == 200
    data = response.json()
    assert data["message"] == "Book uploaded successfully"
    assert data["book"]["title"] == "Test Book"
    assert data["book"]["author"] == "Test Author"
    assert data["book"]["file_type"] == "pdf"
    assert data["book"]["source"] == "uploaded"


@pytest.mark.asyncio
async def test_upload_book_invalid_file_type(async_client, auth_headers):
    """Test uploading non-PDF file."""
    headers = await auth_headers
    files = {"file": ("test.txt", io.BytesIO(b"text content"), "text/plain")}
    data = {"title": "Test Book", "author": "Test Author"}

    response = await async_client.post(
        "/api/books/upload", headers=headers, files=files, data=data
    )

    assert response.status_code == 400
    assert "Only PDF files are supported" in response.json()["detail"]


@pytest.mark.asyncio
async def test_upload_book_no_file(async_client, auth_headers):
    """Test uploading without file."""
    headers = await auth_headers
    data = {"title": "Test Book", "author": "Test Author"}

    response = await async_client.post(
        "/api/books/upload", headers=headers, data=data
    )

    assert response.status_code == 422  # Validation error


@pytest.mark.asyncio
async def test_get_user_book_not_found(async_client, auth_headers):
    """Test getting a book that doesn't exist."""
    headers = await auth_headers
    response = await async_client.get("/api/books/999", headers=headers)

    assert response.status_code == 404
    assert response.json()["detail"] == "Book not found"


@pytest.mark.asyncio
async def test_update_book_not_found(async_client, auth_headers):
    """Test updating a book that doesn't exist."""
    headers = await auth_headers
    update_data = {"title": "Updated Title"}

    response = await async_client.put(
        "/api/books/999", headers=headers, json=update_data
    )

    assert response.status_code == 404
    assert response.json()["detail"] == "Book not found"


@pytest.mark.asyncio
async def test_delete_book_not_found(async_client, auth_headers):
    """Test deleting a book that doesn't exist."""
    headers = await auth_headers
    response = await async_client.delete("/api/books/999", headers=headers)

    assert response.status_code == 404
    assert response.json()["detail"] == "Book not found"


@pytest.mark.asyncio
async def test_share_book_not_found(async_client, auth_headers):
    """Test sharing a book that doesn't exist."""
    headers = await auth_headers
    share_data = {"recipient_email": "recipient@example.com"}

    response = await async_client.post(
        "/api/books/999/share", headers=headers, json=share_data
    )

    assert response.status_code == 404
    assert response.json()["detail"] == "Book not found"


@pytest.mark.asyncio
async def test_get_shared_books_empty(async_client, auth_headers):
    """Test getting shared books when none exist."""
    headers = await auth_headers
    response = await async_client.get("/api/books/shared-with-me", headers=headers)

    assert response.status_code == 200
    assert response.json() == []


@pytest.mark.asyncio
async def test_get_books_shared_by_me_empty(async_client, auth_headers):
    """Test getting books shared by user when none exist."""
    headers = await auth_headers
    response = await async_client.get("/api/books/shared-by-me", headers=headers)

    assert response.status_code == 200
    assert response.json() == []


@pytest.mark.asyncio
async def test_update_user_book_not_found(async_client, auth_headers):
    """Test updating user book that doesn't exist."""
    headers = await auth_headers
    update_data = {"reading_status": "reading", "reading_progress": 50}

    response = await async_client.put(
        "/api/books/999/user-book", headers=headers, json=update_data
    )

    assert response.status_code == 404
    assert response.json()["detail"] == "Book not found"


@pytest.mark.asyncio
async def test_upload_book_without_title_author(
    async_client, auth_headers, sample_pdf_file
):
    """Test uploading book without providing title and author."""
    headers = await auth_headers
    files = {"file": ("test_book.pdf", sample_pdf_file, "application/pdf")}

    response = await async_client.post(
        "/api/books/upload", headers=headers, files=files
    )

    assert response.status_code == 200
    data = response.json()
    assert data["book"]["title"] == "test_book"  # Uses filename
    assert data["book"]["author"] == "Unknown"  # Default author


@pytest.mark.asyncio
async def test_upload_book_large_file(async_client, auth_headers):
    """Test uploading a large file (simulated)."""
    headers = await auth_headers
    # Create a larger file
    large_content = b"x" * (10 * 1024 * 1024)  # 10MB
    files = {
        "file": ("large_book.pdf", io.BytesIO(large_content), "application/pdf")
    }
    data = {"title": "Large Book", "author": "Test Author"}

    response = await async_client.post(
        "/api/books/upload", headers=headers, files=files, data=data
    )

    assert response.status_code == 200
    data = response.json()
    assert data["book"]["file_size"] == len(large_content)
