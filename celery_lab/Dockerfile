FROM python:3.12-slim

WORKDIR /app

# Install dependencies first so Docker can cache this layer.
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the lab code.
COPY . .

# Default command; docker-compose overrides it per service.
CMD ["celery", "-A", "tasks", "worker", "--loglevel=info"]
