from fastapi.testclient import TestClient
from app.main import app

# Cliente de pruebas que simula peticiones HTTP a FastAPI
client = TestClient(app)

def test_read_root():
    """Valida que el endpoint raíz responda 200 y status online."""
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "online"

def test_predict_exitoso():
    """Valida una predicción correcta enviando todos los datos requeridos."""
    payload = {
        "consumo_kwh": 530.5,
        "cantidad_equipos": 12,
        "horas_alto_consumo": 7,
        "tipo_inmueble": "Casa",
        "region": "Centro",
        "uso_horario_pico": True
    }
    response = client.post("/api/v1/predict", json=payload)
    assert response.status_code == 200
    
    data = response.json()
    assert "categoria" in data
    assert "costo_estimado_usd" in data
    assert "recomendaciones" in data
    assert isinstance(data["recomendaciones"], list)
    assert len(data["recomendaciones"]) > 0

def test_predict_validacion_pydantic_error():
    """Valida que retorne error 422 si se envía un formato incorrecto."""
    payload_invalido = {
        "consumo_kwh": "CINCO_CIENTOS",  # Debería ser float
        "cantidad_equipos": 12
    }
    response = client.post("/api/v1/predict", json=payload_invalido)
    assert response.status_code == 422