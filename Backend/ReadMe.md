# UniMarkt Backend

This repository contains the backend for the UniMarkt marketplace app built with Django REST Framework.

---

## Local Setup

Follow these steps to set up and run the app locally on your machine:

### 1. Clone the repository
```bash
git clone <repo-url>
cd Backend/UniMarkt
```

### 2. Create  .env file in the root directory based on your local mysql credentials(for local development below is the example .env file, for production ask .env file from the backend developer)

```bash
DEBUG=True
DB_NAME=unimarkt
DB_USER=root
DB_PASSWORD=password
DB_HOST=localhost
DB_PORT=3307
```

### 3. Create an activate virtual environment
```bash
# Windows
python -m venv venv
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate
```
### 4. Install dependencies
```bash
pip install -r requirements.txt
```
### 5. Run migrations
```bash
python manage.py makemigrations
python manage.py migrate
```
### 6. Load initial data fixtures - dev environment
```bash
python manage.py loaddata users.json products.json
```
### 7. Run the development server   
```bash
python manage.py runserver
```

### 8. Run this command to create super user account (super user or admin permission is required to visit admin panel)
```bash
python manage.py createsuperuser
```

### 9. Access the app
Admin panel: http://127.0.0.1:8000/admin
Swagger docs: http://127.0.0.1:8000/swagger/


# Docker Setup

Follow these steps to set up and run the app in Docker:

## 🔧 Step 1: Build the Docker Images

```bash
docker-compose build
```

## 🚀 Step 2: Start the Containers(wait for sometime for build to be complete)

```bash
docker compose up
```

The Django app will be available at: [http://localhost:8000/](http://localhost:8000/)

On first startup, the app will:
- Run migrations
- Load fixture data (users and products) once
- Start the Django development server

## 🛑 Stop the Containers

```bash
docker compose down
```

To also remove all database data:

```bash
docker compose down --volumes
```

## 👤 Create UniMarkt Superuser

```bash
#cd Backend/UniMarkt
docker-compose exec web sh
python manage.py createsuperuser
```

## 🗃️ Access the MySQL Database

```bash
docker exec -it unimarkt-db-1 mysql -u root -p
```





