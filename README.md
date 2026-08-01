# CYGNUS — HUMAN × MACHINE

> **THE NEXT EVOLUTION OF INTERACTION.**  
> Competition submission web experience built for **IIT Bombay Techfest**.

---

## Overview

**CYGNUS — HUMAN × MACHINE** is an award-grade interactive 3D web experience designed to explore the convergence of biological human cognition and synthetic machine intelligence. Built from the ground up with high performance, adaptive WebGL graphics, Web Audio API sound synthesis, and futuristic HUD interface aesthetics, CYGNUS demonstrates a seamless bridge between biological reasoning and synthetic micro-latency execution.

> **[DEMO NOTICE]**: CYGNUS is an original concept submission for IIT Bombay Techfest. All competition event tracks, schedule slots, and partner cards are structured concept placeholders and demo data.

---

## Inspiration

CYGNUS draws inspiration from sci-fi operating systems, advanced cybernetic interfaces, and neural computing research. The platform explores a world where biological synaptic networks and artificial neural nodes communicate in real-time, giving human intuition the raw compute power of synthetic systems.

---

## Features

- **3D Interactive CYGNUS Core**: Powered by Three.js featuring an inner wireframe icosahedron, outer wireframe shell, floating data nodes, orbital energy rings, force-field cursor reaction, and interactive **Core Click Pulse** effects.
- **Human × Machine Convergence Visualizer**: Interactive parameter matrix (Neural Bandwidth, Machine Autonomy, System Adaptation) allowing users to tweak 3D rendering parameters live.
- **Competitions Matrix**: Filterable showcase of major technology tracks (Robotics, AI, Cybersecurity, Aerospace, Bio-Tech, Web3) with instant search and detailed modal dialogs.
- **Interactive Terminal CLI**: In-browser command-line emulator (`CYGNUS://`) with command history navigation (Up/Down arrow keys) and commands (`help`, `status`, `about`, `events`, `matrix`, `scan`, `core`, `protocol`, `clear`).
- **Holographic Visitor Pass Generator**: Real-time 2D Canvas badge renderer creating sharp, downloadable PNG passes with unique pass IDs (`CYG-2026-XXXX`).
- **Web Audio Sound System**: Procedural sound synthesizer providing hover bleeps, click feedback, modal chimes, and resonant core pulses. Muted by default with a visible HUD header toggle.
- **Fullscreen Mobile Navigation**: Fully responsive overlay navigation menu optimized for mobile touchscreens.

---

## Technical Architecture

CYGNUS is built with a decoupled ES module architecture prioritizing maximum rendering performance and zero framework bloat:

```
src/
├── data/           # Application data (events, schedule, partners, config)
│   ├── config.js
│   ├── events.js
│   ├── schedule.js
│   └── partners.js
├── js/             # Core application engines
│   ├── audio.js            # Web Audio API synthesizer
│   ├── badge.js            # Canvas 2D badge pass generator
│   ├── cursor.js           # Magnetic custom cursor & reticle
│   ├── eventsModal.js      # Events matrix & modal dialog manager
│   ├── scene2dFallback.js  # 2D Canvas fallback engine
│   ├── scene3d.js          # Three.js WebGL scene & pulse engine
│   ├── terminal.js         # Interactive CLI emulator with history
│   ├── timeline.js         # Tabbed schedule timeline
│   └── main.js             # Main application coordinator
├── styles/         # Modular CSS system
│   ├── reset.css
│   ├── variables.css       # Centralized design tokens
│   ├── main.css
│   └── components.css
└── utils/          # Performance & capability utilities
    └── performance.js      # Adaptive GPU quality monitor
```

---

## Technologies

- **Core**: HTML5, Vanilla JavaScript (ES Modules), CSS3 (Custom properties, HUD glassmorphic borders)
- **3D & FX**: `Three.js` (WebGL particle core, wireframes, orbital rings, raycasting)
- **Audio Engine**: Web Audio API (Procedural synth wave generators)
- **Icons & Fonts**: Google Fonts (`Orbitron`, `Space Grotesk`, `Inter`, `JetBrains Mono`)
- **Build System**: `Vite` for rapid development and optimized static production bundling

---

## 3D Experience & Physics

