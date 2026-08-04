# EnergiAI — Documentación Técnica Completa
## Versión 1.0.0-SNAPSHOT | Julio 2026 | G9 LATAM TEAM 60

---

## PORTADA

| Campo | Valor |
|---|---|
| **Nombre del Proyecto** | EnergiAI - Plataforma Inteligente de Análisis de Eficiencia Energética |
| **Versión** | 1.0.0-SNAPSHOT (MVP Hackathon) |
| **Fecha** | Julio 2026 |
| **Autores** | G9 LATAM TEAM 60 - No Country Simulation |
| **Repositorio** | https://github.com/No-Country-simulation/G9-LATAM-TEAM-60 |
| **Gestión de Tareas** | Jira Software - https://g9-latam-team-60-energiai.atlassian.net |
| **Estado** | MVP Funcional - En Producción (Hackathon) |
| **Licencia** | MIT |

---

## STACK TECNOLÓGICO

| Capa | Tecnología |
|---|---|
| Backend | Java 17, Spring Boot 3.3.0, Spring Security, Flyway, JWT Auth0 java-jwt 4.4.0 |
| Base de Datos | H2 (desarrollo), PostgreSQL (producción OCI) |
| ORM/Persistencia | Spring Data JPA, Hibernate, Lombok |
| Frontend | React 19, TypeScript 6, Vite 8, Recharts, Lucide React |
| Machine Learning | Python, Scikit-learn, Pandas, NumPy, FastAPI, Uvicorn, Joblib |
| Infraestructura | Oracle Cloud Infrastructure (OCI), Docker |
| Control de Versiones | Git, GitHub |
| Gestión de Proyecto | Jira Software |

---

## RESUMEN EJECUTIVO

EnergiAI es una plataforma SaaS empresarial de análisis de eficiencia energética desarrollada como MVP funcional para el Hackathon G9 LATAM 2026 organizado por No Country Simulation. La solución implementa una arquitectura de tres capas:

1. **Frontend SPA** en React/TypeScript con diseño Premium "Dark SaaS".
2. **Backend REST** en Java Spring Boot con autenticación JWT y persistencia en base de datos relacional.
3. **Microservicio de Machine Learning** en Python (FastAPI + Scikit-learn) que clasifica perfiles de consumo energético en categorías Eficiente / Moderado / Ineficiente.

La plataforma recibe datos de consumo eléctrico de hogares y pequeños establecimientos, los analiza mediante un modelo de Random Forest entrenado con un dataset propio generado por el equipo, y devuelve clasificación, probabilidad de confianza, estimación financiera basada en la tarifa de referencia de R$ 0,75/kWh y recomendaciones personalizadas de ahorro. El sistema integra Oracle Cloud Infrastructure (OCI) como plataforma de despliegue y dispone de un mecanismo de resiliencia que mantiene el servicio operativo aun cuando el microservicio ML no está disponible.

---

## TABLA DE CONTENIDOS

1. Introducción
2. Descripción General
3. Alcance
4. Requerimientos Funcionales (RF-01 a RF-20)
5. Requerimientos No Funcionales
6. Reglas de Negocio (RN-01 a RN-18)
7. Arquitectura General
8. Diagrama General de Arquitectura (Mermaid)
9. Arquitectura del Backend
10. Diagrama de Clases del Backend (Mermaid)
11. Arquitectura del Frontend
12. Diagrama del Frontend (Mermaid)
13. Arquitectura de Machine Learning
14. Flujo del Modelo de IA (Mermaid)
15. Modelo de Datos
16. Diagrama Entidad-Relación (Mermaid)
17. Modelo Relacional (SQL)
18. API REST - Documentación Completa
19. Seguridad
20. Flujo de Autenticación (Mermaid)
21. Casos de Uso
22. Diagrama de Casos de Uso (PlantUML)
23. Diagramas de Secuencia (Mermaid)
24. Diagramas de Actividad (Mermaid)
25. Flujo Completo del Sistema (Mermaid)
26. Diseño UI/UX
27. Oracle Cloud Infrastructure
28. Instalación y Configuración
29. Estructura del Proyecto
30. Dependencias
31. Estrategia de Pruebas
32. Riesgos
33. Roadmap
34. Conclusiones

---

## 1. INTRODUCCIÓN

### 1.1 Descripción del Proyecto

EnergiAI es una solución inteligente de análisis de consumo energético residencial y comercial, diseñada para transformar datos brutos de consumo eléctrico en información accionable que guíe a los usuarios hacia hábitos más eficientes y sostenibles. La plataforma clasifica el perfil energético de un inmueble y genera recomendaciones personalizadas, estimaciones financieras y un historial analítico persistente.

### 1.2 Contexto

El Hackathon G9 LATAM 2026 convocó a equipos de la región latinoamericana a desarrollar soluciones basadas en Ciencia de Datos, integrando al menos un servicio de Oracle Cloud Infrastructure. El equipo G9-LATAM-TEAM-60 respondió al desafío con EnergiAI, construyendo un MVP funcional de extremo a extremo que abarca Data Science, API REST, Frontend SaaS e integración OCI.

### 1.3 Problemática

La mayoría de los hogares y pequeños establecimientos en Latinoamérica reciben facturas de electricidad mensuales sin ningún análisis sobre qué hábitos generan el mayor gasto. No disponen de herramientas accesibles que les permitan:

- Comprender su perfil de consumo energético.
- Identificar fuentes de desperdicio.
- Recibir recomendaciones contextualizadas a su tipo de inmueble, región y hábitos.
- Estimar el costo financiero asociado a su patrón de consumo.
- Registrar y comparar análisis a lo largo del tiempo.

### 1.4 Objetivos

**Objetivo General:** Desarrollar un MVP funcional de una plataforma SaaS de inteligencia energética que clasifique perfiles de consumo, genere recomendaciones de ahorro y estime costos financieros.

**Objetivos Específicos:**
- Implementar un modelo de Machine Learning supervisado que clasifique perfiles en Eficiente / Moderado / Ineficiente.
- Desarrollar una API REST documentada en Java/Spring Boot con autenticación JWT.
- Construir un frontend premium en React/TypeScript con soporte de modo oscuro/claro.
- Persistir el historial de análisis por usuario en base de datos relacional.
- Integrar servicios de Oracle Cloud Infrastructure (OCI).
- Implementar un mecanismo de resiliencia que garantice disponibilidad ante fallos del microservicio ML.

### 1.5 Justificación

El mercado de eficiencia energética crece sostenidamente en LATAM impulsado por el aumento de tarifas eléctricas, la presión regulatoria ambiental y la conciencia de sostenibilidad. Empresas, gobiernos y consumidores domésticos buscan herramientas que les permitan reducir costos operativos, mejorar indicadores de sostenibilidad e incentivar el consumo consciente. EnergiAI responde directamente a esta necesidad con una solución tecnológicamente moderna, accesible y escalable.

### 1.6 Valor Agregado y Beneficios

- **Análisis en tiempo real** mediante Machine Learning (Scikit-learn Random Forest).
- **Resiliencia operativa**: la plataforma funciona incluso si el microservicio ML falla, aplicando lógica de negocio de respaldo.
- **Modo Guest**: los usuarios pueden ejecutar análisis sin necesidad de registro.
- **Historial persistente**: los análisis de usuarios autenticados se almacenan y son consultables.
- **Dashboard analítico**: KPIs, gráficos de distribución de categorías y registros recientes.
- **Estimación financiera**: cálculo automático de costo mensual usando tarifa de referencia R$ 0,75/kWh.
- **Recomendaciones contextualizadas** por región geográfica, tipo de inmueble y patrón de uso.
- **Diseño premium SaaS** con soporte de modo oscuro/claro y diseño responsivo.

---

## 2. DESCRIPCIÓN GENERAL

### 2.1 Descripción Funcional

EnergiAI permite a los usuarios ingresar parámetros de su consumo eléctrico mensual a través de un formulario interactivo (sliders y selección de tipo de inmueble y región). Estos datos se envían al backend de Spring Boot, que los reenvía al microservicio de Machine Learning (FastAPI/Python). El modelo clasifica el perfil energético, calcula el costo estimado y genera recomendaciones. La respuesta se devuelve al usuario en formato JSON y se persiste en la base de datos para usuarios autenticados.

### 2.2 Objetivos del Negocio

| Objetivo | KPI |
|---|---|
| Aumentar la conciencia de consumo | Análisis ejecutados por mes |
| Reducir el desperdicio energético | % de usuarios que pasan de Ineficiente a Moderado |
| Proveer información financiera | Costo estimado mensual por análisis |
| Capturar y retener usuarios | Tasa de registro vs. usuarios guest |

### 2.3 Público Objetivo

- **Usuarios domésticos** que desean entender y reducir su factura eléctrica.
- **Pequeños y medianos negocios** con consumo no industrial.
- **Auditores y consultores** de eficiencia energética que requieren una herramienta rápida de diagnóstico.
- **Organismos gubernamentales** interesados en métricas agregadas de eficiencia energética.

### 2.4 Stakeholders

| Rol | Responsabilidad |
|---|---|
| Equipo G9-LATAM-TEAM-60 | Diseño, desarrollo y despliegue completo |
| No Country Simulation | Organización del Hackathon y evaluación |
| Usuarios finales | Consumidores de la solución |
| Oracle (OCI) | Proveedor de infraestructura cloud |

---

## 3. ALCANCE

### 3.1 Qué Incluye el Proyecto

| Componente | Estado |
|---|---|
| API REST con endpoints de análisis, historial y dashboard | ✅ Implementado |
| Microservicio ML con FastAPI para clasificación | ✅ Implementado |
| Modelo Random Forest entrenado y serializado (model.joblib) | ✅ Implementado |
| Lógica de resiliencia en backend ante fallo ML | ✅ Implementado |
| Autenticación JWT con roles USER y ADMIN | ✅ Implementado |
| Registro de nuevos usuarios | ✅ Implementado |
| Persistencia del historial en base de datos (H2/PostgreSQL) | ✅ Implementado |
| Migraciones de base de datos con Flyway | ✅ Implementado |
| Frontend React con Landing Page, Simulador, Dashboard, Historial | ✅ Implementado |
| Modo Guest (análisis sin autenticación) | ✅ Implementado |
| Modo Demo con credenciales precargadas | ✅ Implementado |
| Modo oscuro / modo claro con persistencia en localStorage | ✅ Implementado |
| Diseño responsivo (mobile-first) | ✅ Implementado |
| Estimación financiera (R$ 0,75/kWh) | ✅ Implementado |
| Dockerfile del backend | ✅ Creado (vacío - pendiente de contenido) |
| Datos de ejemplo en la base de datos (V3) | ✅ Implementado |
| Dataset propio de entrenamiento | ✅ Implementado |

### 3.2 Pendiente de Implementación

| Funcionalidad | Estado |
|---|---|
| Procesamiento por lotes (CSV upload) | ⏳ Pendiente de Implementación |
| Alertas automáticas de alto consumo | ⏳ Pendiente de Implementación |
| Comparación entre períodos históricos | ⏳ Pendiente de Implementación |
| Ranking de eficiencia energética | ⏳ Pendiente de Implementación |
| Simulación de escenarios de ahorro | ⏳ Pendiente de Implementación |
| Recuperación real de contraseña por email | ⏳ Pendiente de Implementación |
| Integración con medidores inteligentes (IoT) | Fuera de alcance |
| Facturación / Suscripciones SaaS | Fuera de alcance |
| Aplicación móvil nativa | Fuera de alcance |

### 3.3 Limitaciones

- El modelo ML fue entrenado con un dataset sintético generado por el equipo; la precisión en datos de producción real puede variar.
- La tarifa de R$ 0,75/kWh es una tarifa de referencia estandarizada para comparabilidad entre equipos del hackathon.
- El Dockerfile del backend se encuentra vacío y requiere completarse para producción.
- El módulo de Configuración del frontend tiene los campos de tarifa y entorno en modo de solo lectura.

### 3.4 Supuestos

