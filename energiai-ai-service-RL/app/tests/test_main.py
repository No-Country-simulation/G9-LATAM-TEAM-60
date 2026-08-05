import pytest

def test_health_check(test_client):
    """Valida que la API esté respondiendo correctamente."""
    response = test_client.get("/")
    assert response.status_code == 200


def test_predict_success(test_client):
    """Valida una predicción exitosa enviando el payload completo y válido."""
    payload = {
        "consumo_kwh": 530.5,
        "cantidad_equipos": 12,
        "horas_alto_consumo": 7,
        "tipo_inmueble": "Casa",
        "region": "Centro",
        "uso_horario_pico": True
    }
    
    response = test_client.post("/api/v1/predict", json=payload)
    
    assert response.status_code == 200
    
    data = response.json()
    
    # Validamos que la respuesta cumpla con PredictionResponse
    assert "categoria" in data
    assert "costo_estimado_usd" in data
    assert "recomendaciones" in data
    
    # Validamos tipos de datos de retorno
    assert isinstance(data["categoria"], str)
    assert isinstance(data["costo_estimado_usd"], (int, float))
    assert isinstance(data["recomendaciones"], list)


def test_predict_invalid_payload(test_client):
    """Valida que la API retorne un error 422 si falta algún campo obligatorio."""
    payload = {
        "consumo_kwh": 530.5,
        "cantidad_equipos": 12
        # Faltan campos como horas_alto_consumo, tipo_inmueble, etc.
    }
    
    response = test_client.post("/api/v1/predict", json=payload)
    assert response.status_code == 422


def test_predict_model_not_loaded(test_client, monkeypatch):
    """Simula que el modelo no pudo cargarse en memoria para verificar la respuesta 500."""
    from app.main import model_loader
    
    # Forzamos temporalmente a que model_loader.model sea None
    monkeypatch.setattr(model_loader, "model", None)
    
    payload = {
        "consumo_kwh": 530.5,
        "cantidad_equipos": 12,
        "horas_alto_consumo": 7,
        "tipo_inmueble": "Casa",
        "region": "Centro",
        "uso_horario_pico": True
    }
    
    response = test_client.post("/api/v1/predict", json=payload)
    
    assert response.status_code == 500
    assert response.json()["detail"] == "El modelo de Machine Learning no está cargado correctamente."