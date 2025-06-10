#!/bin/sh

echo "Running migrations..."
python manage.py makemigrations
python manage.py migrate

echo "Loading initial data fixtures..."
python manage.py loaddata users.json products.json skills.json

touch /app/.fixtures_loaded

echo "Starting Uvicorn ASGI server..."
exec uvicorn theApp.asgi:application --host 0.0.0.0 --port 8000