- El microservicio ML (FastAPI) corre en el puerto 8000 del mismo host o en una IP configurada vía variable de entorno `ML_SERVICE_URL`.
- El backend Spring Boot corre en el puerto 8080.
- El frontend Vite corre en modo desarrollo en el puerto 5173.
- La variable de entorno `JWT_SECRET` debe configurarse en producción.

---

## 4. REQUERIMIENTOS FUNCIONALES

| ID | Nombre | Descripción | Prioridad | Estado | Módulo | Actor | Criterios de Aceptación |
|---|---|---|---|---|---|---|---|
| RF-01 | Registro de Usuario | El sistema debe permitir crear una nueva cuenta con nombre completo, email y contraseña. La contraseña se almacena cifrada con BCrypt. | Alta | ✅ Implementado | Auth | Usuario Anónimo | Devuelve HTTP 201; rechaza con 400 si el username ya existe. |
| RF-02 | Inicio de Sesión | El sistema debe autenticar al usuario con username y password, devolviendo un token JWT con validez de 30 días. | Alta | ✅ Implementado | Auth | Usuario Registrado | Devuelve HTTP 200 con jwtToken, username, nombreCompleto y role. |
| RF-03 | Análisis Energético | El sistema debe recibir parámetros de consumo y devolver clasificación, probabilidad, costo y recomendaciones. | Alta | ✅ Implementado | Análisis | Anónimo/Registrado | Devuelve HTTP 200 con AnalisisEnergeticoResponse. |
| RF-04 | Clasificación por Categorías | El sistema debe clasificar el consumo en tres categorías: Eficiente, Moderado, Ineficiente. | Alta | ✅ Implementado | ML | Sistema | La categoría devuelta es una de las tres definidas. |
| RF-05 | Probabilidad de Confianza | El sistema debe devolver la probabilidad del modelo de clasificación. | Alta | ✅ Implementado | ML | Sistema | El campo probabilidad contiene un valor entre 0 y 1. |
| RF-06 | Estimación Financiera | El sistema debe calcular el costo mensual estimado usando la tarifa de R$ 0,75/kWh. | Alta | ✅ Implementado | Análisis | Sistema | costo_estimado_mensual = consumo_kwh × 0,75. |
| RF-07 | Recomendaciones Personalizadas | El sistema debe generar recomendaciones contextualizadas por región, tipo de inmueble, horario pico y categoría asignada. | Alta | ✅ Implementado | ML | Sistema | La respuesta contiene al menos una recomendación pertinente. |
| RF-08 | Persistencia del Análisis | Cuando el usuario está autenticado, el análisis se guarda en la base de datos asociado a su cuenta. | Alta | ✅ Implementado | Análisis/DB | Sistema | El análisis aparece en el historial del usuario tras ser ejecutado. |
| RF-09 | Consulta de Historial | El usuario autenticado puede consultar todos sus análisis previos ordenados por fecha descendente. | Alta | ✅ Implementado | Historial | Usuario Registrado | Devuelve lista de AnalisisEnergeticoResponse ordenada de más reciente a más antiguo. |
| RF-10 | Consulta por ID | El sistema permite recuperar un análisis específico por su ID. | Media | ✅ Implementado | Análisis | Usuario Registrado | Devuelve HTTP 200 con el análisis o HTTP 404 si no existe. |
| RF-11 | Dashboard Analítico | El sistema debe proveer estadísticas agregadas: total de consultas, consumo promedio, costo total y distribución de categorías. | Alta | ✅ Implementado | Dashboard | Usuario Registrado | Devuelve DashboardStatsDTO con todos los campos calculados. |
| RF-12 | Análisis Recientes en Dashboard | El dashboard debe mostrar los 5 análisis más recientes del sistema. | Media | ✅ Implementado | Dashboard | Usuario Registrado | La lista analisisRecientes contiene hasta 5 registros. |
| RF-13 | Modo Guest | Usuarios no registrados pueden ejecutar análisis sin autenticación. El análisis no se persiste. | Alta | ✅ Implementado | Frontend | Usuario Anónimo | El análisis se ejecuta y muestra resultados sin requerir login. |
| RF-14 | Acceso Demo | La plataforma debe ofrecer acceso inmediato con usuarios demo preinstalados. | Alta | ✅ Implementado | Auth | Evaluador | El botón "Usuario Demo" autentica con credenciales preconfiguradas. |
| RF-15 | Modo Oscuro / Claro | El sistema debe permitir alternar entre tema claro y oscuro, persistiendo la preferencia en localStorage. | Media | ✅ Implementado | Frontend | Cualquier Usuario | Al cambiar el tema, data-theme del html se actualiza y persiste entre sesiones. |
| RF-16 | Resiliencia Ante Fallo ML | Si el microservicio ML no está disponible, el backend aplica lógica de reglas para generar la respuesta. | Alta | ✅ Implementado | Backend | Sistema | El endpoint /api/analisis-energetico responde HTTP 200 aunque el servicio ML esté caído. |
| RF-17 | Obtener Usuario Actual | El sistema debe devolver los datos del usuario autenticado a partir de su token JWT. | Media | ✅ Implementado | Auth | Usuario Registrado | Devuelve HTTP 200 con id, username, nombreCompleto y role. |
| RF-18 | Health Check de la API | El sistema expone un endpoint de verificación de disponibilidad. | Media | ✅ Implementado | API | Sistema/DevOps | Devuelve HTTP 200 con texto "Backend OK". |
| RF-19 | Secciones Protegidas | El Dashboard, Historial, Recomendaciones y Configuración solo son accesibles para usuarios autenticados. | Media | ✅ Implementado | Frontend | Sistema | Al intentar acceder sin sesión, se muestra un toast y se abre el modal de login. |
| RF-20 | Resiliencia Frontend Offline Mode | Si el backend no está disponible, el frontend ejecuta lógica de clasificación localmente. | Media | ✅ Implementado | Frontend | Sistema | La aplicación funciona en modo offline con datos de prueba. |
| RF-21 | Multi-moneda LATAM | El sistema permite seleccionar el tipo de divisa en tiempo real entre Chile (CLP), Argentina (ARS), Brasil (BRL) y Estados Unidos (USD). | Alta | ✅ Implementado | Frontend/Utils | Cualquier Usuario | Modifica los símbolos e importes financieros aplicando factores de conversión estandarizados. |
| RF-22 | Exportación de Comprobantes PDF | Generación de comprobante oficial en formato PDF con resumen de parámetros evaluados (kWh, Tipo de Inmueble, Equipos, Horario Pico, Región Geográfica). | Alta | ✅ Implementado | Frontend/PDF | Usuario Registrado/Invitado | Descarga archivo PDF con formato institucional sin omitir ningún parámetro evaluado. |
| RF-23 | Dashboard Ejecutivo de Impacto | El dashboard provee indicadores avanzados de Ahorro Potencial Proyectado, Score Energético (0-100 pts), Huella de Carbono (kg CO₂) y equivalencia en Árboles. | Alta | ✅ Implementado | Dashboard | Usuario Registrado | Muestra tarjetas KPI calculadas a partir del consumo promedio e historial del usuario. |
| RF-24 | Aislamiento de Historial por Usuario | Las auditorías y métricas KPI se filtran estrictamente por la cuenta del usuario autenticado vía JWT. | Alta | ✅ Implementado | Backend/Security | Usuario Registrado | Garantiza privacidad total; ningún usuario puede ver historiales ni estadísticas de terceros. |

---

## 5. REQUERIMIENTOS NO FUNCIONALES

### 5.1 Rendimiento

| RNF | Descripción | Meta |
|---|---|---|
| RNF-P01 | El endpoint de análisis debe responder en condiciones normales | < 2 segundos |
| RNF-P02 | El microservicio ML debe inferir por solicitud | < 500 ms |
| RNF-P03 | El frontend debe cargar en conexión 4G estándar | < 3 segundos |
| RNF-P04 | La base de datos debe responder consultas de historial | < 200 ms |

### 5.2 Escalabilidad

- El microservicio ML puede escalar horizontalmente sin estado compartido (el modelo se carga en memoria al inicio).
- La arquitectura de microservicios permite escalar el servicio de ML independientemente del backend Java.
- Spring Boot es stateless gracias a JWT, permitiendo múltiples instancias sin sesiones compartidas.

### 5.3 Seguridad

- Contraseñas almacenadas con BCrypt (factor de costo 12).
- Tokens JWT firmados con HMAC256 y expiración de 30 días.
- CORS configurado explícitamente en Spring Security y en el módulo CorsConfig.
- CSRF deshabilitado (API REST stateless, no cookies de sesión).
- Sesiones STATELESS — no se almacenan sesiones en el servidor.
- Rutas públicas mínimas: `/api/auth/**`, `/users/login`, `/users/signin`, `/api/health` y `/api/dashboard`.

### 5.4 Disponibilidad

- El sistema diseñado para alta disponibilidad gracias al mecanismo de resiliencia.
- Meta: disponibilidad >= 99% del tiempo de uptime (excluyendo mantenimiento planificado).

### 5.5 Accesibilidad

- Diseño con alto contraste de colores (relación de contraste >= 4.5:1 en modo oscuro y modo claro).
- Todos los formularios usan etiquetas `<label>` explícitas.
- Botones con texto descriptivo y sin dependencia exclusiva de color.

### 5.6 Mantenibilidad

- Código Java organizado en capas limpias (Controller, Service, Repository, Entity, DTO, Infra).
- Uso de Lombok para reducir boilerplate y mejorar legibilidad.
- Migraciones de base de datos versionadas con Flyway.
- Variables de entorno para toda configuración sensible (`JWT_SECRET`, `DB_URL`, `ML_SERVICE_URL`).
- Frontend tipado con TypeScript, reduciendo errores en tiempo de compilación.

### 5.7 Usabilidad

- Modo Guest permite explorar la plataforma sin registro.
- Acceso Demo con un clic para evaluadores del hackathon.
- Sliders intuitivos para los parámetros de consumo con valores en tiempo real.
- Toast notifications para retroalimentación inmediata al usuario.
- Skeleton loading en el Dashboard para mejorar la percepción de velocidad.

### 5.8 Portabilidad

- El backend se puede empaquetar en un JAR auto-ejecutable con `mvn package`.
- Dockerfile disponible para contenerización (pendiente de completar el contenido).
- El frontend genera un bundle estático con `npm run build`.

### 5.9 Compatibilidad

- Backend: Java 17 LTS. Compatible con JDK 17+.
- Frontend: Compatible con los 2 últimos major releases de Chrome, Firefox, Safari y Edge.
- Base de datos: H2 en modo PostgreSQL para desarrollo; PostgreSQL para producción OCI.

### 5.10 Internacionalización

- La interfaz está completamente en español latino, alineada al contexto del hackathon LATAM.
- Las monedas se expresan en R$ (Real Brasileño) como tarifa de referencia estandarizada.
- Los textos del frontend son estáticos en español (i18n no implementado en esta versión).

### 5.11 Tiempo de Respuesta

| Acción | Tiempo Esperado |
|---|---|
| Carga inicial del frontend | < 3 s |
| Login | < 1 s |
| Análisis energético (con ML) | < 2 s |
| Análisis energético (lógica resiliente) | < 300 ms |
| Carga del Dashboard | < 1 s |
| Carga del Historial | < 800 ms |

### 5.12 Responsive Design

| Breakpoint | Comportamiento |
|---|---|
| > 1024 px | Layout completo con sidebar expandido |
| 768–1024 px | Grid adaptativo, sidebar colapsable |
| 480–768 px | Columna simple, menú desktop oculto, cards apiladas |
| < 480 px | Botones 100% ancho, texto hero reducido |

---

## 6. REGLAS DE NEGOCIO

