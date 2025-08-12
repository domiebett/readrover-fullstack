# ReadRover

[![Backend Unit, Integration & Linting](https://github.com/domiebett/readrover-fullstack/actions/workflows/backend-tests.yml/badge.svg?branch=main)](https://github.com/domiebett/readrover-fullstack/actions/workflows/backend-tests.yml?query=branch%3Amain)

ReadRover is a modern book management and reading tracking application. Keep track of your reading journey, organize your books into shelves, and manage your personal library with an intuitive web interface.

## ✨ Features

- **User Authentication** - Secure user registration and login system
- **Book Management** - Add, organize, and track your books
- **Personal Shelves** - Create custom collections and organize your library
- **Reading Progress** - Track your reading journey (coming soon)
- **User Profiles** - Personalized user experience
- **Responsive Design** - Works seamlessly on desktop and mobile devices

## 🏗️ Architecture

ReadRover is built as a modern full-stack application:

- **Frontend**: React 19 + TypeScript + Vite with Tailwind CSS and Radix UI components
- **Backend**: FastAPI with async support and SQLAlchemy ORM
- **Database**: PostgreSQL with Alembic migrations
- **Authentication**: JWT-based authentication with secure password hashing
- **Development**: Docker Compose for easy local development setup

## 🚀 Quick Start

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/install/)
- Git

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/domiebett/readrover-fullstack.git
   cd readrover-fullstack
   ```

2. **Configure environment**
   ```bash
   cp backend/.env.example backend/.env
   # Edit backend/.env and set your SECRET_KEY and other settings
   ```

3. **Start all services**
   ```bash
   docker compose up
   ```

4. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

## 📁 Project Structure

```
readrover-fullstack/
├── backend/                 # FastAPI backend application
│   ├── app/                # Application code
│   │   ├── api/           # API routes and endpoints
│   │   ├── core/          # Core functionality (database, config)
│   │   ├── models/        # Database models
│   │   ├── schemas/       # Pydantic schemas
│   │   ├── services/      # Business logic
│   │   └── utils/         # Utility functions
│   ├── alembic/           # Database migrations
│   ├── tests/             # Backend tests
│   └── requirements.txt   # Python dependencies
├── frontend/               # React frontend application
│   ├── src/               # Source code
│   │   ├── app/          # App configuration and routing
│   │   ├── components/   # Reusable UI components
│   │   ├── features/     # Feature-specific code
│   │   ├── layouts/      # Layout components
│   │   ├── lib/          # Utility libraries
│   │   └── pages/        # Page components
│   └── package.json      # Node.js dependencies
└── docker-compose.yml     # Multi-service orchestration
```

## 🛠️ Development

### Backend Development

See [backend/README.md](backend/README.md) for detailed backend development instructions.

**Quick commands:**
```bash
# Start backend only
docker compose up backend -d

# Run tests
docker compose exec backend pytest

# Run linting
docker compose exec backend flake8

# Access backend container
docker compose exec backend bash
```

### Frontend Development

See [frontend/README.md](frontend/README.md) for detailed frontend development instructions.

**Quick commands:**
```bash
# Start frontend only
docker compose up frontend -d

# Run linting
docker compose exec frontend npm run lint

# Access frontend container
docker compose exec frontend sh
```

## 🧪 Testing & Quality

- **Automated Testing**: Backend includes comprehensive unit and integration tests
- **Code Quality**: Flake8 linting for Python code, ESLint for TypeScript/React
- **CI/CD**: GitHub Actions automatically run tests and linting on pull requests
- **Pre-commit Hooks**: Automatically run tests and linting before commits

```bash
# Run all backend tests and linting
cd backend && ./run-checks.sh

# Run frontend linting
cd frontend && npm run lint
```

## 🚢 Deployment

ReadRover is designed to be deployment-ready with Docker:

1. **Production Environment Variables**: Update `backend/.env` with production settings
2. **Database**: Use a managed PostgreSQL service for production
3. **Frontend Build**: The frontend builds to static files that can be served by any web server
4. **Security**: Ensure SECRET_KEY is properly set and CORS origins are configured

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests and linting (`./backend/run-checks.sh` and `npm run lint` in frontend)
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 📞 Support

- 🐛 **Bug Reports**: [Open an issue](https://github.com/domiebett/readrover-fullstack/issues)
- 💡 **Feature Requests**: [Open an issue](https://github.com/domiebett/readrover-fullstack/issues)
- 📖 **Documentation**: Check the individual README files in `backend/` and `frontend/` directories
