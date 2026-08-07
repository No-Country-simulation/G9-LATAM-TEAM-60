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
  secondary: '#565e74'
  on-secondary: '#ffffff'
  secondary-container: '#dae2fd'
  on-secondary-container: '#5c647a'
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
  secondary-fixed: '#dae2fd'
  secondary-fixed-dim: '#bec6e0'
  on-secondary-fixed: '#131b2e'
  on-secondary-fixed-variant: '#3f465c'
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
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 40px
  container-max: 1440px
---

## Brand & Style
The design system is rooted in **Eco-Minimalism**. It combines the precision of a high-end data platform with the organic sensibilities of sustainability. The interface aims to evoke a sense of clarity, urgency, and optimism, positioning energy efficiency not as a chore, but as a sophisticated optimization challenge.

The style utilizes a **Corporate Modern** foundation with a **High-Contrast** edge to ensure data density remains legible. By using expansive whitespace and a purposeful primary emerald, the UI feels breathable and professional, avoiding the cluttered "dashboard fatigue" common in enterprise software.

## Colors
The palette is dominated by "Emerald 600" as the primary driver for action and success states. "Dark Slate" provides a grounded, authoritative feel for typography and structural elements.

- **Primary (Emerald):** Used for primary buttons, success charts, and active navigation states.
- **Secondary (Dark Slate):** Used for high-emphasis text and dark-mode surfaces.
- **Accents (Amber/Red):** Reserved strictly for warnings, energy waste alerts, and critical system status changes to ensure immediate visual triage.
- **Neutrals:** A range of cool greys (Slate) used for borders, secondary text, and subtle background layering.

## Typography
This design system utilizes **Inter** for all primary interface elements to ensure maximum legibility and a contemporary feel. To emphasize the "AI" and data-driven nature of the product, **JetBrains Mono** is introduced for labels, data points, and metric units.

- **Headlines:** Utilize tight letter-spacing and semi-bold weights to create a strong visual anchor.
- **Data Display:** Numerical values in dashboards should use the Label styles to distinguish "readings" from "interface text."
- **Scale:** Maintain a clear vertical rhythm using a 4px baseline grid.

## Layout & Spacing
The system employs a **Fluid Grid** with fixed maximum constraints. 

- **Desktop (1280px+):** 12-column grid, 24px gutters, 40px side margins.
- **Tablet (768px - 1279px):** 8-column grid, 20px gutters, 24px side margins.
- **Mobile (<767px):** 4-column grid, 16px gutters, 16px side margins.

Spacing follows a geometric scale (4, 8, 12, 16, 24, 32, 48, 64) to ensure consistent padding within cards and layout sections. Dashboard widgets should use a "Masonry" logic or fixed-height rows to maintain alignment across data visualizations.

## Elevation & Depth
Depth is created through **Tonal Layers** and subtle **Ambient Shadows** rather than heavy skeuomorphism. 

1. **Level 0 (Background):** Base surface in Slate 50.
2. **Level 1 (Cards/Widgets):** White background with a 1px border in Slate 200 and a very soft, diffused shadow (0px 4px 12px rgba(15, 23, 42, 0.05)).
3. **Level 2 (Overlays/Dropdowns):** White background with a more pronounced shadow (0px 8px 24px rgba(15, 23, 42, 0.10)) to indicate interactivity and z-axis priority.

Interactive elements (buttons) do not use shadows on rest but may gain a slight "lift" on hover via shadow expansion.

## Shapes
The shape language is "Soft-Modern," using a consistent **12px (0.75rem)** radius for primary containers and cards. 

- **Small Components:** Checkboxes and small tags use 4px or 6px.
- **Main Components:** Buttons, Inputs, and Cards use 12px.
- **Large Components:** Hero sections or large modal containers use 24px (`rounded-xl`).

## Components
- **Buttons:** Primary buttons are solid Emerald with white text. Secondary buttons use a ghost style (Slate border, Slate text). Use 12px rounding and uppercase Label-sm typography for a technical feel.
- **Inputs:** Clean, 12px rounded borders. On focus, the border transitions to Primary Emerald with a 2px outer glow.
- **Cards:** The primary container for data. Always includes a 1px border. Titles should be Headline-md.
- **Data Widgets:** Use sparklines for quick trends. Backgrounds of widgets can use a very light Emerald tint (Emerald 50) to indicate positive performance.
- **Chips/Status:** Use the Label-sm font. Success chips are Emerald-soft; Warning chips are Amber-soft. Icons should be 16px stroke-based (2px weight) for clarity.
- **Progress Bars:** Thin, 8px height with fully rounded caps. Use Primary Emerald for progress and Slate 100 for the track.