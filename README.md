## 📌 Gestión del Proyecto

El desarrollo y seguimiento de tareas de este proyecto se gestiona mediante **Jira Software**.
* 📋 **Tablero del Proyecto (Jira):**
https://g9-latam-team-60-energiai.atlassian.net/jira/core/projects/GLT6/board?filter=&groupBy=none&atlOrigin=eyJpIjoiYmRlYTIzZmY5MDU1NGU0OWJhNzFlM2EyYTY5NTUzMmEiLCJwIjoiaiJ9

## Criterios y Definición del Negocio

# 📊 Justificación de las 3 Categorías Energéticas y Umbrales

## 1. Marco General y Criterio de Clasificación
La clasificación energética en **EnergiAI** no se basa únicamente en el valor absoluto del consumo eléctrico (kWh), sino en la **intensidad y eficiencia del uso de la energía** en relación con la infraestructura del inmueble y los hábitos de consumo. Se evalúa la combinación de los siguientes factores:

* **Consumo Total (kWh):** Volumetría mensual registrada en la propiedad.
* **Carga por Equipamiento (kWh / equipo):** Relación entre energía consumida y cantidad de aparatos conectados.
* **Horas de Alto Consumo:** Continuidad de uso intensivo de aparatos de alta demanda.
* **Uso en Horario Pico:** Coincidencia con las horas de mayor saturación de la red eléctrica (18:00 - 22:00 hrs).

---

## 2. Definición y Umbrales por Categoría

### 🟢 Categoría: Eficiente
* **Definición:** Inmuebles que optimizan el recurso eléctrico. Mantienen un bajo tiempo de uso intensivo y evitan congestionar la red en horas punta.
* **Umbrales del Dataset:**
  * **Horas de Alto Consumo:** Principalmente entre **2 y 5 horas/día** (promedio: `3.11 hrs`).
  * **Uso en Horario Pico:** Casi nulo (**< 1%** de los casos registrados).
  * **Consumo Promedio:** `441.15 kWh/mes` (Promedio de `38.34 kWh/equipo`).
* **Criterio de Negocio:** Representa el estándar ideal de consumo responsable y bajo impacto tarifario.

### 🟡 Categoría: Moderado
* **Definición:** Inmuebles con un patrón de consumo aceptable pero con margen de mejora operacional. Presentan un uso moderado de horas pico o tiempos prolongados de demanda en equipos específicos.
* **Umbrales del Dataset:**
  * **Horas de Alto Consumo:** Concentrado entre **2 y 7 horas/día** (promedio: `5.02 hrs`).
  * **Uso en Horario Pico:** Moderado (**~ 36.8%** de los casos registrados).
  * **Consumo Promedio:** `509.10 kWh/mes` (Promedio de `39.87 kWh/equipo`).
* **Criterio de Negocio:** Hogares/comercios donde la automatización o hábitos de autorregulación pueden moverlos fácilmente a la categoría *Eficiente*.

### 🔴 Categoría: Ineficiente
* **Definición:** Inmuebles con hábitos intensivos o posibles fallas de eficiencia operacional/tecnológica (equipos antiguos, uso prolongado continuo sin regulación y concentración severa en horas punta).
* **Umbrales del Dataset:**
  * **Horas de Alto Consumo:** Uso prolongado elevado, mayoritariamente entre **6 y 12 horas/día** (promedio: `8.23 hrs`).
  * **Uso en Horario Pico:** Predominante (**> 83.7%** de los casos registrados).
  * **Consumo Promedio:** `547.68 kWh/mes` alcanzando picos de hasta `909 kWh/mes` (Promedio de `46.05 kWh/equipo`).
* **Criterio de Negocio:** Grupo prioritario para el envío de recomendaciones correctivas, alertas de consumo y sugerencias de auditoría energética.

---

## 3. Resumen de Métricas Promedio

| Categoría | Consumo Prom. (kWh) | Horas Alto Consumo (Prom.) | Coincidencia Horario Pico (%) | Intensidad (kWh / equipo) |
| :--- | :---: | :---: | :---: | :---: |
| **Eficiente** | 441.15 | 3.11 hrs | 0.8% | 38.34 |
| **Moderado** | 509.10 | 5.02 hrs | 36.8% | 39.87 |
| **Ineficiente** | 547.68 | 8.23 hrs | 83.7% | 46.05 |
