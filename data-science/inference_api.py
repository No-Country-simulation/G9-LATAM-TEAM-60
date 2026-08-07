import uuid
import os
from datetime import datetime
from typing import List, Optional
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
import joblib
import pandas as pd

app = FastAPI(title="EnergiAI - ML Inference API (DataScience)", version="2.0.0")

# Habilitar CORS para comunicación directa con Frontend (http://localhost:5173) y Backend Spring Boot
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Rutas de modelos entrenados por DataScience
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_LOG_PATH = os.path.join(BASE_DIR, "modelo_pipeline_log.joblib")
MODEL_FOREST_PATH = os.path.join(BASE_DIR, "modelo_pipeline_forest.joblib")
ALT_MODEL_LOG_PATH = os.path.join(BASE_DIR, "..", "Week 2", "modelo_pipeline_log.joblib")

model = None
model_name = "None"

# Cargar el modelo prioritario de Regresión Logística
for path, name in [
    (MODEL_LOG_PATH, "LogisticRegression (Pipeline - DataScience)"),
    (ALT_MODEL_LOG_PATH, "LogisticRegression (Pipeline - Week 2)"),
    (MODEL_FOREST_PATH, "RandomForest (Pipeline - Fallback)")
]:
    if os.path.exists(path):
        try:
            model = joblib.load(path)
            model_name = name
            print(f"[OK] Modelo de Regresión cargado correctamente: {model_name} desde {path}")
            break
        except Exception as e:
            print(f"[WARN] Error al cargar modelo en {path}: {e}")

class AnalisisRequest(BaseModel):
    consumo_kwh: float
    uso_horario_pico: bool = False
    cantidad_equipos: int = 1
    tipo_inmueble: Optional[str] = "Casa"
    horas_alto_consumo: int = 0
    region: Optional[str] = "Centro"

class AnalisisResponse(BaseModel):
    categoria: str
    probabilidad: float
    costo_estimado_mensual: float
    recomendaciones: List[str]
    identificador: str
    fecha: str
    model_used: Optional[str] = None

def generar_recomendaciones(req: AnalisisRequest, categoria: str) -> List[str]:
    recs = []
    region_clean = (req.region or "Centro").split("(")[0].strip()
    
    if categoria == "Ineficiente":
        recs.append("Atención: Tu perfil de consumo energético se encuentra en la categoría Ineficiente.")
        if req.tipo_inmueble == "Departamento" and region_clean == "Centro":
            recs.append("Detectamos que vives en un departamento en la zona central. Revisa el aislamiento de puertas y ventanas para reducir fugas térmicas.")
        if req.uso_horario_pico:
            recs.append("Registras consumo durante el horario punta (18:00 - 22:00 hs). Desplazar el uso de electrodomésticos de mayor potencia fuera de este horario reducirá sustancialmente el costo del servicio.")
        if req.horas_alto_consumo >= 4:
            recs.append(f"Registras un promedio elevado de horas en alto consumo ({req.horas_alto_consumo} hrs/día). Te sugerimos utilizar temporizadores o enchufes inteligentes.")
        if req.cantidad_equipos <= 5 and req.consumo_kwh > 250:
            recs.append("Tienes pocos electrodomésticos pero un consumo elevado. Es probable que algún equipo antiguo opere con baja eficiencia.")
    elif categoria == "Moderado":
        recs.append("Tu consumo es Moderado. Estás en el promedio, pero tienes margen de mejora.")
        if req.uso_horario_pico:
            recs.append("Evitar el uso de electrodomésticos de gran consumo durante el horario punta es tu principal oportunidad para migrar a la categoría Eficiente.")
        if req.horas_alto_consumo >= 3:
            recs.append("Intenta agrupar el uso de equipos de alto consumo en bloques continuos para evitar picos sostenidos.")
    else:  # Eficiente
        recs.append("¡Excelente trabajo! Tu perfil de consumo es Eficiente. Mantienes un uso responsable de los recursos de tu hogar.")
        if req.uso_horario_pico:
            recs.append("Aunque eres eficiente, recuerda que desplazar el uso fuera del horario pico ayuda a estabilizar la red eléctrica comunitaria.")
            
    return recs

@app.get("/health")
def health():
    return {
        "status": "ok",
        "model_loaded": model is not None,
        "model_name": model_name
    }

@app.post("/predict", response_model=AnalisisResponse)
def predict(req: AnalisisRequest):
    region_clean = (req.region or "Centro").split("(")[0].strip()
    if region_clean not in ["Norte", "Centro", "Sur"]:
        region_clean = "Centro"

    costo_estimado = round(req.consumo_kwh * 0.75, 2)
    identificador = "IA-" + str(uuid.uuid4())[:8].upper()
    fecha_iso = datetime.now().isoformat()

    if model is not None:
        try:
            input_df = pd.DataFrame([{
                "consumo_kwh": req.consumo_kwh,
                "uso_horario_pico": int(req.uso_horario_pico),
                "cantidad_equipos": req.cantidad_equipos,
                "tipo_inmueble": req.tipo_inmueble or "Casa",
                "horas_alto_consumo": req.horas_alto_consumo,
                "region": region_clean
            }])

            pred_class = model.predict(input_df)[0]
            
            # Mapear predicción si viene como entero/string
            class_map = {0: "Eficiente", 1: "Moderado", 2: "Ineficiente"}
            categoria = class_map.get(pred_class, str(pred_class))

            probabilidad = 0.85
            if hasattr(model, "predict_proba"):
                probas = model.predict_proba(input_df)[0]
                probabilidad = round(float(max(probas)), 4)

            recs = generar_recomendaciones(req, categoria)

            return AnalisisResponse(
                categoria=categoria,
                probabilidad=probabilidad,
                costo_estimado_mensual=costo_estimado,
                recomendaciones=recs,
                identificador=identificador,
                fecha=fecha_iso,
                model_used=model_name
            )
        except Exception as e:
            print(f"[ERROR] Error al predecir con el modelo ML: {e}")

    # Fallback si el modelo no está disponible
    consumo = req.consumo_kwh
    horas = req.horas_alto_consumo
    
    if consumo > 400 or horas >= 7:
        categoria = "Ineficiente"
        probabilidad = 0.89
    elif consumo > 200:
        categoria = "Moderado"
        probabilidad = 0.82
    else:
        categoria = "Eficiente"
        probabilidad = 0.93

    recs = generar_recomendaciones(req, categoria)

    return AnalisisResponse(
        categoria=categoria,
        probabilidad=probabilidad,
        costo_estimado_mensual=costo_estimado,
        recomendaciones=recs,
        identificador=identificador,
        fecha=fecha_iso,
        model_used="Fallback (Reglas Heurísticas)"
    )

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
