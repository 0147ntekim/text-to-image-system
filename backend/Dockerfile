
# Use Python 3.12 as the runtime environment
FROM python:3.12-slim

# Prevent Python from writing .pyc files
ENV PYTHONDONTWRITEBYTECODE=1

# Ensure logs appear immediately
ENV PYTHONUNBUFFERED=1

# Set the working directory inside the container
WORKDIR /app

# Install Python dependencies
COPY requirements.txt .

RUN pip install --no-cache-dir --upgrade pip \
    && pip install --no-cache-dir -r requirements.txt

# Copy the backend application
COPY . .

# Expose the backend port
EXPOSE 8000

# Start FastAPI
CMD ["sh", "-c", "uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}"]
