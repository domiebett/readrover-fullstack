#!/bin/bash
set -e

echo "Starting ReadRover backend..."

# Wait for database to be ready (simple check)
echo "Checking database connectivity..."
until python -c "
import asyncio
import sys
from app.core.database import get_db_url
from sqlalchemy import create_engine
try:
    engine = create_engine(get_db_url().replace('+asyncpg', ''))
    with engine.connect() as conn:
        conn.execute('SELECT 1')
    print('Database is ready!')
except Exception as e:
    print(f'Database not ready: {e}')
    sys.exit(1)
"; do
    echo "Database not ready, waiting 5 seconds..."
    sleep 5
done

# Run database migrations
echo "Running database migrations..."
alembic upgrade head

# Start the application
echo "Starting application..."
exec uvicorn app.main:app --host 0.0.0.0 --port 8000
