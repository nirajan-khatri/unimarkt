# Use official Python 3.10 slim image (lightweight)
FROM python:3.10-slim

# Avoid .pyc files and enable real-time logging
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Set working directory inside container
WORKDIR /app

# Install system dependencies needed to build MySQL Python adapter
RUN apt-get update && apt-get install -y \
    build-essential \
    default-libmysqlclient-dev \
    pkg-config \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install Python packages
COPY requirements.txt /app/
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

RUN pip install "uvicorn[standard]"
RUN pip install channels_redis


# Copy all project files
COPY . /app/

# Copy entrypoint script and make executable
RUN chmod +x /app/entrypoint.sh

# Expose port 8000 (Django default)
EXPOSE 8000

# Run the entrypoint script by default
CMD ["/app/entrypoint.sh"]