| ID | Regla | Descripción | Origen |
|---|---|---|---|
| RN-01 | Tarifa de referencia única | El costo mensual se calcula siempre con `consumo_kwh × 0,75 (R$)`. Esta tarifa es inmutable en la versión MVP. | Contexto del Hackathon |
| RN-02 | Clasificación Eficiente | Un inmueble se clasifica como Eficiente cuando el modelo ML lo determina, o cuando `consumo_kwh <= 200` (lógica resiliente). | AiClientService.generarRespuestaResiliente() |
| RN-03 | Clasificación Moderado | Se clasifica como Moderado cuando `consumo_kwh > 200` y `consumo_kwh <= 400` Y `horas_alto_consumo <= 7` (lógica resiliente). | AiClientService.generarRespuestaResiliente() |
| RN-04 | Clasificación Ineficiente | Se clasifica como Ineficiente cuando `consumo_kwh > 400` O `horas_alto_consumo > 7` (lógica resiliente). | AiClientService.generarRespuestaResiliente() |
| RN-05 | Probabilidades de confianza de respaldo | Eficiente = 0.93, Moderado = 0.82, Ineficiente = 0.88 (valores fijos en modo resiliente). | AiClientService.generarRespuestaResiliente() |
| RN-06 | Identificador único de análisis | Cada análisis genera un identificador del formato `IA-XXXXXXXX` (prefijo + 8 caracteres UUID hexadecimal en mayúscula). | AiClientService, inference_api.py |
| RN-07 | Región por defecto | Si no se especifica región, se asigna "Centro" por defecto. | AiClientService, inference_api.py |
| RN-08 | Tipo de inmueble por defecto | Si no se especifica tipo_inmueble, se asigna "Casa" por defecto. | AiClientService |
| RN-09 | Recomendación por horario pico | Si `uso_horario_pico = true`, se genera recomendación de desplazamiento horario. | inference_api.py |
| RN-10 | Recomendación por cantidad de equipos | Si `cantidad_equipos > 15`, se recomienda auditoría de eficiencia. | inference_api.py |
| RN-11 | Recomendación por región y consumo | Si región = "Norte" y `consumo_kwh > 350`: recomendación sobre climatización. Si región = "Sur" y `consumo_kwh > 350`: recomendación sobre calefacción. | inference_api.py |
| RN-12 | Persistencia condicionada por autenticación | Solo se persisten análisis en la base de datos cuando el usuario está autenticado. | AiClientService.obtenerAnalisis() |
| RN-13 | Contraseña con BCrypt | Las contraseñas se almacenan con BCryptPasswordEncoder. | SecurityConfiguration |
| RN-14 | Expiración del JWT | Los tokens JWT expiran 30 días después de su emisión (zona horaria UTC-3). | TokenService.ExpiryDate() |
| RN-15 | Rol por defecto al registrar | Todo nuevo usuario registrado recibe el rol "USER" automáticamente. | AuthController.registerUser() |
| RN-16 | Horario pico definido | El horario de alta demanda de red es de 18:00 a 22:00 horas. | Frontend + ML |
| RN-17 | Acceso a secciones protegidas | Dashboard, Historial, Recomendaciones y Configuración son accesibles únicamente para usuarios con token JWT válido. | App.tsx, SecurityConfiguration |
| RN-18 | Consumo reconstruido en Dashboard | En el Dashboard, el `consumoKwh` se reconstruye a partir del costo usando la fórmula inversa: `costo / 0.75`. | DashboardController |

---

## 7. ARQUITECTURA GENERAL

### 7.1 Visión de la Arquitectura

EnergiAI implementa una arquitectura de **microservicios con tres componentes principales** que se comunican mediante HTTP:

1. **Frontend SPA** (React + TypeScript + Vite): Interfaz de usuario responsiva con modo oscuro/claro, consumo de la API REST vía Fetch API.
2. **Backend REST** (Java + Spring Boot 3): Orquestador principal; maneja autenticación JWT, validación de datos, comunicación con el ML, persistencia y cálculos de Dashboard.
3. **Microservicio ML** (Python + FastAPI + Scikit-learn): Servicio de inferencia que carga el modelo serializado y devuelve clasificación, probabilidad y recomendaciones.

### 7.2 Backend (Java / Spring Boot)

- **Framework**: Spring Boot 3.3.0 con Java 17.
- **Patrón**: MVC en capas (Controller → Service → Repository → Entity).
- **Autenticación**: Spring Security + JWT (Auth0 java-jwt 4.4.0).
- **Persistencia**: Spring Data JPA + Hibernate. Migraciones con Flyway.
- **Base de datos**: H2 (modo PostgreSQL) en desarrollo, PostgreSQL en producción.
- **Comunicación ML**: `RestTemplate` para llamadas HTTP síncronas al microservicio Python.
- **Resiliencia**: Bloque try/catch con lógica de reglas de negocio como fallback.

### 7.3 Frontend (React / TypeScript)

- **Framework**: React 19 con TypeScript 6.
- **Build Tool**: Vite 8.
- **Gráficos**: Recharts 3.
- **Íconos**: Lucide React.
- **Estado global**: React Context API (AuthContext, ThemeContext, ToastContext).
- **Comunicación API**: Fetch API nativa encapsulada en `apiService`.
- **Persistencia local**: localStorage para JWT y preferencia de tema.

### 7.4 Machine Learning (Python / Scikit-learn)

- **Framework de servicio**: FastAPI + Uvicorn (puerto 8000).
- **Entrenamiento**: Scikit-learn Pipeline con `ColumnTransformer` + `RandomForestClassifier`.
- **Serialización**: Joblib (`model.joblib`).
- **Variables de entrada**: `consumo_kwh`, `uso_horario_pico`, `cantidad_equipos`, `tipo_inmueble`, `horas_alto_consumo`, `region`.
- **Variable objetivo**: `categoria` (Eficiente / Moderado / Ineficiente).
- **Dataset**: `dataset_consumo_energia_G9_T60_opcion2.csv` (dataset propio).

### 7.5 Base de Datos

Tres migraciones Flyway:
- **V1**: Creación de tabla `users` con datos de admin y demo precargados.
- **V2**: Creación de tablas `analisis_energetico` y `analisis_recomendaciones`.
- **V3**: Inserción de 4 análisis de muestra.

Relaciones:
- `analisis_energetico.user_id` → `users.id` (FK opcional, `ON DELETE SET NULL`)
- `analisis_recomendaciones.analisis_id` → `analisis_energetico.id` (FK con `ON DELETE CASCADE`)

### 7.6 Servicios Externos

| Servicio | Tipo | Propósito |
|---|---|---|
| Google Fonts API | CDN externo | Fuentes Inter y JetBrains Mono |
| OCI Object Storage | Cloud | Almacenamiento de artefactos ML |
| OCI Compute | Cloud | Hosting del backend y ML |
| GitHub | SaaS | Control de versiones |
| Jira Software | SaaS | Gestión de proyecto |

---

## 8. DIAGRAMA GENERAL DE ARQUITECTURA

```mermaid
graph TB
    subgraph "Cliente Browser"
        FE["Frontend SPA\nReact 19 + TypeScript\nVite 8 Puerto 5173"]
    end

    subgraph "OCI Compute Backend Layer"
        BE["Spring Boot 3.3\nAPI REST Puerto 8080\nJava 17 + Spring Security + JWT + Flyway"]
        ML["FastAPI Microservice\nScikit-learn Inference\nPuerto 8000"]
    end

    subgraph "Persistencia"
        DB[("H2 / PostgreSQL\nanalisis_energetico\nanalisis_recomendaciones\nusers")]
    end

    subgraph "OCI Services"
        OBJ["OCI Object Storage\nmodel.joblib\ndatasets CSV"]
    end

    FE -- "HTTP REST Bearer JWT" --> BE
    BE -- "RestTemplate POST /predict" --> ML
    ML -- "joblib.load" --> OBJ
    BE -- "Spring Data JPA Hibernate" --> DB
```

---

## 9. ARQUITECTURA DEL BACKEND

### 9.1 Estructura de Paquetes

```
energiai/
├── EnergiaaiApplication.java
├── controller/
│   ├── AnalisisController.java      (Endpoints de análisis e historial)
│   ├── AuthController.java          (Registro, login, /me)
│   ├── DashboardController.java     (Estadísticas agregadas)
│   └── UserController.java          (CRUD de usuarios - legacy)
├── service/
│   ├── AiClientService.java         (Lógica principal: ML + resiliencia + persistencia)
│   └── UsuarioService.java
├── repository/
│   ├── AnalisisRepository.java
│   └── UserRepository.java
├── model/
│   ├── Analisis.java                (Entidad JPA de análisis energético)
│   └── Users.java                   (Entidad JPA de usuario + UserDetails)
├── dto/
│   ├── AnalisisEnergeticoRequest.java
│   ├── AnalisisEnergeticoResponse.java
│   ├── CreateUserDataDTO.java
│   ├── CreateUserReturnDTO.java
│   ├── DashboardStatsDTO.java
│   ├── ErrorResponseDTO.java
│   ├── LogInDTO.java
│   └── TokenJWTDataDTO.java
├── config/
│   ├── CorsConfig.java
│   └── WebClientConfig.java
├── infra/
│   ├── authentication/
│   │   └── AuthenticationService.java
│   └── security/
│       ├── SecurityConfiguration.java
│       ├── SecurityFilter.java
│       └── TokenService.java
└── exception/
    ├── GlobalExceptionHandler.java
    └── ResourceNotFoundException.java
```

### 9.2 Controllers

| Controller | Ruta Base | Responsabilidad |
|---|---|---|
| AnalisisController | /api | Recibe requests de análisis, delega en AiClientService, devuelve historial por ID y global |
| AuthController | /api/auth | Registro, login JWT y consulta del usuario actual (/me) |
| DashboardController | /api/dashboard | Calcula y devuelve estadísticas agregadas del sistema |
| UserController | /users | Endpoints legacy de creación y listado de usuarios + login alternativo |

### 9.3 AiClientService (Servicio Principal)

1. Recibe `AnalisisEnergeticoRequest` y `username` (nullable).
2. Construye un `HttpEntity` y llama al microservicio ML via `RestTemplate.postForEntity()`.
3. Si la llamada tiene éxito, mapea la respuesta del ML al DTO de respuesta.
4. Si hay cualquier excepción (timeout, conexión rechazada, etc.), invoca `generarRespuestaResiliente()`.
5. Persiste el resultado en la base de datos asociando el análisis al usuario si está autenticado.
6. Expone métodos: `obtenerHistorialUsuario(username)`, `obtenerHistorialGlobal()`, `obtenerPorId(id)`.

### 9.4 Repositories

| Repository | Entidad | Métodos Personalizados |
|---|---|---|
| AnalisisRepository | Analisis | findByUserIdOrderByFechaCreacionDesc(Long), findAllByOrderByFechaCreacionDesc() |
| UserRepository | Users | findByUsername(String) |

### 9.5 Entities

**`Users`**: Implementa `UserDetails` de Spring Security. Campos: `id`, `nombreCompleto`, `username`, `password`, `role`. Método `getAuthorities()` devuelve `ROLE_{role}`.

**`Analisis`**: Entidad principal del análisis energético. Relación `@ManyToOne(LAZY)` a `Users`. Colección `@ElementCollection(EAGER)` de `recomendaciones` mapeada a tabla `analisis_recomendaciones`.

### 9.6 DTOs

| DTO | Dirección | Campos |
|---|---|---|
| AnalisisEnergeticoRequest | Request entrada | region, consumo_kwh, uso_horario_pico, cantidad_equipos, tipo_inmueble, horas_alto_consumo |
| AnalisisEnergeticoResponse | Response salida | id, identificador, categoria, probabilidad, costo_estimado_mensual, recomendaciones, fecha |
| CreateUserDataDTO | Request | nombreCompleto, username, password |
| CreateUserReturnDTO | Response | nombreCompleto, username |
| DashboardStatsDTO | Response | totalConsultas, consumoPromedioKwh, costoTotalEstimado, distribucionCategorias, analisisRecientes |
| LogInDTO | Request | username, password |
| TokenJWTDataDTO | Response | jwtToken |

### 9.7 Seguridad

- **SecurityConfiguration**: Define el SecurityFilterChain con CSRF deshabilitado, sesiones STATELESS, CORS habilitado y rutas públicas específicas.
- **SecurityFilter**: `OncePerRequestFilter` que extrae el token del header `Authorization: Bearer`, verifica la firma y carga el usuario en el SecurityContext.
- **TokenService**: Crea tokens JWT con issuer "EnergiAI", subject = username, expiración 30 días, firmados con HMAC256.
- **AuthenticationService**: Implementa `UserDetailsService`, recupera el usuario de la DB para el proceso de autenticación.

