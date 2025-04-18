#!/bin/bash

# Ожидание доступности базы данных (с таймаутом)
echo "Waiting for PostgreSQL to start..."
max_retries=30
counter=0
while ! pg_isready -h $DB_HOST -p $DB_PORT -U $DB_USER; do
  sleep 1
  counter=$((counter + 1))
  if [ $counter -ge $max_retries ]; then
    echo "Could not connect to database after $max_retries attempts, continuing anyway..."
    break
  fi
done
echo "PostgreSQL connection established or timed out, proceeding..."

# Применение миграций
echo "Applying migrations..."
python manage.py migrate

# Сбор статических файлов
echo "Collecting static files..."
python manage.py collectstatic --noinput

# Создание суперпользователя (только при первом запуске)
if [ "$DJANGO_SUPERUSER_USERNAME" ] && [ "$DJANGO_SUPERUSER_EMAIL" ] && [ "$DJANGO_SUPERUSER_PASSWORD" ]; then
  echo "Creating superuser..."
  python manage.py createsuperuser --noinput --username $DJANGO_SUPERUSER_USERNAME --email $DJANGO_SUPERUSER_EMAIL || true
fi

# Запуск сервера Gunicorn
echo "Starting Gunicorn server..."
exec gunicorn win_logistics.wsgi:application --bind 0.0.0.0:8000