import uuid
import os
from datetime import datetime
from typing import List, Optional
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
import numpy as np
import joblib
import pandas as pd

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# ── Carga del modelo de Regresión (DataScience) ─────────────────────────────
# Se prioriza el modelo de Regresión Logística ('modelo_pipeline_log.joblib') entrenado por DataScience
MODELO_PIPELINE = None
MODELO_NOMBRE = "fallback"
try:
    ruta_log = os.path.join(BASE_DIR, "modelo_pipeline_log.joblib")
    MODELO_PIPELINE = joblib.load(ruta_log)
    MODELO_NOMBRE = "LogisticRegression (Pipeline - DataScience)"
    print(f"[OK] Modelo de Regresión cargado correctamente: {MODELO_NOMBRE} desde {ruta_log}")
except Exception as e1:
    print(f"[WARN] No se pudo cargar el modelo de regresión: {e1}")
    try:
        ruta_forest = os.path.join(BASE_DIR, "modelo_pipeline_forest.joblib")
        MODELO_PIPELINE = joblib.load(ruta_forest)
        MODELO_NOMBRE = "RandomForestClassifier (Fallback)"
        print(f"[OK] Modelo fallback cargado: {MODELO_NOMBRE} desde {ruta_forest}")
    except Exception as e2:
        print(f"[WARN] No se pudo cargar modelo forest de respaldo: {e2}")
        print("[FALLBACK] Se usará clasificación por reglas heurísticas de DataScience.")

# Mapeo inverso: el modelo fue entrenado con {Eficiente: 0, Moderado: 1, Ineficiente: 2}
MAPEO_INVERSO = {0: "Eficiente", 1: "Moderado", 2: "Ineficiente"}

