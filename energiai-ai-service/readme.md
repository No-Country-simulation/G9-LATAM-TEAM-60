para iniciar el servicio:

cd energiai-ai-service

1. (Opcional) Eliminar algún contenedor previo si quedó colgado
Para evitar conflictos de nombre o de puerto:

docker rm -f ai-service-test

2. Reconstruir la imagen de Docker

docker build -t energiai-ai-service:latest .

3. Levantar el contenedor mapeando el puerto 8000

docker run -d -p 127.0.0.1:8000:8000 --name ai-service-test energiai-ai-service:latest

*Ver los logs de inicio:

docker logs --tail 20 ai-service-test

*Probar la raíz desde la terminal:

curl http://127.0.0.1:8000/


Prueba POST

curl -X 'POST' \
  'http://127.0.0.1:8001/api/v1/predict' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "consumo_kwh": 450.0,
  "cantidad_equipos": 8,
  "horas_alto_consumo": 5,
  "tipo_inmueble": "Departamento",
  "region": "Centro",
  "uso_horario_pico": true
}'