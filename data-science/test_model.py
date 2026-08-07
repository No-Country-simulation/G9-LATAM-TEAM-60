import joblib, pandas as pd, numpy as np

m = joblib.load(r'c:\Users\jorel\Downloads\hackaton\G9-LATAM-TEAM-60-main\G9-LATAM-TEAM-60\data-science\modelo_pipeline_forest.joblib')
mapeo = {0: 'Eficiente', 1: 'Moderado', 2: 'Ineficiente'}

tests = [
    {'region': 'Centro', 'tipo_inmueble': 'Casa', 'cantidad_equipos': 2, 'horas_alto_consumo': 1, 'uso_horario_pico': False, 'consumo_kwh': 80},
    {'region': 'Centro', 'tipo_inmueble': 'Casa', 'cantidad_equipos': 6, 'horas_alto_consumo': 4, 'uso_horario_pico': False, 'consumo_kwh': 240},
    {'region': 'Centro', 'tipo_inmueble': 'Casa', 'cantidad_equipos': 10, 'horas_alto_consumo': 6, 'uso_horario_pico': True, 'consumo_kwh': 350},
    {'region': 'Norte', 'tipo_inmueble': 'Departamento', 'cantidad_equipos': 12, 'horas_alto_consumo': 8, 'uso_horario_pico': True, 'consumo_kwh': 500},
    {'region': 'Sur', 'tipo_inmueble': 'Casa', 'cantidad_equipos': 20, 'horas_alto_consumo': 10, 'uso_horario_pico': True, 'consumo_kwh': 700},
]

for t in tests:
    df = pd.DataFrame([t])
    pred = m.predict(df)[0]
    proba = np.max(m.predict_proba(df)[0])
    cat = mapeo[pred]
    print(f"consumo={t['consumo_kwh']}kWh eq={t['cantidad_equipos']} hrs={t['horas_alto_consumo']} pico={t['uso_horario_pico']} => {cat} (prob={proba:.2f})")
