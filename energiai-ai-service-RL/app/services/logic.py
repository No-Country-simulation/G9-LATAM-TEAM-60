import pandas as pd
from app.schemas.predict import PredictionRequest

def procesar_prediccion_y_recomendaciones(request: PredictionRequest, model):
    """
    Recibe la petición HTTP (Pydantic), prepara el DataFrame convirtiendo tipos de datos 
    problemáticos (como booleanos a enteros), ejecuta la predicción con el modelo cargado
    y genera recomendaciones de negocio personalizadas.
    """
    # 1. Extraer los datos de la petición y normalizar textos
    data_dict = {
        "consumo_kwh": float(request.consumo_kwh),
        "cantidad_equipos": int(request.cantidad_equipos),
        "horas_alto_consumo": int(request.horas_alto_consumo),
        "tipo_inmueble": str(request.tipo_inmueble).strip().capitalize(), # Ejemplo: "Departamento"
        "region": str(request.region).strip().capitalize(),               # Ejemplo: "Centro"
        "uso_horario_pico": int(request.uso_horario_pico)                 # SOLUCIÓN: Convierte True -> 1, False -> 0
    }

    # 2. Crear el DataFrame con un solo registro
    df = pd.DataFrame([data_dict])

    # 3. Ajustar el orden de las columnas si el modelo fue entrenado con un orden específico
    if hasattr(model, "feature_names_in_"):
        df = df.reindex(columns=model.feature_names_in_)

    # 4. Ejecutar la predicción del modelo
    prediccion_array = model.predict(df)
    categoria_predicha = str(prediccion_array[0])

    # 5. Cálculo estimado en USD ($0.75 USD por kWh)
    costo_estimado = round(request.consumo_kwh * 0.75, 2)

    # 6. Lógica de negocio para las recomendaciones
    recomendaciones = []
    
    if request.horas_alto_consumo >= 5:
        recomendaciones.append(
            "Reduce las horas continuas de uso de aparatos de alto consumo (estufas, aire acondicionado, secadoras)."
        )
    
    if request.uso_horario_pico:
        recomendaciones.append(
            "Desplaza el uso de electrodomésticos de gran consumo fuera del horario pico (18:00 a 22:00 hrs)."
        )
    
    if request.consumo_kwh > 275:
        recomendaciones.append(
            "Tu consumo supera el promedio (237 kWh). Considera realizar una auditoría de eficiencia energética o renovar equipos por eficientes."
        )

    if not recomendaciones:
        recomendaciones.append(
            "Tu patrón de consumo actual es adecuado. Mantén tus hábitos de ahorro energético."
        )

    return {
        "categoria": categoria_predicha,
        "costo_estimado_usd": costo_estimado,
        "recomendaciones": recomendaciones
    }