---
name: Research Group Design System
colors:
  surface: '#f7f9fb'
  surface-dim: '#d8dadc'
  surface-bright: '#f7f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f6'
  surface-container: '#eceef0'
  surface-container-high: '#e6e8ea'
  surface-container-highest: '#e0e3e5'
  on-surface: '#191c1e'
  on-surface-variant: '#45464d'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eff1f3'
  outline: '#76777d'
  outline-variant: '#c6c6cd'
  surface-tint: '#565e74'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#131b2e'
  on-primary-container: '#7c839b'
  inverse-primary: '#bec6e0'
  secondary: '#515f74'
  on-secondary: '#ffffff'
  secondary-container: '#d5e3fd'
  on-secondary-container: '#57657b'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#001f26'
  on-tertiary-container: '#0090a9'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dae2fd'
  primary-fixed-dim: '#bec6e0'
  on-primary-fixed: '#131b2e'
  on-primary-fixed-variant: '#3f465c'
  secondary-fixed: '#d5e3fd'
  secondary-fixed-dim: '#b9c7e0'
  on-secondary-fixed: '#0d1c2f'
  on-secondary-fixed-variant: '#3a485c'
  tertiary-fixed: '#acedff'
  tertiary-fixed-dim: '#4cd7f6'
  on-tertiary-fixed: '#001f26'
  on-tertiary-fixed-variant: '#004e5c'
  background: '#f7f9fb'
  on-background: '#191c1e'
  surface-variant: '#e0e3e5'
typography:
  display-xl:
    fontFamily: Space Grotesk
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Space Grotesk
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Space Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1.4'
    letterSpacing: 0.05em
  mono-label:
    fontFamily: monospace
    fontSize: 12px
    fontWeight: '400'
    lineHeight: '1'
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 8px
  container-max: 1280px
  gutter: 24px
  margin: 32px
  section-gap: 80px
---

## Brand & Style
The design system is engineered to project a synthesis of academic rigor and high-performance computing innovation. It targets a dual audience of global research peers and industry partners, requiring an interface that is both intellectually serious and technologically advanced. 

The aesthetic follows a **Corporate Modern** approach with **Minimalist** foundations. It leverages a structured layout to evoke the precision of hardware engineering while maintaining a clean, breathable space for complex data consumption. To differentiate from standard corporate sites, this design system incorporates subtle technical textures—such as micro-grids and monospaced accents—to signal a "laboratory" environment where data and discovery are the primary focus.

## Colors
The palette is rooted in the depth and stability of "Deep Navy" and "Slate Gray," providing a sober, academic background. 
- **Primary:** A deep, authoritative navy used for typography, navigation, and structural elements.
- **Secondary:** A slate gray used for secondary information, metadata, and borders, ensuring a soft visual hierarchy.
- **Accent:** A vibrant "Electric Cyan" is reserved strictly for high-priority actions, data highlights, and active states. This color represents the energy of live computation.
- **Neutral:** A range of cool grays and off-whites that prevent the interface from feeling clinical, favoring a "paper-like" warmth for long-form research reading.

## Typography
This design system utilizes a tiered typographic approach to balance technical character with readability.
- **Headlines:** Space Grotesk is employed for all major headings. Its geometric, technical construction reinforces the Computer Engineering theme. 
- **Body:** Inter is used for all long-form content. Its high x-height and neutral personality ensure maximum legibility for dense research abstracts and technical documentation.
- **Labels:** For metadata (e.g., publication dates, author names), a combination of Inter and a system monospace font is used. Monospace elements should be used sparingly for version numbers, DOI codes, or hardware specifications to emphasize the "Engineering" identity.

## Layout & Spacing
The layout philosophy is based on a **Fixed 12-Column Grid** with a clear horizontal rhythm. 
- **Grid:** On desktop, the content is contained within a 1280px max-width wrapper to maintain line length for research papers.
- **Rhythm:** An 8px base-unit system governs all padding and margins, ensuring mathematical consistency across the UI.
- **Information Density:** The design system favors a medium-high density. While white space is used to separate distinct research projects, internal data tables and cards use tighter spacing to present complex information holistically without excessive scrolling.
- **Grid Overlays:** Subtle, 1px light-gray lines can be used as background decorations to visually represent the underlying grid, mimicking blueprints or circuit diagrams.

## Elevation & Depth
Depth is conveyed through **Tonal Layers** and **Low-Contrast Outlines** rather than heavy shadows, maintaining a flat, modern aesthetic.
- **Surfaces:** Use subtle shifts in background color (e.g., from white to a very light slate) to define different content zones.
- **Borders:** 1px borders in a semi-transparent slate are the primary method of separation. 
- **Shadows:** When necessary to indicate interactivity (like a hovering card), use a single, highly diffused ambient shadow: `0px 4px 20px rgba(15, 23, 42, 0.08)`.
- **Glassmorphism:** Use a subtle backdrop blur on navigation bars or modal overlays to maintain a sense of context and "high-tech" sophistication.

## Shapes
The shape language is precise and controlled. This design system uses a **Soft (Level 1)** roundedness setting.
- **Base Components:** 4px (0.25rem) radius for buttons and input fields to maintain a professional, engineering-grade feel.
- **Larger Containers:** 8px (0.5rem) radius for cards and modal windows.
- **Strictness:** Avoid full circles or "pill" shapes unless used for status indicators (e.g., "Active" or "Online" dots). The sharpness of the corners reflects the accuracy and rigor of computer engineering.

## Components
- **Buttons:** Primary buttons use a solid Deep Navy background with white text. Ghost buttons use a 1px Slate border. The Electric Cyan accent is used only for "Success" or specific "Run/Execute" actions.
- **Research Cards:** Containers for publications include a headline in Space Grotesk, a small monospace label for the conference name (e.g., "ISCA 2024"), and a brief abstract in Inter.
- **Chips/Tags:** Use a light slate background with no border and small, uppercase labels. These are used for research areas like "Parallel Computing" or "Computer Architecture."
- **Inputs:** Clean, 1px bordered boxes that highlight with an Electric Cyan border when focused. 
- **Data Visualizations:** Charts should exclusively use the accent palette (Cyangradient, Slate, and Navy) to ensure they feel like an integrated part of the research, rather than third-party plugins.
- **Code Blocks:** A dark-themed container (Deep Navy) with syntax highlighting that utilizes the Electric Cyan accent for keywords.