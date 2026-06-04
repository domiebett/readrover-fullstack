# ReadRover Backend

The backend API for ReadRover - a FastAPI application providing authentication, user management, and book tracking services.

## 🛠️ Tech Stack

- **FastAPI** - Modern, fast web framework for building APIs with Python
- **SQLAlchemy** - Async ORM for database operations
- **PostgreSQL** - Robust relational database with asyncpg driver
- **Alembic** - Database migration management
- **Pydantic** - Data validation and serialization
- **JWT Authentication** - Secure token-based authentication
- **pytest** - Comprehensive testing framework
- **Docker** - Containerized development and deployment

## 🚀 Getting Started

### Prerequisites

- Python 3.11+ (for local development)
- PostgreSQL (or use Docker)
- Docker and Docker Compose (recommended)

### Development Setup

#### Option 1: Using Docker (Recommended)

```bash
# From the project root
docker compose up backend -d

# The API will be available at http://localhost:8000
# API docs at http://localhost:8000/docs
```

#### Option 2: Local Development

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
# For development (includes testing tools):
pip install -r requirements-dev.txt

# For production only:
# pip install -r requirements.txt

# Copy environment file
cp .env.example .env
# Edit .env with your settings

# Run database migrations
alembic upgrade head

# Start the development server
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

### Environment Configuration

Copy `.env.example` to `.env` and configure the following variables:

```bash
# Database Configuration
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=readrover
POSTGRES_HOST=db          # Use 'localhost' for local development
POSTGRES_PORT=5432

# Authentication Settings
SECRET_KEY=your-secret-key-here    # Generate a secure random key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
```

**Important**: Generate a secure `SECRET_KEY` for production:

```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

## 📁 Project Structure

```
backend/
├── app/                    # Application source code
│   ├── api/               # API routes and endpoints
│   │   └── routes/        # Route modules
│   │       ├── auth.py    # Authentication endpoints
│   │       └── health.py  # Health check endpoints
│   ├── core/              # Core application components
│   │   ├── config.py      # Configuration settings
│   │   ├── database.py    # Database setup and connection
│   │   └── security.py    # Security utilities
│   ├── models/            # SQLAlchemy database models
│   │   └── user.py        # User model
│   ├── schemas/           # Pydantic schemas for request/response
│   │   └── user.py        # User schemas
│   ├── services/          # Business logic services
│   │   └── auth.py        # Authentication service
│   ├── utils/             # Utility functions
│   └── main.py            # FastAPI application setup
├── alembic/               # Database migrations
│   ├── versions/          # Migration files
│   └── env.py             # Alembic configuration
├── tests/                 # Test suite
│   ├── conftest.py        # Test configuration and fixtures
│   ├── test_auth.py       # Authentication tests
│   └── test_health.py     # Health endpoint tests
├── alembic.ini            # Alembic configuration file
├── pytest.ini            # Pytest configuration
├── requirements.txt       # Production Python dependencies
├── requirements-dev.txt   # Development Python dependencies
└── run-checks.sh          # Test and lint runner script
```

## 🔌 API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user information

### Health Check

- `GET /api/health` - Application health status
- `GET /` - Root endpoint

### API Documentation

Interactive API documentation is available when the server is running:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **OpenAPI JSON**: http://localhost:8000/openapi.json

## 🗄️ Database

### Models

#### User Model
```python
class User(Base):
    id: int (Primary Key)
    username: str (Unique)
    email: str (Unique, Indexed)
    hashed_password: str
    created_at: datetime
    updated_at: datetime
```

### Migrations

Database schema changes are managed with Alembic:

```bash
# Create a new migration
docker compose exec backend alembic revision --autogenerate -m "Description"

# Apply migrations
docker compose exec backend alembic upgrade head

# Check migration status
docker compose exec backend alembic current

# Downgrade (rollback)
docker compose exec backend alembic downgrade -1
```

### Database Access

```bash
# Access PostgreSQL container
docker compose exec db psql -U postgres -d readrover

# Backup database
docker compose exec db pg_dump -U postgres readrover > backup.sql

# Restore database
docker compose exec -T db psql -U postgres readrover < backup.sql
```

## 🔐 Authentication & Security

### JWT Authentication

- **Access Tokens**: Short-lived tokens for API access
- **Password Hashing**: Bcrypt for secure password storage
- **Token Validation**: Automatic validation on protected routes

### Security Features

- **CORS Configuration**: Configured for frontend origin
- **Password Requirements**: Enforced through Pydantic validation
- **SQL Injection Protection**: SQLAlchemy ORM provides protection
- **Input Validation**: Pydantic schemas validate all inputs

## 🧪 Testing

### Running Tests

```bash
# Run all tests
docker compose exec backend pytest

