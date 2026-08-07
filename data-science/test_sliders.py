import joblib, pandas as pd, numpy as np

m = joblib.load(r'c:\Users\jorel\Downloads\hackaton\G9-LATAM-TEAM-60-main\G9-LATAM-TEAM-60\data-science\modelo_pipeline_forest.joblib')
mapeo = {0: 'Eficiente', 1: 'Moderado', 2: 'Ineficiente'}

test_cases = [
    (50, 1, 1, False, 'Casa', 'Centro'),
    (150, 3, 2, False, 'Casa', 'Centro'),
    (240, 6, 4, False, 'Casa', 'Centro'),
    (300, 8, 5, False, 'Casa', 'Centro'),
    (350, 10, 6, True, 'Casa', 'Centro'),
    (450, 12, 7, True, 'Casa', 'Centro'),
    (550, 15, 8, True, 'Casa', 'Centro'),
    (700, 20, 10, True, 'Casa', 'Centro'),
    (900, 25, 14, True, 'Casa', 'Centro'),
    (1000, 30, 24, True, 'Casa', 'Centro'),
]

print("=== PROBANDO PREDICCIONES DE RANDOM FOREST CON DATOS DEL SIMULADOR ===")
for c, eq, h, p, t, r in test_cases:
    df = pd.DataFrame([{
        "region": r,
        "tipo_inmueble": t,
        "cantidad_equipos": eq,
        "horas_alto_consumo": h,
        "uso_horario_pico": p,
        "consumo_kwh": c
    }])
    pred = m.predict(df)[0]
    proba = np.max(m.predict_proba(df)[0])
    print(f"Consumo={c:4d} kWh | Eq={eq:2d} | Hrs={h:2d} | Pico={str(p):5s} => {mapeo[pred]:11s} (prob={proba:.2f})")
