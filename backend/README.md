## Equipo

Proyecto desarrollado en equipo dentro del Hackathon Oracle & Alura ONE (No Country), con un equipo de backend (Java/Spring Boot) y un equipo de Data Science (Python) trabajando en conjunto.
## 📌 Gestión del Proyecto

El desarrollo y seguimiento de tareas de este proyecto se gestiona mediante **Jira Software**.
* 📋 **Tablero del Proyecto (Jira):**
https://g9-latam-team-60-energiai.atlassian.net/jira/core/projects/GLT6/board?filter=&groupBy=none&atlOrigin=eyJpIjoiYmRlYTIzZmY5MDU1NGU0OWJhNzFlM2EyYTY5NTUzMmEiLCJwIjoiaiJ9

para iniciar el servicio:
cd energiai-ai-service
uvicorn app.main:app --reload

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


# Backend

API REST desarrollada en Spring Boot para el proyecto **EnergiAI**, construido en el marco del Hackathon Oracle & Alura ONE (plataforma No Country). El sistema evalúa el consumo eléctrico de un usuario y genera recomendaciones de eficiencia energética, clasificando el consumo en tres categorías: `Eficiente`, `Moderado` e `Ineficiente`.

Este backend actúa como capa pública de la API: recibe las solicitudes del frontend, gestiona autenticación/usuarios, persiste los análisis, y delega el cálculo de la clasificación a un microservicio interno de Data Science (Python/FastAPI).

## Stack tecnológico

- **Java 17**
- **Spring Boot 3.3.0** (Web, Data JPA, Security, Validation)
- **PostgreSQL** + **Flyway** para migraciones
- **JWT** (java-jwt / Auth0) para autenticación stateless
- **Lombok**
- **Docker** para despliegue
- **OCI (Oracle Cloud Infrastructure)**: Compute para el despliegue, Object Storage para el modelo serializado de ML

## Arquitectura general

```
Frontend  →  Backend (Spring Boot)  →  Microservicio IA (FastAPI, interno)
                     │
                     └──  PostgreSQL (usuarios, análisis)
```

- Endpoint público: `POST /analisis-energetico`
- Endpoint interno (consumido por el backend): `POST /api/v1/predict`

## Requisitos previos

- JDK 17+
- Maven 3.9+ (o usar el wrapper `./mvnw`)
- PostgreSQL 14+
- Docker (opcional, para levantar todo containerizado)

## Configuración

1. Clonar el repositorio y ubicarse en la carpeta del backend.
2. Copiar `.env.example` a `.env` y completar los valores reales:

   ```bash
   cp .env.example .env
   ```

3. Variables de entorno principales:

   | Variable | Descripción |
      |---|---|
   | `DB_URL` | URL JDBC de conexión a PostgreSQL |
   | `DB_USERNAME` | Usuario de la base de datos |
   | `DB_PASSWORD` | Contraseña de la base de datos |
   | `JWT_SECRET` | Clave secreta para firmar los tokens JWT |
   | `AI_SERVICE_URL` | URL del microservicio de IA (Python/FastAPI) |
   | `OCI_NAMESPACE` / `OCI_BUCKET_NAME` / `OCI_REGION` | Configuración de OCI Object Storage |

## Cómo correr el proyecto

### Localmente con Maven

```bash
./mvnw spring-boot:run
```

La API queda disponible en `http://localhost:8080`.

### Con Docker

```bash
docker build -t energiai-backend .
docker run --env-file .env -p 8080:8080 energiai-backend
```

Las migraciones de base de datos se aplican automáticamente al arrancar (Flyway).

## Endpoints principales

| Método | Endpoint | Descripción | Auth |
|---|---|---|---|
| `POST` | `/users/signin` | Registro de usuario | No |
| `POST` | `/users/login` | Login, devuelve JWT | No |
| `POST` | `/analisis-energetico` | Envía datos de consumo y devuelve el análisis/clasificación | Sí (JWT) |

## Estructura del proyecto

```
src/main/java/energiai/
├── controller/     # Controladores REST
├── service/        # Lógica de negocio e integración con el servicio de IA
├── dto/            # Objetos de transferencia de datos (request/response)
├── repository/     # Repositorios JPA
├── model/          # Entidades JPA
├── infra/
│   ├── security/       # Configuración de Spring Security, filtro y manejo de JWT
│   └── authentication/ # Servicio de autenticación
├── config/         # Configuración de CORS, WebClient, etc.
└── exception/       # Manejo centralizado de excepciones
```