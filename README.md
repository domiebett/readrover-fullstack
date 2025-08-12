# Read Rover Project

[![Main Backend Tests](https://github.com/domiebett/readrover-fullstack/actions/workflows/backend-tests.yml/badge.svg?branch=main)](https://github.com/domiebett/readrover-fullstack/actions/workflows/backend-tests.yml?query=branch%3Amain)
[![Develop Backend Tests](https://github.com/domiebett/readrover-fullstack/actions/workflows/backend-tests.yml/badge.svg?branch=develop)](https://github.com/domiebett/readrover-fullstack/actions/workflows/backend-tests.yml)

Read Rover is a full-stack web application with a FastAPI backend and a React + Vite frontend.

## Project Structure
- `backend/` - FastAPI backend, database, and API
- `frontend/` - React + Vite frontend
- `docker-compose.yml` - Multi-service orchestration

## Quick Start
1. Copy `backend/.env.example` to `backend/.env` and set secrets.
2. Run `docker compose up` to start all services.
3. Access frontend at http://localhost:5173 and backend at http://localhost:8000

## Development
- Backend: see `backend/README.md`
- Frontend: see `frontend/README.md`

## Testing & Quality
- Pre-commit hook runs backend tests and flake8 before every commit.
- Use `docker compose exec backend pytest` and `flake8` for backend checks.

## Contact
For project-wide questions, open an issue or contact the maintainers.
