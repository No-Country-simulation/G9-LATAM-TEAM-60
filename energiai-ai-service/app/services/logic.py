import pandas as pd
from .schemas import PredictionRequest

def procesar_prediccion_y_recomendaciones(request: PredictionRequest, model):
    """
    Transforma la petición aplicando One-Hot Encoding según las variables 
    esperadas por el modelo entrenado.
    """
    # 1. Mapeo de One-Hot Encoding según las variables esperadas por el modelo
    is_departamento = 1 if request.tipo_inmueble.strip().lower() == "departamento" else 0
    is_region_norte = 1 if request.region.strip().lower() == "norte" else 0
    is_region_sur = 1 if request.region.strip().lower() == "sur" else 0
    is_horario_pico = 1 if request.uso_horario_pico else 0

    # 2. Construir el DataFrame con el orden y nombres exactos que vio el modelo en el entrenamiento
    input_data = pd.DataFrame([{
        "consumo_kwh": request.consumo_kwh,
        "cantidad_equipos": request.cantidad_equipos,
        "horas_alto_consumo": request.horas_alto_consumo,
        "tipo_inmueble_Departamento": is_departamento,
        "region_Norte": is_region_norte,
        "region_Sur": is_region_sur,
        "uso_horario_pico_True": is_horario_pico
    }])

    # Si el modelo guardó las columnas en otro orden, garantizamos alineación con los nombres esperados
    if hasattr(model, "feature_names_in_"):
        input_data = input_data.reindex(columns=model.feature_names_in_, fill_value=0)

    # 3. Ejecutar la predicción real del modelo ML
    prediccion_array = model.predict(input_data)
    categoria_predicha = str(prediccion_array[0])

    # 4. Cálculo financiero aproximado ($0.75 USD por kWh)
    costo_estimado = round(request.consumo_kwh * 0.75, 2)

    # 5. Generación de recomendaciones personalizadas
    recomendaciones = []
    
    if request.horas_alto_consumo > 5:
        recomendaciones.append("Reduce las horas continuas de uso de aparatos de alto consumo (estufas, aire acondicionado, secadoras).")
    
    if request.uso_horario_pico:
        recomendaciones.append("Desplaza el uso de electrodomésticos de gran consumo fuera del horario pico (18:00 a 22:00 hrs).")
        
    if request.consumo_kwh > 400:
        recomendaciones.append("Considera realizar una auditoría de eficiencia energética o cambiar a equipos con etiqueta Energy Star.")

    if not recomendaciones:
        recomendaciones.append("Tu patrón de consumo actual es adecuado. Mantén tus hábitos de ahorro energético.")

    return {
        "categoria": categoria_predicha,
        "costo_estimado_usd": costo_estimado,
        "recomendaciones": recomendaciones
    }   