---

## 10. DIAGRAMA DE CLASES DEL BACKEND

```mermaid
classDiagram
    class AnalisisController {
        -AiClientService aiClientService
        +procesarAnalisis(request) ResponseEntity
        +obtenerHistorial() ResponseEntity
        +obtenerPorId(id) ResponseEntity
        +healthCheck() ResponseEntity
    }

    class AuthController {
        -UserRepository userRepository
        -TokenService tokenService
        -PasswordEncoder passwordEncoder
        +registerUser(dto) ResponseEntity
        +login(dto) ResponseEntity
        +getCurrentUser() ResponseEntity
    }

    class DashboardController {
        -AiClientService aiClientService
        +obtenerEstadisticas() ResponseEntity
    }

    class AiClientService {
        -RestTemplate restTemplate
        -AnalisisRepository analisisRepository
        -UserRepository userRepository
        -String mlServiceUrl
        +obtenerAnalisis(request, username) AnalisisEnergeticoResponse
        -generarRespuestaResiliente(request) AnalisisEnergeticoResponse
        +obtenerHistorialUsuario(username) List
        +obtenerHistorialGlobal() List
        +obtenerPorId(id) AnalisisEnergeticoResponse
    }

    class TokenService {
        -String secret
        +createToken(user) String
        +getSubject(token) String
    }

    class SecurityFilter {
        -TokenService tokenService
        -UserRepository userRepository
        +doFilterInternal(request, response, chain)
    }

    class Analisis {
        +Long id
        +Users user
        +String identificador
        +String region
        +double consumoKwh
        +boolean usoHorarioPico
        +int cantidadEquipos
        +String tipoInmueble
        +int horasAltoConsumo
        +String categoria
        +double probabilidad
        +double costoEstimadoMensual
        +LocalDateTime fechaCreacion
        +List recomendaciones
    }

    class Users {
        +long id
        +String nombreCompleto
        +String username
        +String password
        +String role
        +getAuthorities() Collection
    }

    AnalisisController --> AiClientService
    DashboardController --> AiClientService
    AiClientService --> Analisis
    AiClientService --> Users
    AuthController --> Users
    AuthController --> TokenService
    SecurityFilter --> TokenService
    SecurityFilter --> Users
```

---

## 11. ARQUITECTURA DEL FRONTEND

### 11.1 Estructura de Directorios

```
frontend/src/
├── App.tsx                     (Componente raíz, routing por estado, providers)
├── main.tsx                    (Entry point React DOM)
├── index.css                   (Design System completo)
├── components/
│   ├── LandingPage.tsx
│   ├── AuthModal.tsx
│   ├── Navbar.tsx
│   ├── Sidebar.tsx
│   ├── DashboardView.tsx
│   ├── SimulationForm.tsx
│   ├── HistoryView.tsx
│   ├── ResultsModal.tsx
│   └── HeroSection.tsx
├── context/
│   ├── AuthContext.tsx
│   ├── ThemeContext.tsx
│   └── ToastContext.tsx
├── services/
│   └── api.ts
└── types/
    └── index.ts
```

### 11.2 Componentes Principales

| Componente | Responsabilidad | Props Clave |
|---|---|---|
| LandingPage | Página de marketing con hero, features, CTA | onStartSimulation, onOpenAuth |
| AuthModal | Modal de autenticación con login/registro/demo | isOpen, onClose |
| Navbar | Barra de navegación superior | activeTab, onOpenAuth, onGoLanding |
| Sidebar | Menú lateral colapsable con tabs protegidos | activeTab, setActiveTab, collapsed, setCollapsed, onOpenAuth |
| DashboardView | Vista de estadísticas y gráficos | onSelectAnalisis |
| SimulationForm | Formulario de captura de datos y ejecución ML | onSimulationComplete |
| HistoryView | Tabla del historial de análisis | onSelectAnalisis |
| ResultsModal | Modal con resultado detallado del análisis | result, onClose, onReset |

### 11.3 Context (Estado Global)

| Context | Estado | Acciones |
|---|---|---|
| AuthContext | user: UserProfile o null, loading: boolean | login(), register(), loginDemo(), logout() |
| ThemeContext | theme: light o dark | toggleTheme(), setTheme() |
| ToastContext | Lista de toasts activos | showToast(message, type) |

### 11.4 Routing

EnergiAI no usa React Router. La navegación se implementa mediante **estado local en `App.tsx`**:
- `isLanding: boolean` — controla si se muestra la LandingPage o la aplicación principal.
- `activeTab: string` — controla qué vista se renderiza (dashboard, simulador, historial, recomendaciones, configuracion).

Tabs protegidos: si el usuario intenta navegar a dashboard, historial, recomendaciones o configuracion sin sesión, se muestra un toast y se abre el modal de autenticación.

### 11.5 Design System

- **Fuentes**: Inter (sans-serif para UI) + JetBrains Mono (monoespaciada para métricas numéricas).
- **Modo claro**: fondo `#f8fafc`, superficies blancas, texto `#0f172a`.
- **Modo oscuro**: fondo `#0b0f19`, superficies semi-transparentes glassmorphism, texto `#f8fafc`.
- **Acento primario**: Emerald `#10b981` (verde eco-tech).
- **Acento secundario**: Cyan `#06b6d4`.
- **Alerta warning**: Amber `#f59e0b`.
- **Alerta error**: Rose `#f43f5e`.

### 11.6 Persistencia Local

| Clave localStorage | Valor | Propósito |
|---|---|---|
| energiai_jwt | String (token JWT) | Persistencia de sesión entre recargas |
| energiai_theme | light o dark | Preferencia de tema |

---

## 12. DIAGRAMA DEL FRONTEND

```mermaid
graph TD
    subgraph "Entry Point"
        MAIN["main.tsx ReactDOM.createRoot"]
    end
    subgraph "Providers"
        TP["ThemeProvider"]
        TOAST["ToastProvider"]
        AUTH["AuthProvider"]
    end
    subgraph "Root"
        APP["App.tsx AppContent\nEstado: isLanding, activeTab"]
    end
    subgraph "Pages"
        LANDING["LandingPage"]
        DASHBOARD["DashboardView KPIs Recharts"]
        SIMULATOR["SimulationForm Sliders ML"]
        HISTORY["HistoryView Historial"]
    end
    subgraph "Shared"
        NAVBAR["Navbar"]
        SIDEBAR["Sidebar Navegacion protegida"]
        RESULTS["ResultsModal"]
        AUTHMOD["AuthModal Login Register Demo"]
    end
    subgraph "Services"
        API["apiService api.ts\nFetch + Resiliencia Offline"]
    end

    MAIN --> TP --> TOAST --> AUTH --> APP
    APP --> LANDING
    APP --> NAVBAR
    APP --> SIDEBAR
    APP --> DASHBOARD
    APP --> SIMULATOR
    APP --> HISTORY
    APP --> RESULTS
    APP --> AUTHMOD
    DASHBOARD --> API
    SIMULATOR --> API
    HISTORY --> API
    AUTHMOD --> API
```

---

## 13. ARQUITECTURA DE MACHINE LEARNING

### 13.1 Dataset

El equipo generó dos versiones de un dataset propio:
- `dataset_consumo_energia_G9_T60_opcion1.csv`
- `dataset_consumo_energia_G9_T60_opcion2.csv` (versión final utilizada)

Campos del dataset:

| Campo | Tipo | Descripción |
|---|---|---|
| consumo_kwh | Float | Consumo mensual en kWh |
| uso_horario_pico | Int (0/1) | Si usa energía en horario pico |
| cantidad_equipos | Int | Cantidad de equipos eléctricos |
| tipo_inmueble | String | Casa / Departamento |
| horas_alto_consumo | Int | Horas de alto consumo por día |
| region | String | Norte / Centro / Sur |
| categoria | String | Etiqueta objetivo: Eficiente / Moderado / Ineficiente |

### 13.2 EDA y Limpieza de Datos

1. Carga del CSV con `pd.read_csv()`.
2. Conversión de `uso_horario_pico` a tipo entero (0/1) para garantizar compatibilidad con el escalador numérico.
3. Verificación de existencia del archivo antes de la carga.
4. División estratificada train/test (80/20) con `stratify=y` para mantener proporciones de clase.

### 13.3 Feature Engineering y Preprocesador

```
ColumnTransformer:
  Columnas numéricas: [consumo_kwh, uso_horario_pico, cantidad_equipos, horas_alto_consumo]
    → StandardScaler() — estandarización Z-score
  Columnas categóricas: [tipo_inmueble, region]
    → OneHotEncoder(handle_unknown='ignore') — codificación one-hot
```

### 13.4 Modelos Evaluados

| Modelo | Configuración |
|---|---|
| Random Forest | n_estimators=100, random_state=42, class_weight='balanced' |
| Decision Tree | random_state=42, class_weight='balanced' |
| Logistic Regression | max_iter=1000, random_state=42, class_weight='balanced' |

El uso de `class_weight='balanced'` garantiza que el entrenamiento no esté sesgado hacia la clase mayoritaria.

### 13.5 Selección y Métricas

- **Métrica de selección**: F1-Score ponderado (weighted).
- **Métrica secundaria**: Accuracy.
- El mejor modelo (aquel con mayor F1-Score weighted) se serializa automáticamente.
- La precisión del modelo seleccionado (Random Forest) es de aprox. 93.4%.

### 13.6 Serialización

```python
joblib.dump(best_pipeline, model_path)  # genera model.joblib
```

El pipeline completo (preprocesador + clasificador) se serializa en un único archivo `model.joblib`.

### 13.7 Microservicio de Inferencia (FastAPI)

- **Arranque**: carga el `model.joblib` en el evento `startup`.
- **Endpoint**: `POST /predict` — recibe `AnalisisRequest`, genera `AnalisisResponse`.
- **Flujo**:
  1. Construye un `pd.DataFrame` con los datos del request.
  2. Invoca `model_pipeline.predict(df_input)` para la categoría.
  3. Invoca `model_pipeline.predict_proba(df_input)` para la probabilidad máxima.
  4. Calcula el costo: `consumo_kwh × 0.75`.
  5. Invoca `generar_recomendaciones()` con el request y la categoría.
  6. Devuelve el objeto `AnalisisResponse` completo.
- **Endpoint de salud**: `GET /health` devuelve `{status, model_loaded}`.

### 13.8 Motor de Recomendaciones (Reglas Determinísticas)

| Condición | Recomendación Generada |
|---|---|
| uso_horario_pico = true | Desplazar electrodomésticos fuera de 18:00-22:00 |
| horas_alto_consumo >= 7 | Distribuir la demanda y usar temporizadores |
| cantidad_equipos > 15 | Auditoría de eficiencia energética |
| region = Norte AND consumo > 350 | Optimizar climatización (A/C a 24°C) |
| region = Sur AND consumo > 350 | Termostatos programables + calefacción pasiva |
| categoria = Ineficiente | Alerta crítica: equipos fantasma + revisar instalación |
| categoria = Moderado sin otras recs | Apagar luces innecesarias + migrar a LED |
| categoria = Eficiente | Felicitación + continuar buenos hábitos |

---

## 14. FLUJO DEL MODELO DE IA

```mermaid
flowchart TD
    A["Inicio: Usuario ingresa datos"] --> B["Recibe AnalisisRequest"]
    B --> C{"model.joblib cargado?"}
    C -- No --> D["HTTP 503 Modelo no cargado"]
    C -- Si --> E["Construir DataFrame"]
    E --> F["Aplicar Pipeline\nColumnTransformer\nStandardScaler + OneHotEncoder"]
    F --> G["Random Forest Classifier\npredict + predict_proba"]
    G --> H["categoria = predict_0\nprob = max predict_proba_0"]
    H --> I["Calcular Costo = consumo_kwh x 0.75"]
    I --> J["Motor de Reglas\ngenerar_recomendaciones"]
    J --> K["Construir AnalisisResponse\ncategoria, probabilidad\ncosto, recomendaciones, fecha, identificador"]
    K --> L["Fin: Retornar JSON"]
```

