from pydantic import BaseModel, Field
from typing import List

# Esquema de Entrada (Datos que el Backend/Frontend deben enviar en formato JSON)
class PredictionRequest(BaseModel):
    consumo_kwh: float = Field(..., examples=[530.5], description="Consumo eléctrico total en kWh")
    cantidad_equipos: int = Field(..., example=12, description="Cantidad de electrodomésticos reportados")
    horas_alto_consumo: int = Field(..., example=7, description="Horas continuas de alto consumo diario")
    tipo_inmueble: str = Field(..., example="Casa", description="'Casa' o 'Departamento'")
    region: str = Field(..., example="Centro", description="'Norte', 'Centro' o 'Sur'")
    uso_horario_pico: bool = Field(..., example=True, description="True si consume en horario pico (18:00 a 22:00 hrs)")

# Esquema de Salida (Estructura JSON que la API responderá)
class PredictionResponse(BaseModel):
    categoria: str = Field(..., example="Ineficiente", description="Categoría predicha por el modelo")
    costo_estimado_usd: float = Field(..., example=397.88, description="Cálculo financiero aproximado")
    recomendaciones: List[str] = Field(..., description="Lista de consejos de eficiencia energética")