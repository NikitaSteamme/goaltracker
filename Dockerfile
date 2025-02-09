# Используем базовый образ Python
FROM python:3.11

# Устанавливаем Node.js для запуска React
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get install -y nodejs

# Создаем рабочую директорию
WORKDIR /app

# Копируем backend
COPY backend /app/backend

# Устанавливаем зависимости для backend
WORKDIR /app/backend
RUN pip install --no-cache-dir -r requirements.txt

# Копируем frontend
COPY frontend /app/frontend

# Устанавливаем зависимости для frontend
WORKDIR /app/frontend
RUN npm install

# Возвращаемся в основную директорию
WORKDIR /app

# Запускаем backend и frontend
CMD ["sh", "-c", "uvicorn backend.main:app --host 0.0.0.0 --port 8000 & cd frontend && npm start"]