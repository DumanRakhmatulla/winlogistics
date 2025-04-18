FROM python:3.10-slim

# Установка рабочей директории
WORKDIR /app

# Установка зависимостей
RUN apt-get update && apt-get install -y \
    postgresql-client \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Копирование файлов проекта
COPY requirements.txt .

# Установка зависимостей Python
RUN pip install --no-cache-dir -r requirements.txt

# Копирование кода проекта
COPY . .

# Установка разрешений для entrypoint скрипта
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

# Открытие порта для доступа к приложению
EXPOSE 8000

# Запуск приложения при старте контейнера
ENTRYPOINT ["/docker-entrypoint.sh"]