The hero 3D core combines multiple geometric layers:
1. **Core Wireframe Icosahedron**: Represents the central biological/synthetic processor.
2. **Outer Wireframe Octahedron**: Serves as a tactical force-field boundary.
3. **Dual Torus Orbital Rings**: Rotate dynamically on separate axes.
4. **Force-Field Particle Sphere**: Particles react to mouse position by warping away from the reticle using inverse distance physics.
5. **Core Click Pulse**: Clicking the core unleashes a radial shockwave, camera shake, sound wave, and HUD toast notification.

---

## Interaction Design

- **Custom Reticle Cursor**: Features a central point, outer magnetic trailing ring, and interactive hover expansion state. Automatically disabled on mobile touch devices and reduced-motion environments.
- **Keyboard Navigation**: Full support for `Escape` to close modal overlays, terminal blur, and `ArrowUp`/`ArrowDown` for terminal command history.

---

## Audio System

The audio engine uses the Web Audio API to generate real-time synthesized frequencies:
- **Hover**: High pitch sine wave chirp (`880Hz` to `1100Hz`).
- **Click**: Triangle wave click sound (`440Hz` to `220Hz`).
- **Core Pulse**: Low resonant bass drop (`140Hz` to `60Hz`).
- **Modal Open**: Ascending sine wave chime.

*Audio starts muted by default and complies strictly with browser autoplay policies.*

---

## Badge Generator

The Visitor Pass Generator uses HTML5 Canvas 2D to render a 800x1120 resolution badge pass:
- Inputs: Name, College/Institution, Track Domain.
- Features: Generated unique ID, holographic tech notches, cyber avatar wireframe, simulated barcode graphics, and clean PNG download output (`CYGNUS-DEMO-PASS-[NAME].png`).

---

## Responsive Design

Tested and verified across multiple screen resolutions:
- Mobile: `320px`, `360px`, `390px`, `430px`
- Tablet: `768px`, `1024px`
- Desktop & 4K: `1280px`, `1440px`, `1920px`, `3840px`

On mobile devices, WebGL complexity and particle density are automatically reduced for optimal battery and rendering efficiency.

---

## Performance Profiles

The `PerformanceManager` continuously monitors frame rates and adjusts rendering parameters automatically:
- **HIGH**: Full particle count (2400), max pixel ratio 2.0, dual orbital rings.
- **MEDIUM**: Reduced particle count (1200), max pixel ratio 1.5.
- **LOW**: Minimal particle count (500), max pixel ratio 1.0, 2D fallback ready.

---

## Accessibility

- **Semantic HTML5**: Native `<header>`, `<main>`, `<section>`, `<nav>`, `<footer>` elements.
- **ARIA Attributes**: `role="dialog"`, `aria-modal="true"`, `aria-label` tags on controls and search inputs.
- **Reduced Motion**: Full support for `prefers-reduced-motion: reduce` (disables particle movement and custom reticle).

---

## Installation & Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/user/cygnus-human-machine.git
   cd cygnus-human-machine
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Launch development server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```

5. Preview production build:
   ```bash
   npm run preview
   ```

---

## Demo Recording Script (60–120 Seconds)

To capture a video demonstration of CYGNUS:

1. **00:00 – 00:15 [Hero 3D Core]**:
   - Showcase the rotating 3D CYGNUS Core, reticle cursor interaction, live UTC clock, and countdown bar.
   - Click the 3D Core to trigger the `CYGNUS CORE // SYNC INITIALIZED` visual pulse.

2. **00:15 – 00:35 [Convergence Matrix]**:
   - Scroll to Section 01.
   - Move the Biological vs Synthetic slider and tweak the Neural Bandwidth and Autonomy sliders to demonstrate real-time 3D particle changes.

3. **00:35 – 00:55 [Competitions & Modal]**:
   - Scroll to Section 02.
   - Filter tracks by category (e.g. `ROBOTICS`, `AI & ML`), type a search query, and click `DETAILS` to inspect the modal dialog.

4. **00:55 – 01:10 [Terminal CLI]**:
   - Scroll to Section 04.
   - Type commands `help`, `status`, `scan`, `matrix` in the `CYGNUS://` input field. Demonstrate Up/Down arrow history.

5. **01:10 – 01:30 [Badge Pass Generator]**:
   - Scroll to Section 05.
   - Enter attendee name and college, select track domain, and click `DOWNLOAD HOLOGRAPHIC PASS (PNG)`.

---

## Future Improvements

- Integration with official IIT Bombay Techfest API endpoints when verified schedules and registration links are published.
- WebGPU rendering pipeline for ultra-high density particle fluid dynamics.
- Extended Web Audio ambient soundscape tracks.
