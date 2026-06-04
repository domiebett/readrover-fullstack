FROM python:3.11-slim
WORKDIR /app
ENV PYTHONPATH=/app

# Install production dependencies
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code and database migrations
COPY app ./app
COPY alembic ./alembic
COPY alembic.ini ./

# Copy startup script
COPY startup.sh ./
RUN chmod +x startup.sh

# Create non-root user for security
RUN adduser --disabled-password --gecos '' appuser && chown -R appuser:appuser /app
USER appuser

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8000/api/health || exit 1

CMD ["./startup.sh"]
