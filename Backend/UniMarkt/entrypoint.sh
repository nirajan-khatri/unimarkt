#!/bin/sh

echo "Running migrations..."
python manage.py makemigrations
python manage.py migrate

echo "Loading initial data fixtures..."
python manage.py loaddata users.json products.json

touch /app/.fixtures_loaded


echo "Starting Django development server..."
exec python manage.py runserver 0.0.0.0:8000