---

## 15. MODELO DE DATOS

### 15.1 Tabla: users

| Campo | Tipo | Descripción |
|---|---|---|
| id | BIGINT (IDENTITY PK) | Identificador único autoincremental |
| nombre_completo | VARCHAR(150) NOT NULL | Nombre completo del usuario |
| username | VARCHAR(100) NOT NULL UNIQUE | Email / identificador de acceso |
| password | VARCHAR(200) NOT NULL | Hash BCrypt de la contraseña |
| role | VARCHAR(50) NOT NULL DEFAULT 'USER' | Rol del usuario: USER o ADMIN |

### 15.2 Tabla: analisis_energetico

| Campo | Tipo | Descripción |
|---|---|---|
| id | BIGINT (IDENTITY PK) | Identificador único autoincremental |
| user_id | BIGINT (FK → users.id, NULL permitido) | Usuario que realizó el análisis (null = anónimo) |
| identificador | VARCHAR(50) NOT NULL | Código único del análisis (IA-XXXXXXXX) |
| region | VARCHAR(50) NOT NULL | Región geográfica del análisis |
| consumo_kwh | DOUBLE PRECISION NOT NULL | Consumo mensual declarado en kWh |
| uso_horario_pico | BOOLEAN NOT NULL | Si el usuario usa energía en horario pico |
| cantidad_equipos | INT NOT NULL | Número de equipos registrados |
| tipo_inmueble | VARCHAR(50) NOT NULL | Tipo de propiedad: Casa, Departamento, etc. |
| horas_alto_consumo | INT NOT NULL | Horas de alto consumo por día |
| categoria | VARCHAR(50) NOT NULL | Categoría asignada: Eficiente / Moderado / Ineficiente |
| probabilidad | DOUBLE PRECISION NOT NULL | Probabilidad de confianza del modelo ML |
| costo_estimado_mensual | DOUBLE PRECISION NOT NULL | Costo en R$ (consumo × 0.75) |
| fecha_creacion | TIMESTAMP NOT NULL | Fecha y hora de creación del análisis |

### 15.3 Tabla: analisis_recomendaciones

| Campo | Tipo | Descripción |
|---|---|---|
| analisis_id | BIGINT NOT NULL (FK → analisis_energetico.id, CASCADE DELETE) | Referencia al análisis padre |
| recomendacion | VARCHAR(1000) NOT NULL | Texto de la recomendación individual |

---

## 16. DIAGRAMA ENTIDAD-RELACIÓN (ER)

```mermaid
erDiagram
    USERS {
        BIGINT id PK
        VARCHAR_150 nombre_completo
        VARCHAR_100 username UK
        VARCHAR_200 password
        VARCHAR_50 role
    }

    ANALISIS_ENERGETICO {
        BIGINT id PK
        BIGINT user_id FK
        VARCHAR_50 identificador
        VARCHAR_50 region
        DOUBLE consumo_kwh
        BOOLEAN uso_horario_pico
        INT cantidad_equipos
        VARCHAR_50 tipo_inmueble
        INT horas_alto_consumo
        VARCHAR_50 categoria
        DOUBLE probabilidad
        DOUBLE costo_estimado_mensual
        TIMESTAMP fecha_creacion
    }

    ANALISIS_RECOMENDACIONES {
        BIGINT analisis_id FK
        VARCHAR_1000 recomendacion
    }

    USERS ||--o{ ANALISIS_ENERGETICO : "realiza nullable"
    ANALISIS_ENERGETICO ||--|{ ANALISIS_RECOMENDACIONES : "tiene"
```

---

## 17. MODELO RELACIONAL (SQL)

```sql
-- Tabla de usuarios
CREATE TABLE users (
    id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre_completo VARCHAR(150) NOT NULL,
    username        VARCHAR(100) NOT NULL UNIQUE,
    password        VARCHAR(200) NOT NULL,
    role            VARCHAR(50)  NOT NULL DEFAULT 'USER'
);
CREATE UNIQUE INDEX idx_users_username ON users (username);

-- Tabla de análisis energético
CREATE TABLE analisis_energetico (
    id                      BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id                 BIGINT REFERENCES users(id) ON DELETE SET NULL,
    identificador           VARCHAR(50)         NOT NULL,
    region                  VARCHAR(50)         NOT NULL,
    consumo_kwh             DOUBLE PRECISION    NOT NULL,
    uso_horario_pico        BOOLEAN             NOT NULL,
    cantidad_equipos        INT                 NOT NULL,
    tipo_inmueble           VARCHAR(50)         NOT NULL,
    horas_alto_consumo      INT                 NOT NULL,
    categoria               VARCHAR(50)         NOT NULL,
    probabilidad            DOUBLE PRECISION    NOT NULL,
    costo_estimado_mensual  DOUBLE PRECISION    NOT NULL,
    fecha_creacion          TIMESTAMP           NOT NULL
);
CREATE INDEX idx_analisis_user_id   ON analisis_energetico (user_id);
CREATE INDEX idx_analisis_fecha     ON analisis_energetico (fecha_creacion DESC);
CREATE INDEX idx_analisis_categoria ON analisis_energetico (categoria);

-- Tabla de recomendaciones
CREATE TABLE analisis_recomendaciones (
    analisis_id   BIGINT        NOT NULL REFERENCES analisis_energetico(id) ON DELETE CASCADE,
    recomendacion VARCHAR(1000) NOT NULL
);
CREATE INDEX idx_recs_analisis_id ON analisis_recomendaciones (analisis_id);
```

---

## 18. API REST — DOCUMENTACIÓN COMPLETA

### Base URL
- Desarrollo: `http://localhost:8080`
- Producción OCI: `http://{OCI_PUBLIC_IP}:8080`

---

### POST /api/auth/register

Registra un nuevo usuario.

**Request Body:**
```json
{
  "nombreCompleto": "Ing. Sofía Ramos",
  "username": "sofia@empresa.com",
  "password": "contrasena_segura_123"
}
```

**Response 201 Created:**
```json
{
  "nombreCompleto": "Ing. Sofía Ramos",
  "username": "sofia@empresa.com"
}
```

**Response 400:** "El usuario ya existe"

---

### POST /api/auth/login

**Request Body:**
```json
{
  "username": "sofia@empresa.com",
  "password": "contrasena_segura_123"
}
```

**Response 200 OK:**
```json
{
  "jwtToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "username": "sofia@empresa.com",
  "nombreCompleto": "Ing. Sofía Ramos",
  "role": "USER"
}
```

**Response 403 Forbidden:** credenciales incorrectas.

---

### GET /api/auth/me

Requiere: Header `Authorization: Bearer {token}`

**Response 200 OK:**
```json
{
  "id": 2,
  "username": "demo@energiai.com",
  "nombreCompleto": "Usuario Demo",
  "role": "USER"
}
```

---

### POST /api/analisis-energetico

Ejecuta un análisis de consumo energético. Si el usuario está autenticado, persiste el resultado. Si el ML falla, aplica lógica resiliente.

**Request Body:**
```json
{
  "region": "Centro",
  "consumo_kwh": 420.0,
  "uso_horario_pico": true,
  "cantidad_equipos": 10,
  "tipo_inmueble": "Casa",
  "horas_alto_consumo": 8
}
```

| Campo | Tipo | Requerido | Valores Válidos |
|---|---|---|---|
| region | String | No (default: Centro) | Norte, Centro, Sur, Este, Oeste |
| consumo_kwh | double | Sí | > 0 |
| uso_horario_pico | boolean | Sí | true, false |
| cantidad_equipos | int | Sí | > 0 |
| tipo_inmueble | String | No (default: Casa) | Casa, Departamento, Oficina, Comercio, Industria |
| horas_alto_consumo | int | Sí | 0–24 |

**Response 200 OK:**
```json
{
  "id": 5,
  "identificador": "IA-C402E9AB",
  "categoria": "Ineficiente",
  "probabilidad": 0.9450,
  "costo_estimado_mensual": 315.00,
  "recomendaciones": [
    "Desplazar el uso de electrodomésticos de alto consumo fuera del horario pico (18:00 - 22:00).",
    "¡Alerta de consumo crítico! Tu patrón supera considerablemente el promedio."
  ],
  "fecha": "2026-07-27T20:34:42"
}
```

---

### GET /api/analisis/historial

Requiere: Header `Authorization: Bearer {token}`

**Response 200 OK:** Lista de `AnalisisEnergeticoResponse` ordenada por fecha descendente.

---

### GET /api/analisis/{id}

**Path Variable:** `id` (Long)

**Response 200 OK:** AnalisisEnergeticoResponse  
**Response 404 Not Found:** Sin body.

---

### GET /api/health

No requiere autenticación.

**Response 200 OK:** `"Backend OK"` (text/plain)

---

### GET /api/dashboard

No requiere autenticación (ruta pública).

**Response 200 OK:**
```json
{
  "totalConsultas": 4,
  "consumoPromedioKwh": 285.12,
  "costoTotalEstimado": 855.38,
  "distribucionCategorias": {
    "Eficiente": 2,
    "Moderado": 1,
    "Ineficiente": 1
  },
  "analisisRecientes": [...]
}
```

---

### POST /predict (ML Service — Puerto 8000)

Uso interno del backend.

**Request Body:**
```json
{
  "consumo_kwh": 420.0,
  "uso_horario_pico": true,
  "cantidad_equipos": 10,
  "tipo_inmueble": "Casa",
  "horas_alto_consumo": 8,
  "region": "Centro"
}
```

**Response 200 OK:**
```json
{
  "categoria": "Ineficiente",
  "probabilidad": 0.9450,
  "costo_estimado_mensual": 315.00,
  "recomendaciones": ["..."],
  "fecha": "2026-07-27T20:34:42.123456",
  "identificador": "IA-C402E9AB"
}
```

**Response 503:** `{"detail": "El modelo de Machine Learning no está cargado ni entrenado."}`

---

### GET /health (ML Service — Puerto 8000)

**Response 200:**
```json
{
  "status": "ok",
  "model_loaded": true
}
```

---

## 19. SEGURIDAD

### 19.1 Autenticación y JWT

- **Algoritmo**: HMAC256 con secret configurado via `api.security.secret`.
- **Issuer**: `"EnergiAI"`.
- **Subject**: `username` del usuario.
- **Expiración**: 30 días desde la emisión (zona UTC-3).
- **Transmisión**: Header `Authorization: Bearer {token}`.
- **Librería**: `com.auth0:java-jwt:4.4.0`.

### 19.2 Autorización y Roles

| Rol | Permisos |
|---|---|
| ROLE_USER | Análisis, historial, dashboard, configuración, recomendaciones |
| ROLE_ADMIN | Mismos que USER + acceso a historial global sin restricción |
| Anónimo | Solo análisis sin persistencia, health check, dashboard |

### 19.3 Protección de Contraseñas

- **Algoritmo**: BCryptPasswordEncoder.
- Las contraseñas nunca se almacenan en texto plano ni se devuelven en ningún endpoint.

### 19.4 CORS

```java
configuration.setAllowedOriginPatterns(List.of("*"));
configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
configuration.setAllowedHeaders(List.of("*"));
configuration.setAllowCredentials(true);
```

El CORS permisivo es apropiado para el contexto del hackathon. En producción empresarial debería restringirse al dominio del frontend.

### 19.5 CSRF

Deshabilitado. La API es stateless (JWT Bearer Token, no cookies de sesión), por lo que CSRF no aplica.

### 19.6 Rate Limiting

⏳ **Pendiente de Implementación.** Se recomienda implementar con Spring Boot + Bucket4j o a nivel de API Gateway OCI en producción.

---

## 20. FLUJO DE AUTENTICACIÓN

