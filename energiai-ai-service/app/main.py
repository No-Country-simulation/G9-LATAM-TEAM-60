from fastapi import FastAPI, HTTPException
from contextlib import asynccontextmanager
from app.schemas import PredictionRequest, PredictionResponse
from app.model_loader import model_loader
from app.logic import procesar_prediccion_y_recomendaciones

# Evento de inicio: Cargar el modelo en memoria antes de recibir peticiones
@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        model_loader.load_model()
    except Exception as e:
        print(f"❌ Error al cargar el modelo: {e}")
    yield

app = FastAPI(
    title="EnergiAI - AI Service",
    description="Microservicio en Python para predicción de eficiencia energética y recomendaciones personalizadas.",
    version="1.0.0",
    lifespan=lifespan
)

@app.get("/")
def read_root():
    return {"message": "Servicio EnergiAI en ejecución con modelo ML activo.", "status": "online"}

@app.post("/api/v1/predict", response_model=PredictionResponse)
def predict(request: PredictionRequest):
    if model_loader.model is None:
        raise HTTPException(status_code=500, detail="El modelo de Machine Learning no está cargado correctamente.")
    
    try:
        resultado = procesar_prediccion_y_recomendaciones(request, model_loader.model)
        return PredictionResponse(**resultado)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error procesando la predicción: {str(e)}")