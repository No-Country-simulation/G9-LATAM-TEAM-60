import uuid
from datetime import datetime
from typing import List, Optional
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn

app = FastAPI(title="EnergiAI - ML Inference API", version="1.0.0")

# Habilitar CORS para permitir peticiones desde el Frontend React (http://localhost:5173)
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
    recs = []
    if req.uso_horario_pico:
        recs.append("Desplazar el uso de electrodomésticos fuera del horario pico (18:00 - 22:00).")
    if req.horas_alto_consumo >= 7:
        recs.append("Distribuir la demanda y utilizar temporizadores para reducir horas continuas de alto consumo.")
    if req.cantidad_equipos > 15:
        recs.append("Se recomienda una auditoría de eficiencia energética dada la cantidad de equipos conectados.")
    if req.region == "Norte" and req.consumo_kwh > 350:
        recs.append("Optimizar sistemas de climatización manteniendo el aire acondicionado a 24°C.")
    elif req.region == "Sur" and req.consumo_kwh > 350:
        recs.append("Instalar termostatos programables y aprovechar la calefacción pasiva.")
    
    if categoria == "Ineficiente":
        recs.append("Alerta crítica de alto consumo: desconecta equipos fantasma en modo espera y revisa la instalación eléctrica.")
    elif categoria == "Moderado" and not recs:
        recs.append("Optimiza la iluminación migrando a bombillas LED de bajo consumo.")
    elif categoria == "Eficiente":
        recs.append("¡Felicidades! Mantienes un consumo sostenible. Continúa con tus buenos hábitos de ahorro.")
    return recs

@app.get("/health")
def health():
    return {"status": "ok", "model_loaded": True}

@app.post("/predict", response_model=AnalisisResponse)
def predict(req: AnalisisRequest):
    consumo = req.consumo_kwh
    horas = req.horas_alto_consumo
    
    if consumo > 400 or horas > 7:
        categoria = "Ineficiente"
        probabilidad = 0.88
    elif consumo > 200:
        categoria = "Moderado"
        probabilidad = 0.82
    else:
        categoria = "Eficiente"
        probabilidad = 0.93
        
    costo = round(consumo * 0.75, 2)
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
