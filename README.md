# EnergiAI - Backend

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

## Equipo

Proyecto desarrollado en equipo dentro del Hackathon Oracle & Alura ONE (No Country), con un equipo de backend (Java/Spring Boot) y un equipo de Data Science (Python) trabajando en conjunto.
