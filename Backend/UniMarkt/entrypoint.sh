#!/bin/sh

# Wait for database using Python
echo "Waiting for MySQL to be ready..."

# Python script to check MySQL connection
cat > check_mysql.py << EOF
import socket
import time
import sys

host = "db"
port = 3306
max_attempts = 30
attempt = 0

print("Checking connection to MySQL at {}:{}".format(host, port))

while attempt < max_attempts:
    attempt += 1
    try:
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.settimeout(1)
        result = sock.connect_ex((host, port))
        sock.close()
        if result == 0:
            print("MySQL is ready!")
            sys.exit(0)
    except socket.error:
        pass
    
    print(f"Attempt {attempt}/{max_attempts}: MySQL not ready yet, waiting...")
    time.sleep(5)

print("Could not connect to MySQL after {} attempts".format(max_attempts))
sys.exit(1)
EOF

# Run the check script
python check_mysql.py

# Wait a bit longer to ensure MySQL is fully initialized
echo "MySQL port is open, waiting 5 more seconds for full initialization..."
sleep 5

echo "Running migrations..."
python manage.py makemigrations
python manage.py migrate

echo "Loading initial data fixtures..."
python manage.py loaddata users.json products.json skills.json

touch /app/.fixtures_loaded

echo "Starting Uvicorn ASGI server..."
echo "------------ASGI USED---------------"
exec uvicorn theApp.asgi:application --host 0.0.0.0 --port 8000