# ── App FastAPI ───────────────────────────────────────────────────────────
app = FastAPI(title="EnergiAI - ML Inference API (Scikit-Learn Logistic Regression)", version="2.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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

def generar_recomendaciones(req: AnalisisRequest, categoria: str) -> List[str]:
    """
    Genera recomendaciones dinámicas contextuales basadas exactamente en la lógica
    y reglas desarrolladas por el equipo de DataScience en EnergiAI_v2.ipynb.
    """
    recomendaciones = []
    region_base = (req.region or "").split("(")[0].strip()
    if region_base not in ["Norte", "Centro", "Sur"]:
        region_base = "Centro"

    tipo_inmueble = req.tipo_inmueble or "Casa"
    uso_pico = bool(req.uso_horario_pico)
    horas_alto_consumo = req.horas_alto_consumo
    cantidad_equipos = req.cantidad_equipos
    consumo_kwh = req.consumo_kwh

    if categoria == 'Ineficiente':
        recomendaciones.append("Atención: Tu perfil de consumo energético se encuentra en la categoría Ineficiente.")

        # Cruce 1: Departamento + Centro (los mayores coeficientes positivos del modelo de regresión)
        if tipo_inmueble == 'Departamento' and region_base == 'Centro':
            recomendaciones.append("Detectamos que vives en un departamento en la zona central, que registra un mayor riesgo de ineficiencia. Revisa el aislamiento de puertas y ventanas.")

        # Cruce 2: Uso en horario pico (booleano)
        if uso_pico:
            recomendaciones.append("Registras consumo durante el horario punta (18:00 - 22:00 hs). Desplazar el uso de electrodomésticos de mayor potencia fuera de este horario reducirá sustancialmente el costo del servicio.")

        # Cruce 3: Horas continuas de alto consumo
        if horas_alto_consumo >= 4:
            recomendaciones.append(f"Registras un promedio elevado de horas en alto consumo ({horas_alto_consumo} hrs/día). Te sugerimos utilizar temporizadores o enchufes inteligentes.")

        # Cruce 4: Relación Equipos vs. Consumo
        if cantidad_equipos <= 5 and consumo_kwh > 250:
            recomendaciones.append("Tienes pocos electrodomésticos pero un consumo eléctrico elevado. Es muy probable que algún equipo antiguo o defectuoso opere con baja eficiencia.")

        # Cruce 5: Regiones extremas
        if region_base == 'Norte':
            recomendaciones.append("Vives en el Norte. El uso intensivo de aire acondicionado eleva el consumo. Optimiza la temperatura a 24°C y refuerza el aislamiento solar en tus ventanas.")
        elif region_base == 'Sur':
            recomendaciones.append("Vives en el Sur. Si utilizas calefacción eléctrica, procura complementar con aislamiento térmico en muros y techos para evitar fugas de calor.")

    elif categoria == 'Moderado':
        recomendaciones.append("Tu consumo es Moderado. Estás en el promedio, pero tienes margen de mejora.")

        if uso_pico:
            recomendaciones.append("Evitar el horario punta es tu principal oportunidad para migrar a la categoría Eficiente.")

        if horas_alto_consumo >= 4:
            recomendaciones.append("Procura regular el uso continuo de equipos de climatización para estabilizar tu consumo diario.")

    elif categoria == 'Eficiente':
        recomendaciones.append("¡Excelente trabajo! Tu perfil es Eficiente. Continúa con tus buenos hábitos de consumo.")
        if region_base == 'Sur':
            recomendaciones.append("Mantener buenas prácticas de aislación y uso de energía en el Sur contribuye a la estabilidad de la red local.")

    if not recomendaciones:
        recomendaciones.append("Optimiza tu consumo manteniendo hábitos sostenibles y revisando la calificación energética de tus electrodomésticos.")

    return recomendaciones

def clasificar_con_modelo(req: AnalisisRequest):
    """
    Clasifica usando el modelo de Regresión Logística de DataScience (Pipeline con ColumnTransformer + LogisticRegression).
    """
    region_base = (req.region or "Centro").split("(")[0].strip()
    if region_base not in ["Norte", "Centro", "Sur"]:
        region_base = "Centro"

    df_entrada = pd.DataFrame([{
        "region": region_base,
        "tipo_inmueble": req.tipo_inmueble or "Casa",
        "cantidad_equipos": req.cantidad_equipos,
        "horas_alto_consumo": req.horas_alto_consumo,
        "uso_horario_pico": req.uso_horario_pico,
        "consumo_kwh": req.consumo_kwh,
    }])

    prediccion = MODELO_PIPELINE.predict(df_entrada)[0]
    probabilidades = MODELO_PIPELINE.predict_proba(df_entrada)[0]
    prob_maxima = float(np.max(probabilidades))
    categoria = MAPEO_INVERSO.get(prediccion, "Moderado")

    return categoria, round(prob_maxima, 4)

def clasificar_con_reglas(req: AnalisisRequest):
    """Fallback por si el modelo de regresión no está disponible."""
    if req.consumo_kwh > 400 or req.horas_alto_consumo >= 7 or (req.consumo_kwh > 300 and req.uso_horario_pico) or req.cantidad_equipos >= 15:
        return "Ineficiente", 0.89
    elif req.consumo_kwh > 200 or req.horas_alto_consumo >= 4 or req.cantidad_equipos >= 7:
        return "Moderado", 0.82
    else:
        return "Eficiente", 0.93

# ── Endpoints ─────────────────────────────────────────────────────────────

@app.get("/")
def root():
    return {
        "service": "EnergiAI - ML Inference API (Scikit-Learn Logistic Regression)",
        "status": "online",
        "modelo": MODELO_NOMBRE,
        "modelo_cargado": MODELO_PIPELINE is not None,
        "documentation": "http://localhost:8000/docs",
        "health": "http://localhost:8000/health"
    }

@app.get("/predict")
def predict_get_info():
    return {
        "message": "El endpoint /predict acepta peticiones POST enviando los datos del consumo.",
        "modelo_activo": MODELO_NOMBRE,
        "documentation_interactiva": "http://localhost:8000/docs"
    }

@app.get("/health")
def health():
    return {
        "status": "ok",
        "model_loaded": MODELO_PIPELINE is not None,
        "model_name": MODELO_NOMBRE
    }

@app.post("/predict", response_model=AnalisisResponse)
def predict(req: AnalisisRequest):
    """
    Endpoint principal de inferencia.
    Usa el modelo de Regresión Logística de DataScience.
    """
    if MODELO_PIPELINE is not None:
        try:
            categoria, probabilidad = clasificar_con_modelo(req)
        except Exception as e:
            print(f"[ERROR] Fallo en predicción con modelo ML: {e}")
            categoria, probabilidad = clasificar_con_reglas(req)
    else:
        categoria, probabilidad = clasificar_con_reglas(req)

    costo = round(req.consumo_kwh * 0.75, 2)
    recs = generar_recomendaciones(req, categoria)
    identificador = "IA-" + str(uuid.uuid4())[:8].upper()
    fecha = datetime.now().isoformat()
    
    return AnalisisResponse(
        categoria=categoria,
        probabilidad=probabilidad,
        costo_estimado_mensual=costo,
        recomendaciones=recs,
        identificador=identificador,
        fecha=fecha
    )

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