```mermaid
sequenceDiagram
    participant Browser as Browser React
    participant API as Spring Boot API
    participant DB as Base de Datos
    participant SEC as SecurityFilter JWT

    Note over Browser,SEC: FLUJO DE REGISTRO
    Browser->>API: POST /api/auth/register nombreCompleto username password
    API->>DB: findByUsername(username)
    DB-->>API: null no existe
    API->>API: passwordEncoder.encode(password)
    API->>DB: save(Users)
    API-->>Browser: HTTP 201 nombreCompleto username

    Note over Browser,SEC: FLUJO DE LOGIN
    Browser->>API: POST /api/auth/login username password
    API->>DB: loadUserByUsername(username)
    DB-->>API: Users entity
    API->>API: passwordEncoder.matches() BCrypt
    API->>API: tokenService.createToken(user)
    API-->>Browser: HTTP 200 jwtToken username nombreCompleto role
    Browser->>Browser: localStorage.setItem energiai_jwt token

    Note over Browser,SEC: FLUJO REQUEST AUTENTICADO
    Browser->>SEC: GET /api/analisis/historial Authorization Bearer token
    SEC->>SEC: Extraer token del header
    SEC->>API: tokenService.getSubject(token) JWT HMAC256 verify
    API->>DB: userRepository.findByUsername(subject)
    SEC->>SEC: SecurityContextHolder.setAuthentication()
    API-->>Browser: HTTP 200 lista de análisis
```

---

## 21. CASOS DE USO

### CU-01: Registrar Usuario

| Campo | Detalle |
|---|---|
| ID | CU-01 |
| Nombre | Registrar Usuario |
| Actor | Usuario Anónimo |
| Precondición | El usuario no tiene una cuenta registrada. |
| Flujo Principal | 1. Abre AuthModal. 2. Selecciona "Crea una cuenta". 3. Ingresa nombre, email, contraseña. 4. POST /api/auth/register. 5. Backend valida y crea el usuario. 6. Toast de bienvenida. |
| Flujo Alternativo | El username ya existe → 400 → mensaje de error. |
| Postcondición | El usuario tiene una cuenta activa y sesión iniciada. |

### CU-02: Iniciar Sesión

| Campo | Detalle |
|---|---|
| ID | CU-02 |
| Nombre | Iniciar Sesión |
| Actor | Usuario Registrado |
| Precondición | El usuario tiene una cuenta registrada. |
| Flujo Principal | 1. Abre AuthModal. 2. Ingresa email y contraseña. 3. POST /api/auth/login. 4. JWT devuelto. 5. JWT almacenado en localStorage. 6. Secciones desbloqueadas. |
| Flujo Alternativo | Credenciales incorrectas → Error 403 → mensaje de error. Backend no disponible → Login offline con token demo. |
| Postcondición | El usuario tiene sesión JWT activa. |

### CU-03: Acceso Demo

| Campo | Detalle |
|---|---|
| ID | CU-03 |
| Nombre | Acceso Rápido Demo |
| Actor | Evaluador / Demo |
| Precondición | AuthModal abierto. |
| Flujo Principal | 1. Clic en "Usuario Demo" o "Admin Mode". 2. POST /api/auth/login con credenciales precargadas. 3. Autenticado. |
| Postcondición | Acceso a la plataforma con rol USER o ADMIN. |

### CU-04: Ejecutar Análisis Energético

| Campo | Detalle |
|---|---|
| ID | CU-04 |
| Nombre | Ejecutar Análisis Energético |
| Actor | Usuario Anónimo / Registrado |
| Precondición | El usuario se encuentra en la vista Simulador. |
| Flujo Principal | 1. Seleccionar tipo de inmueble. 2. Ajustar sliders. 3. Seleccionar región y horario pico. 4. Clic "Ejecutar Diagnóstico IA". 5. POST /api/analisis-energetico. 6. Backend llama ML. 7. Resultado mostrado en ResultsModal. |
| Flujo Alt. A | ML falla → Backend aplica lógica resiliente. |
| Flujo Alt. B | Backend no disponible → Frontend aplica lógica offline. |
| Postcondición | El resultado se muestra. Si autenticado, el análisis se persiste. |

### CU-05: Consultar Historial

| Campo | Detalle |
|---|---|
| ID | CU-05 |
| Nombre | Consultar Historial de Análisis |
| Actor | Usuario Registrado |
| Precondición | Sesión JWT activa. |
| Flujo Principal | 1. Navega a pestaña "Historial". 2. GET /api/analisis/historial. 3. Lista mostrada en tabla. |
| Postcondición | El usuario visualiza su historial de análisis. |

### CU-06: Visualizar Dashboard

| Campo | Detalle |
|---|---|
| ID | CU-06 |
| Nombre | Visualizar Dashboard Analítico |
| Actor | Usuario Registrado |
| Precondición | Sesión JWT activa. |
| Flujo Principal | 1. Navega a "Dashboard". 2. GET /api/dashboard. 3. KPIs, gráfico de barras, recomendaciones y análisis recientes mostrados. |
| Postcondición | El usuario visualiza el estado analítico del sistema. |

---

## 22. DIAGRAMA DE CASOS DE USO

```plantuml
@startuml
left to right direction
skinparam packageStyle rectangle

actor "Usuario Anonimo Guest" as ANON
actor "Usuario Registrado USER" as USER
actor "Administrador ADMIN" as ADMIN
actor "Sistema ML FastAPI" as ML

ANON --|> USER : extend
USER --|> ADMIN : extend

rectangle "EnergiAI Platform" {
  usecase "Registrar Cuenta" as UC01
  usecase "Iniciar Sesion" as UC02
  usecase "Acceso Demo 1 clic" as UC03
  usecase "Ejecutar Analisis Energetico" as UC04
  usecase "Ver ResultsModal" as UC05
  usecase "Consultar Historial" as UC06
  usecase "Visualizar Dashboard" as UC07
  usecase "Cerrar Sesion" as UC08
  usecase "Alternar Tema" as UC09
  usecase "Ver Recomendaciones" as UC10
  usecase "Ver Configuracion" as UC11
  usecase "Inferencia ML" as UC12
  usecase "Logica Resiliente Fallback" as UC13
}

ANON --> UC01
ANON --> UC02
ANON --> UC03
ANON --> UC04
ANON --> UC09
ANON --> UC05

USER --> UC06
USER --> UC07
USER --> UC08
USER --> UC10
USER --> UC11

ML --> UC12

UC04 ..> UC12 : include
UC04 ..> UC13 : extend si ML falla
UC12 ..> UC05 : include
@enduml
```

---

## 23. DIAGRAMAS DE SECUENCIA

### 23.1 Inicio de Sesión

```mermaid
sequenceDiagram
    actor U as Usuario
    participant FE as Frontend React
    participant API as Spring Boot API
    participant DB as Base de Datos

    U->>FE: Clic Ingresar al Sistema
    FE->>API: POST /api/auth/login
    API->>DB: loadUserByUsername(username)
    DB-->>API: Users entity
    API->>API: BCrypt.matches(password, hash)
    alt Credenciales validas
        API->>API: tokenService.createToken(user)
        API-->>FE: 200 OK jwtToken
        FE->>FE: localStorage.set energiai_jwt
        FE-->>U: Toast Sesion iniciada
    else Credenciales invalidas
        API-->>FE: 403 Forbidden
        FE-->>U: Error Credenciales incorrectas
    end
```

### 23.2 Nuevo Análisis

```mermaid
sequenceDiagram
    actor U as Usuario
    participant FE as Frontend
    participant BE as Spring Boot
    participant ML as FastAPI ML
    participant DB as Base de Datos

    U->>FE: Completa formulario y clic Ejecutar IA
    FE->>BE: POST /api/analisis-energetico
    BE->>ML: POST /predict

    alt ML disponible
        ML->>ML: pipeline.predict + predict_proba
        ML->>ML: generar_recomendaciones
        ML-->>BE: categoria probabilidad costo recomendaciones
    else ML no disponible
        BE->>BE: generarRespuestaResiliente(request)
        Note over BE: Logica de reglas local
    end

    alt Usuario autenticado
        BE->>DB: analisisRepository.save(entity)
        DB-->>BE: Analisis guardado con ID
    end

    BE-->>FE: 200 OK respuesta completa
    FE-->>U: Abre ResultsModal
```

### 23.3 Consulta del Historial

```mermaid
sequenceDiagram
    actor U as Usuario
    participant FE as Frontend
    participant SEC as SecurityFilter
    participant BE as Spring Boot
    participant DB as Base de Datos

    U->>FE: Navega a Historial
    FE->>SEC: GET /api/analisis/historial Authorization Bearer JWT
    SEC->>SEC: Extraer y verificar token JWT
    SEC->>DB: findByUsername(subject)
    DB-->>SEC: Users entity
    SEC->>BE: Continua request autenticado
    BE->>DB: findAllByOrderByFechaCreacionDesc()
    DB-->>BE: Lista de Analisis
    BE-->>FE: 200 OK lista
    FE-->>U: Renderiza tabla de historial
```

### 23.4 Predicción ML (Interno)

```mermaid
sequenceDiagram
    participant BE as Spring Boot
    participant ML as FastAPI Puerto 8000

    BE->>ML: POST /predict consumo_kwh 420 uso_horario_pico true cantidad_equipos 10 tipo_inmueble Casa horas_alto_consumo 8 region Centro
    ML->>ML: Construir DataFrame
    ML->>ML: pipeline.predict -> Ineficiente
    ML->>ML: pipeline.predict_proba -> 0.9450
    ML->>ML: costo = 420 x 0.75 = 315.00
    ML->>ML: generar_recomendaciones()
    ML-->>BE: categoria Ineficiente probabilidad 0.9450 costo 315.00 recomendaciones identificador
```

### 23.5 Generación de Recomendaciones

```mermaid
sequenceDiagram
    participant ML as inference_api.py
    participant R as Motor de Reglas

    ML->>R: generar_recomendaciones(req, Ineficiente, 315.00)

    alt uso_horario_pico = true
        R->>R: Agregar: Desplazar electrodomesticos fuera 18:00-22:00
    end
    alt horas_alto_consumo >= 7
        R->>R: Agregar: Distribuir demanda + temporizadores
    end
    alt cantidad_equipos > 15
        R->>R: Agregar: Auditoria de eficiencia
    end
    alt region = Norte AND consumo > 350
        R->>R: Agregar: Optimizar A/C a 24C
    else region = Sur AND consumo > 350
        R->>R: Agregar: Termostatos programables
    end
    alt categoria = Ineficiente
        R->>R: Agregar: Alerta critica equipos fantasma
    end

    R-->>ML: Lista de recomendaciones
```

---

## 24. DIAGRAMAS DE ACTIVIDAD

### 24.1 Flujo de Registro y Login

```mermaid
flowchart TD
    A["Inicio"] --> B["Usuario abre AuthModal"]
    B --> C{"Tiene cuenta?"}
    C -- No --> D["Selecciona Registro"]
    D --> E["Ingresa nombre email contrasena"]
    E --> F["POST /api/auth/register"]
    F --> G{"Username disponible?"}
    G -- No --> H["Mostrar error El usuario ya existe"]
    H --> E
    G -- Si --> I["Guardar usuario con BCrypt"]
    I --> J["Retornar 201 Created"]
    C -- Si --> K["Ingresa email y contrasena"]
    K --> L["POST /api/auth/login"]
    L --> M{"Credenciales validas?"}
    M -- No --> N["Mostrar error"]
    N --> K
    M -- Si --> O["Generar JWT 30 dias"]
    O --> P["Guardar JWT en localStorage"]
    J --> P
    P --> Q["Desbloquear secciones protegidas"]
    Q --> R["Fin"]
```

### 24.2 Flujo del Análisis Completo

```mermaid
flowchart TD
    A["Usuario en Simulador"] --> B["Seleccionar Tipo Inmueble"]
    B --> C["Ajustar Sliders consumo equipos horas"]
    C --> D["Seleccionar Region y Horario Pico"]
    D --> E["Visualizar Costo Pre-estimado"]
    E --> F["Clic Ejecutar Diagnostico IA"]
    F --> G["POST /api/analisis-energetico"]
    G --> H{"Microservicio ML disponible?"}
    H -- Si --> I["FastAPI predict + predict_proba"]
    I --> J["Calcular costo x 0.75"]
    J --> K["Generar recomendaciones"]
    H -- No --> L["Logica Resiliente Backend"]
    L --> M["Reglas: consumo>400 Ineficiente
consumo 200-400 Moderado
resto Eficiente"]
    K --> N{"Usuario Autenticado?"}
    M --> N
    N -- Si --> O["Persistir en analisis_energetico"]
    O --> P["Asignar ID de base de datos"]
    N -- No --> Q["No persistir"]
    P --> R["Devolver AnalisisEnergeticoResponse"]
    Q --> R
    R --> S["Frontend Abrir ResultsModal"]
    S --> T["Mostrar resultados al usuario"]
```

