# 1. Imagen base oficial ligera de Python 3.12
FROM python:3.12-slim

# 2. Configurar el directorio de trabajo dentro del contenedor
WORKDIR /app

# 3. Prevenir generación de archivos .pyc y asegurar que los logs salgan directamente
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

# 4. Copiar e instalar las dependencias primero (aprovecha la caché de capas de Docker)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 5. Copiar únicamente el código fuente de la aplicación
COPY app/ ./app

# 6. Exponer el puerto donde escucha FastAPI
EXPOSE 8000

# 7. Comando para iniciar la aplicación con Uvicorn
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]