# Run with coverage
docker compose exec backend pytest --cov=app

# Run specific test file
docker compose exec backend pytest tests/test_auth.py

# Run with verbose output
docker compose exec backend pytest -v

# Run and watch for changes (local development)
cd backend && pytest --watch
```

### Test Structure

- **Unit Tests**: Test individual functions and methods
- **Integration Tests**: Test API endpoints and database operations
- **Fixtures**: Reusable test data and setup in `conftest.py`
- **Test Database**: Isolated SQLite database for testing

### Writing Tests

```python
# Example test structure
def test_create_user(test_client, test_db):
    """Test user creation endpoint."""
    user_data = {
        "username": "testuser",
        "email": "test@example.com",
        "password": "securepassword"
    }
    response = test_client.post("/api/auth/register", json=user_data)
    assert response.status_code == 201
    assert response.json()["username"] == "testuser"
```

## 🔧 Development Tools

### Code Quality

```bash
# Run linting
docker compose exec backend flake8

# Run all checks (tests + linting)
docker compose exec backend ./run-checks.sh

# Format code (if you add a formatter)
docker compose exec backend black app/

# Type checking (if you add mypy)
docker compose exec backend mypy app/
```

### Development Commands

```bash
# Access backend container shell
docker compose exec backend bash

# Install new package
docker compose exec backend pip install package-name
# Don't forget to update requirements.txt

# View logs
docker compose logs backend -f

# Restart backend service
docker compose restart backend
```

## 📊 Database Schema

### Current Schema

```sql
-- Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE
);

-- Indexes
CREATE INDEX idx_users_email ON users(email);
```

## 🚢 Production Deployment

### Environment Setup

1. **Environment Variables**: Ensure all production environment variables are set
2. **Database**: Use a managed PostgreSQL service (AWS RDS, Google Cloud SQL, etc.)
3. **Security**: Use strong `SECRET_KEY` and secure password policies
4. **CORS**: Update allowed origins for your production frontend domain

### Docker Production

```bash
# Build production image
docker build -t readrover-backend .

# Run with production settings
docker run -p 8000:8000 \
  -e SECRET_KEY=your-production-secret \
  -e POSTGRES_HOST=your-db-host \
  readrover-backend
```

### Health Monitoring

The `/api/health` endpoint provides application status for monitoring tools:

```json
{
  "status": "healthy",
  "database": "connected",
  "timestamp": "2024-01-01T00:00:00Z"
}
```

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Check PostgreSQL is running: `docker compose ps`
   - Verify connection settings in `.env`
   - Check database logs: `docker compose logs db`

2. **Migration Errors**
   - Reset migrations: `docker compose exec backend alembic downgrade base`
   - Delete migration files and recreate: `alembic revision --autogenerate`

3. **Import Errors**
   - Ensure `PYTHONPATH` includes current directory
   - Check for circular imports
   - Verify all dependencies are installed

### Debugging

```bash
# Enable debug logging
export PYTHONPATH=/app:$PYTHONPATH
export DEBUG=true

# Run with debugger
docker compose exec backend python -m pdb app/main.py

# Database debugging
docker compose exec backend python -c "
from app.core.database import engine
print(engine.url)
"
```

## 🤝 Contributing

### Development Workflow

1. **Create Feature Branch**: `git checkout -b feature/new-feature`
2. **Write Tests**: Add tests for new functionality
3. **Implement Feature**: Follow existing patterns and conventions
4. **Run Tests**: Ensure all tests pass (`./run-checks.sh`)
5. **Update Documentation**: Update this README if needed
6. **Submit PR**: Create a pull request with clear description

### Code Style

- **PEP 8**: Follow Python style guidelines
- **Type Hints**: Use type hints for all functions
- **Docstrings**: Document all public functions and classes
- **Error Handling**: Use appropriate HTTP status codes and error messages

### Adding New Endpoints

1. Create route in `app/api/routes/`
2. Add business logic in `app/services/`
3. Create Pydantic schemas in `app/schemas/`
4. Add database models in `app/models/` (if needed)
5. Write comprehensive tests
6. Update API documentation

## 📚 Useful Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [SQLAlchemy Async Tutorial](https://docs.sqlalchemy.org/en/20/orm/extensions/asyncio.html)
- [Alembic Documentation](https://alembic.sqlalchemy.org/)
- [Pydantic Documentation](https://docs.pydantic.dev/)
- [pytest Documentation](https://docs.pytest.org/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
