---
name: EnergiAI Visual Language
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#3c4a42'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#6c7a71'
  outline-variant: '#bbcabf'
  surface-tint: '#006c49'
  primary: '#006c49'
  on-primary: '#ffffff'
  primary-container: '#10b981'
  on-primary-container: '#00422b'
  inverse-primary: '#4edea3'
  secondary: '#006591'
  on-secondary: '#ffffff'
  secondary-container: '#39b8fd'
  on-secondary-container: '#004666'
  tertiary: '#855300'
  on-tertiary: '#ffffff'
  tertiary-container: '#e29100'
  on-tertiary-container: '#523200'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#6ffbbe'
  primary-fixed-dim: '#4edea3'
  on-primary-fixed: '#002113'
  on-primary-fixed-variant: '#005236'
  secondary-fixed: '#c9e6ff'
  secondary-fixed-dim: '#89ceff'
  on-secondary-fixed: '#001e2f'
  on-secondary-fixed-variant: '#004c6e'
  tertiary-fixed: '#ffddb8'
  tertiary-fixed-dim: '#ffb95f'
  on-tertiary-fixed: '#2a1700'
  on-tertiary-fixed-variant: '#653e00'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  title-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  container-max: 1280px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 32px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
---

## Brand & Style
The design system is built on a **Modern Corporate** aesthetic with a "wireframe-plus" philosophy. It prioritizes clarity and data density while maintaining a friendly, approachable interface for residential users. The visual style uses high-quality whitespace and systematic alignment to convey reliability and precision.

**Core Principles:**
- **Clarity over Decoration:** Every visual element serves a functional purpose in explaining energy consumption.
- **Accessible Sophistication:** Technical data is presented through a clean, professional lens that feels expert yet easy to navigate.
- **Sustainable Professionalism:** A mix of soft edges and rigid grids reflects the intersection of domestic comfort and technological efficiency.

## Colors
The palette is rooted in environmental and technological tones, optimized for a light-mode dashboard experience.

- **Primary (Energy Green):** `#10B981`. Used for positive actions, efficiency markers, and primary progress indicators.
- **Secondary (Sustainability Blue):** `#0EA5E9`. Used for informational highlights, data series in charts, and interactive links.
- **Accent (Alert Orange):** `#F59E0B`. Reserved for high-consumption warnings, optimization suggestions, and critical alerts.
- **Neutral (Slate Gray):** `#F8FAFC` (Background), `#E2E8F0` (Borders), and `#64748B` (Secondary Text). This provides the structural "wireframe" skeleton that holds the data.

## Typography
This design system utilizes **Inter** for its exceptional legibility in data-heavy environments. The scale is designed to create a clear path for the eye through complex dashboards.

- **Headlines:** Use SemiBold (600) or Bold (700) with slight negative letter-spacing to feel modern and "tight."
- **Data Points:** Numbers should use the same font but may be emphasized with larger sizes or primary color accents.
- **Labels:** Small labels use uppercase with increased tracking to differentiate them from body text and improve scanability in table headers.

## Layout & Spacing
The system follows a **12-column fluid grid** for desktop, transitioning to a **4-column grid** for mobile. 

- **Dashboard Layout:** A fixed left-hand sidebar (240px) with a fluid content area.
- **Vertical Rhythm:** Use a base 8px scale. All gaps between cards and sections should be multiples of 8.
- **Padding:** Content cards use 24px internal padding to ensure data visualizations have enough "breathing room" to be interpreted correctly.

## Elevation & Depth
To maintain the "wireframe-plus" look, this design system avoids heavy shadows in favor of **Tonal Layers** and **Low-Contrast Outlines**.

- **Level 0 (Background):** Slate-50 (#F8FAFC) serves as the canvas.
- **Level 1 (Cards/Containers):** Solid white surface with a 1px border in Slate-200 (#E2E8F0).
- **Level 2 (Active/Hover):** A very soft ambient shadow (0px 4px 12px rgba(0,0,0,0.05)) is used only when an element is interactive or being "lifted" during a drag action.
- **Interactive Elements:** Buttons and inputs use flat fills to maintain a clean, modern profile.

## Shapes
The shape language is consistently **Rounded**, softening the "wireframe" feel to make the application feel consumer-friendly.

- **Cards:** Use `rounded-lg` (16px) to define major content areas.
- **Buttons & Inputs:** Use `rounded-md` (8px) for a balanced, professional look.
- **Status Pills:** Use `rounded-full` (999px) for status indicators (e.g., "Optimized", "Active").

## Components
- **Buttons:** Primary buttons are solid Green-500 with white text. Secondary buttons use a Slate-100 background with Slate-900 text.
- **Cards:** The primary container for data. Always white with a 1px border. Use headers within cards to separate titles from the chart/content area.
- **Input Fields:** 1px Slate-300 border, 12px vertical padding. Focus state uses a 2px Blue-500 ring.
- **Data Tables:** Borderless rows with 1px Slate-100 bottom dividers. Header text is Label-sm style.
- **Energy Gauges:** Semi-circular or linear progress bars using the Primary (Green) for efficiency and Accent (Orange) for excessive use.
- **Status Chips:** Small, low-opacity background chips (e.g., Green-100 background with Green-700 text) for at-a-glance status updates.