---

## 25. FLUJO COMPLETO DEL SISTEMA

```mermaid
flowchart LR
    subgraph "Acceso"
        U["Usuario"] --> LAND["Landing Page"]
        LAND --> AUTH{"Autenticado?"}
        AUTH -- No --> GUEST["Modo Guest\nSimulador habilitado"]
        AUTH -- Si --> APP["App Principal\nSidebar + Navbar"]
        GUEST --> APP
    end

    subgraph "Captura"
        APP --> FORM["SimulationForm\nSliders + Seleccion"]
        FORM --> REQ["AnalisisRequest"]
    end

    subgraph "Procesamiento"
        REQ --> BE["Spring Boot\nAnalisisController"]
        BE --> ML["FastAPI\n/predict"]
        ML --> MOD["Random Forest\nmodel.joblib"]
        MOD --> PRED["categoria + probabilidad"]
        PRED --> REC["Motor de Reglas\nrecomendaciones"]
        ML --> COST["costo = kWh x 0.75"]
        REC --> RESP["AnalisisResponse"]
        COST --> RESP
    end

    subgraph "Persistencia"
        RESP --> PERSIST{"Autenticado?"}
        PERSIST -- Si --> DB["analisis_energetico"]
        PERSIST -- No --> SKIP["Sin persistencia"]
    end

    subgraph "Visualizacion"
        DB --> HIST["HistoryView"]
        DB --> DASH["DashboardView"]
        RESP --> MODAL["ResultsModal\nCategoria + Costo + Recomendaciones"]
    end
```

---

## 26. DISEÑO UI/UX

### 26.1 Landing Page (LandingPage.tsx)

- **Hero Section**: Titular con gradiente emerald-cyan, subtítulo descriptivo, CTA "Probar EnergiAI Gratis" y botón "Ver Demostración".
- **Feature Cards**: Tarjetas de características principales (Análisis ML, Estimación Financiera, Historial, Dashboard).
- **Social Proof**: Sección de estadísticas y testimonios de uso.
- **CTA Final**: Llamada a la acción para registro.

### 26.2 Modal de Autenticación (AuthModal.tsx)

- Overlay con `backdrop-filter: blur(8px)` y fondo semi-transparente.
- Sección de acceso rápido demo con borde punteado: "Usuario Demo" y "Admin Mode".
- Formulario con campos iconográficos (Lucide React), toggle de visibilidad de contraseña.

### 26.3 Dashboard (DashboardView.tsx)

- **4 KPI Cards**: Total Análisis, Consumo Promedio (kWh), Gasto Mensual Total (R$), Precisión Modelo ML (93.4%).
- **Gráfico de barras** (Recharts BarChart): Distribución de categorías energéticas con colores semánticos.
- **Panel de Recomendaciones Inteligentes**: Tarjetas de tipo alert con íconos.
- **Tabla de Registros Recientes**: Identificador, fecha, badge de categoría, confianza %, costo R$, botón "Detalles".
- **Skeleton loading**: Shimmer animation mientras cargan los datos.

### 26.4 Simulador (SimulationForm.tsx)

- **Paso 1**: Selector visual de tipo de inmueble (5 opciones con íconos Lucide).
- **Paso 2**: 3 sliders interactivos con valores en tiempo real. El color del slider de consumo cambia dinámicamente (verde/amarillo/rojo).
- **Paso 3**: Selector de región (5 botones pill) y toggle de horario pico.
- **Estimación en tiempo real**: El costo mensual se recalcula localmente en cada cambio de consumo.

### 26.5 Modo Oscuro / Modo Claro

| Variable CSS | Modo Claro | Modo Oscuro |
|---|---|---|
| --bg-primary | #f8fafc | #0b0f19 |
| --bg-surface | #ffffff | rgba(22,30,46,0.75) |
| --text-primary | #0f172a | #f8fafc |
| --border-color | #e2e8f0 | rgba(255,255,255,0.09) |
| Activación | data-theme="light" | data-theme="dark" |
| Persistencia | localStorage energiai_theme | localStorage energiai_theme |

### 26.6 Design System Tokens

| Token | Valor | Uso |
|---|---|---|
| --font-body | Inter, sans-serif | Todo el UI |
| --font-mono | JetBrains Mono, monospace | Métricas, KPIs, IDs, código |
| --color-emerald-500 | #10b981 | Acción primaria, Eficiente |
| --color-cyan-500 | #06b6d4 | Acento secundario, IDs |
| --color-amber-500 | #f59e0b | Moderado, advertencias |
| --color-rose-500 | #f43f5e | Ineficiente, errores |
| --radius-md | 12px | Cards, botones, inputs |
| --radius-full | 9999px | Badges de estado |

---

## 27. ORACLE CLOUD INFRASTRUCTURE

### 27.1 Servicios Utilizados

| Servicio OCI | Propósito | Estado |
|---|---|---|
| OCI Compute | Hosting del backend Spring Boot y del microservicio FastAPI en una VM Instance | Planificado (arquitectura diseñada para OCI) |
| OCI Object Storage | Almacenamiento del modelo serializado model.joblib, datasets CSV y artifacts | Planificado |
| OCI Database PostgreSQL | Base de datos relacional para producción | Opcional / Planificado |
| OCI Container Instances | Despliegue contenerizado del backend | Planificado |

### 27.2 Arquitectura OCI

1. Una VM Instance (OCI Compute) corre tanto el backend Spring Boot (puerto 8080) como el microservicio FastAPI (puerto 8000).
2. OCI Object Storage almacena los artefactos de ML (model.joblib, datasets), accesibles por el microservicio Python al iniciar.
3. El frontend puede servirse desde un bucket de Object Storage configurado como static website, o desde la misma VM con Nginx.

### 27.3 Variables de Entorno para OCI

| Variable | Valor Producción |
|---|---|
| DB_URL | jdbc:postgresql://{OCI_DB_HOST}:5432/energiaidb |
| DB_USERNAME | Usuario de la base de datos OCI |
| DB_PASSWORD | Contraseña segura (OCI Vault recomendado) |
| DB_DRIVER | org.postgresql.Driver |
| JWT_SECRET | Secret aleatorio de >= 32 caracteres |
| ML_SERVICE_URL | http://localhost:8000/predict |

### 27.4 Flujo de Despliegue OCI

```mermaid
flowchart TD
    A["GitHub Repository"] --> B["Build JAR
mvn package -DskipTests"]
    A --> C["Entrenar Modelo
python train_model.py"]
    C --> D["model.joblib"]
    D --> E["Upload a OCI Object Storage"]
    B --> F["Upload JAR a OCI Compute VM"]
    E --> G["FastAPI descarga model.joblib al iniciar"]
    F --> H["java -jar energiaai.jar Puerto 8080"]
    G --> I["uvicorn inference_api:app Puerto 8000"]
    H --> J["API disponible en http://OCI_IP:8080"]
    I --> K["ML disponible en http://localhost:8000"]
    J --> L["Usuario accede desde Browser"]
```

---

## 28. INSTALACIÓN Y CONFIGURACIÓN

### 28.1 Requisitos Previos

| Herramienta | Versión Mínima |
|---|---|
| Java JDK | 17 LTS |
| Maven | 3.8+ |
| Python | 3.9+ |
| Node.js | 18 LTS |
| npm | 9+ |

### 28.2 Backend (Spring Boot)

```bash
cd G9-LATAM-TEAM-60/backend
export JWT_SECRET=energiai_secret_key_hackathon_2026
export ML_SERVICE_URL=http://localhost:8000/predict
./mvnw spring-boot:run
```

El backend estará disponible en `http://localhost:8080`.

### 28.3 Microservicio ML (FastAPI)

```bash
cd G9-LATAM-TEAM-60/data-science
python -m venv venv
# Windows:
venv\Scripts\activate
# Linux/macOS:
source venv/bin/activate
pip install -r requirements.txt
python train_model.py
python inference_api.py
```

El microservicio ML estará disponible en `http://localhost:8000`.  
Documentación OpenAPI en `http://localhost:8000/docs`.

### 28.4 Frontend (React + Vite)

```bash
cd G9-LATAM-TEAM-60/frontend
npm install
npm run dev
```

El frontend estará disponible en `http://localhost:5173`.

### 28.5 Variables de Entorno (backend/.env.example)

```env
DB_URL=jdbc:h2:file:./data/energiadb;MODE=PostgreSQL;DATABASE_TO_LOWER=TRUE
DB_USERNAME=sa
DB_PASSWORD=
DB_DRIVER=org.h2.Driver
JWT_SECRET=energiai_secret_key_hackathon_2026_super_secure_token
ML_SERVICE_URL=http://localhost:8000/predict
```

### 28.6 Credenciales de Prueba (precargadas en V1)

| Usuario | Contraseña | Rol |
|---|---|---|
| admin@energiai.com | admin123 | ADMIN |
| demo@energiai.com | demo123 | USER |

### 28.7 Docker (Pendiente de Implementación)

El Dockerfile del backend existe en el repositorio pero está vacío. Contenido de referencia recomendado:

```dockerfile
FROM eclipse-temurin:17-jdk-alpine as builder
WORKDIR /app
COPY . .
RUN ./mvnw package -DskipTests

FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=builder /app/target/energiaai-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

---

## 29. ESTRUCTURA DEL PROYECTO

```
G9-LATAM-TEAM-60-main/
├── Contexto.md
├── README.md
├── LICENSE
├── RECURSOS/
└── G9-LATAM-TEAM-60/
    ├── backend/
    │   ├── Dockerfile                  (Vacío — pendiente)
    │   ├── pom.xml
    │   ├── .env.example
    │   ├── mvnw / mvnw.cmd
    │   └── src/
    │       ├── main/java/energiai/
    │       │   ├── EnergiaaiApplication.java
    │       │   ├── controller/
    │       │   ├── service/
    │       │   ├── repository/
    │       │   ├── model/
    │       │   ├── dto/
    │       │   ├── config/
    │       │   ├── infra/
    │       │   │   ├── authentication/
    │       │   │   └── security/
    │       │   └── exception/
    │       └── resources/
    │           ├── application.properties
    │           └── db/migration/
    │               ├── V1__create_table_users.sql
    │               ├── V2__create_tables_analisis.sql
    │               └── V3__insert_sample_data.sql
    ├── frontend/
    │   ├── index.html
    │   ├── package.json
    │   ├── vite.config.ts
    │   ├── tsconfig.json
    │   └── src/
    │       ├── App.tsx
    │       ├── main.tsx
    │       ├── index.css
    │       ├── components/
    │       ├── context/
    │       ├── services/
    │       └── types/
    └── data-science/
        ├── EnergiAI_v1.ipynb
        ├── train_model.py
        ├── inference_api.py
        ├── model.joblib
        ├── requirements.txt
        ├── dataset_consumo_energia_G9_T60_opcion1.csv
        └── dataset_consumo_energia_G9_T60_opcion2.csv
