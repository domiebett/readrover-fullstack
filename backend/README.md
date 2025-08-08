# Read Rover Backend

This directory contains the backend code for the Read Rover project.

## Key Features
- FastAPI application for authentication and user management
- Alembic migrations for database schema
- Integration and unit tests using pytest
- Pre-commit hook to enforce tests and code style

## Development
- Start backend: `docker compose up backend -d`
- Run tests: `docker compose exec backend pytest`
- Run flake8: `docker compose exec backend flake8`

## Testing
- All tests and flake8 checks are run automatically before each commit (see `.git/hooks/pre-commit`).

## Structure
- `app/` - FastAPI app code
- `alembic/` - Database migrations
- `tests/` - Unit and integration tests

## Environment
- Copy `.env.example` to `.env` and adjust as needed.

## Contact
For backend-specific questions, contact the backend maintainers.
