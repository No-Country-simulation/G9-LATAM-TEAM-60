# ⚡ EnergiAI - Frontend Application

> **Plataforma Web Frontend de Análisis y Diagnóstico Energético con IA**  
> Desarrollado con **React 18**, **TypeScript**, **Vite** y **Vanilla CSS (Design Tokens)** para la Hackathon **ONE G9 - LATAM (Equipo 60)**.

![React](https://img.shields.io/badge/React-18.3.1-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-3178C6?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-5.4.1-646CFF?logo=vite)
![Design](https://img.shields.io/badge/Design-Glassmorphism%20%26%20Pastel-ff69b4)

---

## 📋 Tabla de Contenidos

- [✨ Características y Diseño UI/UX](#-características-y-diseño-uiux)
- [🛠️ Tecnologías Utilizadas](#️-tecnologías-utilizadas)
- [📂 Estructura de Carpetas](#-estructura-de-carpetas)
- [⚙️ Instalación y Ejecución Local](#️-instalación-y-ejecución-local)
- [🔌 Integración con Backend y Microservicio ML](#-integración-con-backend-y-microservicio-ml)
- [🌍 Internacionalización y Multi-Moneda](#-internacionalización-y-multi-moneda)
- [📄 Exportación de Informes en PDF](#-exportación-de-informes-en-pdf)

---

## ✨ Características y Diseño UI/UX

### 🎨 Estética Premium y Descansada
- **Fondo Animado Ambiental (`AmbientBackground.tsx`)**: Sistema dinámico de partículas flotantes, orbes con resplandor neón y mallas tecnológicas adaptadas automáticamente al modo claro y oscuro.
- **Paleta de Colores Pasteles Suaves**: Modo claro optimizado para la salud visual (*soft sage teal*, crema porcelana y resplandores amigables).
- **Glassmorphism & Micro-interacciones**: Transiciones suaves, efectos hover en tarjetas y sombras profundas con desenfoque de fondo (`backdrop-filter`).

### 📱 Diseño Ultra-Responsive (Mobile First & Desktop)
- Totalmente optimizado para pantallas móviles estrechas (320px–502px), tablets y escritorios de alta resolución.
- **Drawer de Navegación Móvil**: Menú lateral deslizable con selector de país integrado.
- Modales (`AuthModal`, `ResultsModal`) responsivos que se adaptan a cualquier resolución sin desbordamientos de pantalla.

### ⚡ Diagnóstico Energético en Tiempo Real
- **Simulador Interactivo (`SimulationForm.tsx`)**: Controles de deslizamiento (sliders) dinámicos para ajustar consumo (kWh), horas en alto consumo, equipos conectados y horario pico.
- **Resultados e Indicadores (`ResultsModal.tsx`)**: Clasificación por categoría de consumo (**Eficiente**, **Moderado**, **Ineficiente**), indicador numérico de probabilidad y estimación de costos mensuales.
- **Calculadora de Huella de Carbono**: Cálculo interactivo de kg CO₂ emitidos y equivalencias ecológicas (árboles necesarios, km recorridos en automóvil y cargas de teléfono inteligente).

---

## 🛠️ Tecnologías Utilizadas

- **Core**: React 18, TypeScript, Vite
- **Estilos**: Vanilla CSS con variables nativas de CSS (Design Tokens)
- **Iconografía**: `lucide-react`
- **Generación de Reportes PDF**: `jspdf` + `html2canvas`
- **Linter & Formateador**: Oxlint (`.oxlintrc.json`)

---

## 📂 Estructura de Carpetas

```text
Frontend/
├── public/                     # Favicon, íconos SVG y activos estáticos
├── src/
│   ├── assets/                 # Ilustraciones, diagramas e imágenes promocionales
│   ├── components/             # Componentes de la interfaz de usuario
│   │   ├── AmbientBackground.tsx # Sistema de partículas y resplandor ambiental
│   │   ├── AuthModal.tsx       # Modal de Login y Registro de usuarios
│   │   ├── ConfiguracionView.tsx # Panel de configuración y preferencias
│   │   ├── DashboardView.tsx   # Vista principal de analíticas y métricas
│   │   ├── HeroSection.tsx     # Sección de bienvenida y llamados a la acción
│   │   ├── HistoryView.tsx     # Historial completo de análisis guardados
│   │   ├── LandingPage.tsx     # Página principal de aterrizaje
│   │   ├── Navbar.tsx          # Barra de navegación superior responsiva
│   │   ├── ResultsModal.tsx    # Modal de dictamen y recomendaciones IA
│   │   ├── Sidebar.tsx         # Menú lateral para la aplicación principal
│   │   └── SimulationForm.tsx  # Formulario interactivo del simulador
│   ├── context/                # Proveedores de estado global (Context API)
│   │   ├── AuthContext.tsx     # Manejo de JWT, sesión de usuario y autenticación
│   │   ├── CountryContext.tsx  # Selección de país, región y moneda
│   │   ├── ThemeContext.tsx    # Control del tema (Claro / Oscuro)
│   │   └── ToastContext.tsx    # Notificaciones flotantes en pantalla
│   ├── services/
│   │   └── api.ts              # Cliente HTTP con Axios / Fetch para Spring Boot (8080)
│   ├── types/
│   │   └── index.ts            # Interfaces TypeScript y DTOs del sistema
│   ├── utils/
│   │   ├── country.ts          # Configuración de países (Chile, Argentina, Brasil, USD)
│   │   ├── currency.ts         # Formateadores financieros multi-moneda
│   │   ├── i18n.ts             # Textos y traducciones de la interfaz
│   │   └── pdfExporter.ts      # Generador ejecutable de informes PDF
│   ├── App.tsx                 # Enrutador y contenedor principal de la aplicación
│   ├── main.tsx                # Punto de entrada de React
│   └── index.css               # Sistema de diseño global, tokens y temas CSS
├── index.html                  # HTML principal de la aplicación SPA
├── package.json                # Dependencias y scripts de Vite/React
├── tsconfig.json               # Configuración de TypeScript
└── vite.config.ts              # Configuración de entorno Vite
```

---

## ⚙️ Instalación y Ejecución Local

### Prerrequisitos
- **Node.js** (v18.0.0 o superior)
- **npm** (v9.0.0 o superior)

### Pasos de Instalación
1. Navega a la carpeta `Frontend`:
   ```bash
   cd Frontend
   ```
2. Instala las dependencias del proyecto:
   ```bash
   npm install
   ```
3. Inicia el servidor de desarrollo Vite:
   ```bash
   npm run dev
   ```
4. Abre tu navegador e ingresa a: `http://localhost:5173`

---

## 🔌 Integración con Backend y Microservicio ML

El Frontend se conecta a dos servicios principales en modo de desarrollo:

- **Spring Boot Backend API**: `http://localhost:8080/api`
  - `/api/auth/login` y `/api/auth/register` (Autenticación JWT)
  - `/api/analisis-energetico` (Guardado de simulación y llamada al pipeline ML)
  - `/api/dashboard` (Estadísticas consolidadas e historial)
- **FastAPI Machine Learning Service**: `http://localhost:8000`
  - Servicio de respaldo directo en caso de consulta individual de inferencia.

---

## 🌍 Internacionalización y Multi-Moneda

La plataforma soporta localización adaptada para países de la región LATAM mediante `CountryContext.tsx`:

| País / Selección | Moneda | Formato | Región ML de DataScience |
| :--- | :---: | :---: | :---: |
| 🇨🇱 Chile | CLP | `$ X.XXX CLP` | Centro / Norte / Sur |
| 🇦🇷 Argentina | ARS | `$ X.XXX ARS` | Centro / Norte / Sur |
| 🇧🇷 Brasil | BRL | `R$ X.XXX BRL` | Centro / Norte / Sur |
| 🌎 Internacional | USD | `$ X.XX USD` | Centro / Norte / Sur |

---

## 📄 Exportación de Informes en PDF

Desde el modal de resultados (`ResultsModal.tsx`), los usuarios pueden presionar el botón **"Exportar PDF"**, lo que activa la utilidad `pdfExporter.ts`. Esta herramienta captura el informe detallado del diagnóstico energético (categoría, consumo en kWh, desglose financiero, huella de carbono y lista de recomendaciones) y descarga un documento **PDF comprimido** de calidad profesional en la máquina del usuario.