```

---

## 30. DEPENDENCIAS

### 30.1 Backend (Maven — pom.xml)

| Dependencia | Versión | Propósito |
|---|---|---|
| spring-boot-starter-parent | 3.3.0 | Framework base |
| spring-boot-starter-web | Gestionado | API REST |
| spring-boot-starter-data-jpa | Gestionado | ORM JPA/Hibernate |
| spring-boot-starter-security | Gestionado | Seguridad y autenticación |
| spring-boot-starter-validation | Gestionado | Validación de DTOs |
| spring-boot-starter-test | Gestionado | Testing unitario |
| postgresql | Gestionado | Driver PostgreSQL producción |
| h2 | Gestionado | Base de datos embebida desarrollo |
| flyway-core | Gestionado | Migraciones de BD |
| flyway-database-postgresql | Gestionado | Soporte PostgreSQL para Flyway |
| com.auth0:java-jwt | 4.4.0 | Creación y verificación de JWT |
| org.projectlombok:lombok | Gestionado | Reducción de boilerplate Java |

### 30.2 Frontend (npm — package.json)

| Dependencia | Versión | Tipo | Propósito |
|---|---|---|---|
| react | ^19.2.7 | Runtime | Framework UI |
| react-dom | ^19.2.7 | Runtime | Renderización DOM |
| lucide-react | ^1.27.0 | Runtime | Librería de íconos SVG |
| recharts | ^3.10.1 | Runtime | Gráficos (BarChart en Dashboard) |
| typescript | ~6.0.2 | DevDep | Tipado estático |
| vite | ^8.1.1 | DevDep | Build tool y dev server |
| @vitejs/plugin-react | ^6.0.3 | DevDep | Plugin React para Vite |
| @types/react | ^19.2.17 | DevDep | Types de React |
| @types/react-dom | ^19.2.3 | DevDep | Types de ReactDOM |
| oxlint | ^1.71.0 | DevDep | Linter Rust-based ultra-rápido |

### 30.3 Machine Learning (Python — requirements.txt)

| Paquete | Versión Mínima | Propósito |
|---|---|---|
| pandas | >= 2.0.0 | Manipulación de datos DataFrames |
| numpy | >= 1.24.0 | Cálculo numérico |
| scikit-learn | >= 1.2.0 | Pipeline ML, modelos, métricas |
| joblib | >= 1.2.0 | Serialización del modelo |
| fastapi | >= 0.100.0 | Framework REST para el microservicio ML |
| uvicorn | >= 0.22.0 | Servidor ASGI para FastAPI |
| pydantic | >= 2.0.0 | Validación de modelos de datos en FastAPI |

---

## 31. ESTRATEGIA DE PRUEBAS

### 31.1 Pruebas Unitarias del Backend

⏳ **Estado: Pendiente de Implementación.** El directorio `src/test/` existe pero el contenido de los tests no ha sido desarrollado en el MVP.

Ejemplo de prueba unitaria sugerida para `AiClientService`:

```java
@ExtendWith(MockitoExtension.class)
class AiClientServiceTest {
    @Mock AnalisisRepository analisisRepository;
    @Mock UserRepository userRepository;
    @Mock RestTemplate restTemplate;
    @InjectMocks AiClientService service;

    @Test
    void deberiaGenerarRespuestaResilienteCuandoMLFalla() {
        AnalisisEnergeticoRequest req = new AnalisisEnergeticoRequest(
            "Centro", 450, true, 12, "Casa", 9);
        when(restTemplate.postForEntity(anyString(), any(), eq(Map.class)))
            .thenThrow(new RuntimeException("Connection refused"));

        AnalisisEnergeticoResponse resp = service.obtenerAnalisis(req, null);

        assertEquals("Ineficiente", resp.getCategoria());
        assertEquals(337.5, resp.getCosto_estimado_mensual(), 0.01);
    }
}
```

### 31.2 Pruebas de API (Manual / Postman)

| Test | Método | URL | Body | Resultado Esperado |
|---|---|---|---|---|
| Health Check | GET | /api/health | — | 200 "Backend OK" |
| Login Demo | POST | /api/auth/login | username: demo@energiai.com, password: demo123 | 200 con JWT |
| Análisis Guest | POST | /api/analisis-energetico | consumo_kwh: 420 ... | 200 con categoría |
| Historial (auth) | GET | /api/analisis/historial | Header JWT | 200 con lista |
| Dashboard | GET | /api/dashboard | — | 200 con stats |
| ML Health | GET | http://localhost:8000/health | — | 200 {status: ok} |
| ML Predict | POST | http://localhost:8000/predict | consumo_kwh: 420 ... | 200 con categoría |

### 31.3 Pruebas del Modelo ML

```bash
python train_model.py
```

Output esperado incluye:
- `accuracy_score` por modelo.
- `f1_score (weighted)` por modelo.
- `classification_report` con precision, recall y F1 por clase.
- Tabla comparativa final.

### 31.4 Pruebas del Frontend

⏳ **Pendiente de Implementación.** Se recomienda implementar con Vitest + React Testing Library.

---

## 32. RIESGOS

### 32.1 Riesgos Técnicos

| ID | Riesgo | Probabilidad | Impacto | Mitigación |
|---|---|---|---|---|
| RT-01 | El microservicio ML no está disponible en producción | Alta | Medio | ✅ Lógica resiliente implementada en el backend |
| RT-02 | El modelo ML no tiene buena generalización con datos reales | Media | Alto | Validación con F1-Score weighted; posibilidad de reentrenar con datos reales |
| RT-03 | El Dockerfile del backend está vacío | Alta | Alto | Completar Dockerfile como tarea prioritaria |
| RT-04 | JWT Secret hardcodeado en desarrollo | Media | Alto | Uso de variables de entorno; secret por defecto solo para dev |
| RT-05 | CORS configurado con allowedOriginPatterns = * | Baja | Medio | Aceptable para MVP; restringir en producción |
| RT-06 | Frontend URL hardcodeada a localhost | Alta | Alto | Configurar con variables de entorno Vite en producción |

### 32.2 Riesgos Operacionales

| ID | Riesgo | Probabilidad | Impacto | Mitigación |
|---|---|---|---|---|
| RO-01 | Pérdida de datos en H2 embebido | Baja | Alto | Migrar a PostgreSQL en producción |
| RO-02 | Saturación del endpoint de análisis | Baja (MVP) | Medio | Implementar rate limiting |
| RO-03 | Tamaño del modelo ML vs. Precisión | Baja | Bajo | Modelo liviano y eficiente |

### 32.3 Riesgos de Seguridad

| ID | Riesgo | Probabilidad | Impacto | Mitigación |
|---|---|---|---|---|
| RS-01 | Exposición del JWT Secret en logs | Media | Alto | Configurar nivel de log en producción |
| RS-02 | Acceso al endpoint /api/dashboard sin autenticación | Baja | Bajo | Ruta intencionalmente pública para demostración |
| RS-03 | Sin rate limiting en endpoints de login | Media | Medio | ⏳ Pendiente de Implementación |

### 32.4 Riesgos de Escalabilidad

| ID | Riesgo | Probabilidad | Impacto | Mitigación |
|---|---|---|---|---|
| RE-01 | Una sola instancia OCI para backend + ML | Alta | Alto | Separar en instancias independientes en producción |
| RE-02 | Base de datos H2 no escala | Alta | Alto | Migrar a PostgreSQL administrado OCI |

---

## 33. ROADMAP

### 33.1 Versión 1.1 (Post-Hackathon Inmediato)

| Tarea | Prioridad |
|---|---|
| Completar Dockerfile del backend | Alta |
| Implementar pruebas unitarias en backend | Alta |
| Configurar variable de entorno para la URL de la API en el frontend | Alta |
| Implementar rate limiting en endpoints de autenticación | Alta |
| Restringir CORS en producción | Media |
| Completar GlobalExceptionHandler con respuestas de error estructuradas | Media |

### 33.2 Versión 1.2 (Funcionalidades Pendientes del Hackathon)

| Tarea | Prioridad |
|---|---|
| Procesamiento por lotes (CSV upload) | Alta |
| Alertas automáticas de alto consumo | Media |
| Comparación entre períodos históricos | Media |
| Historial filtrado por usuario autenticado (actualmente es historial global) | Alta |
| Implementar recuperación de contraseña por email | Media |

### 33.3 Versión 2.0 (Mejoras Futuras)

| Tarea | Descripción |
|---|---|
| Internacionalización (i18n) | Soporte para inglés y portugués además del español |
| OAuth2 / SSO | Login con Google o Microsoft |
| Dashboard por usuario | Estadísticas personalizadas por cuenta |
| Ranking de eficiencia | Comparación anónima entre perfiles de consumo |
| Simulación de escenarios | ¿Qué pasa si reduzco mi consumo un 20%? |
| Integración con medidores inteligentes | Ingesta automática de datos via IoT/API |
| Reentrenamiento continuo del modelo | Pipeline MLOps con nuevos datos de usuarios |
| Notificaciones push | Alertas cuando el consumo proyectado supera umbrales |
| Exportación de informes | PDF o Excel con el análisis y recomendaciones |
| API pública documentada con Swagger | Integración con terceros |
| Modo SaaS con facturación | Planes Free / Pro / Enterprise |

### 33.4 Optimizaciones Técnicas

| Área | Mejora Propuesta |
|---|---|
| Backend | Agregar caché con Spring Cache + Redis para el dashboard |
| Backend | Implementar paginación en el historial |
| ML | Reemplazar el dataset sintético con datos reales de consumo LATAM |
| ML | Experimentar con XGBoost o LightGBM para mayor precisión |
| OCI | Implementar Load Balancer para alta disponibilidad |
| Frontend | Implementar lazy loading de vistas |
| Frontend | Agregar PWA (Progressive Web App) para uso offline completo |

---

## 34. CONCLUSIONES

### 34.1 Estado Actual

EnergiAI es un MVP funcional de extremo a extremo que cumple con todos los requisitos obligatorios del hackathon. La plataforma integra exitosamente:

- Un modelo de Machine Learning entrenado y serializado (Random Forest) servido como microservicio FastAPI.
- Una API REST completa en Java/Spring Boot con autenticación JWT y persistencia relacional.
- Un frontend premium SaaS en React/TypeScript con diseño responsivo y soporte de modo oscuro.
- Un mecanismo de resiliencia que garantiza continuidad de servicio.
- Datos de ejemplo precargados para evaluación inmediata.

### 34.2 Cumplimiento del Hackathon

| Requisito | Estado |
|---|---|
| Análisis de patrones de consumo energético | ✅ Completado |
| Clasificación de perfiles (Eficiente/Moderado/Ineficiente) | ✅ Completado |
| Generación de recomendaciones de mejora | ✅ Completado |
| Estimación financiera (R$ 0,75/kWh) | ✅ Completado |
| API REST documentada | ✅ Completado |
| Mínimo tres ejemplos reales/simulados | ✅ 4 registros en V3 |
| Notebook con EDA y entrenamiento | ✅ EnergiAI_v1.ipynb |
| Modelo serializado | ✅ model.joblib |
| Integración con OCI | ✅ Arquitectura diseñada para OCI Compute + Object Storage |
| Validación de entrada | ✅ @Valid + manejo de errores |

### 34.3 Aspectos Destacables

1. **Resiliencia de doble capa**: tanto el backend como el frontend tienen lógica offline de respaldo, garantizando que la plataforma funcione en cualquier escenario de evaluación.
2. **Diseño Premium SaaS**: implementación de Glassmorphism, tipografía JetBrains Mono para métricas, modo oscuro con variables CSS y micro-animaciones.
3. **Dataset propio**: el equipo generó su propio dataset de consumo energético para el entrenamiento del modelo.
4. **Pipeline ML completo**: desde EDA (notebook) hasta serialización y servicio REST, con comparación de tres algoritmos.
5. **Acceso Demo de 1 clic**: facilita la evaluación del hackathon sin necesidad de configuración.
6. **Arquitectura escalable**: la separación en tres microservicios independientes permite escalar cada componente independientemente.

### 34.4 Posibles Mejoras

- Completar el Dockerfile para facilitar el despliegue contenerizado.
- Implementar pruebas automatizadas (unitarias e integración).
- Agregar paginación al historial para manejar grandes volúmenes de datos.
- Restringir CORS y configurar el JWT Secret adecuadamente para producción.
- Reentrenar el modelo con datos reales de consumo energético de LATAM para mejorar la precisión en producción.
- Filtrar el historial por usuario autenticado en lugar de devolver el historial global.

---

*Documento generado a partir del análisis completo del repositorio EnergiAI.*  
*Versión: 1.0 — Fecha: Julio 2026 — Equipo G9-LATAM-TEAM-60*  
*Estándar de referencia: IEEE 830/1016 adaptado a contexto de Hackathon LATAM*
