# Elementa UI Design Blueprints & Archetype Playbook (`learnings-from-past.md`)

> **Purpose of This File**:
> Whenever a screen, dashboard, or section design is finalized with the user, document **how to design and construct that UI archetype step-by-step** in this file.
> Do **not** write vague retrospective notes. Instead, write **predictable, repeatable UI construction blueprints** (spatial layout, elevation layers, typography hierarchy, token pairings, control bar anatomy, and responsive behavior) so that in the future, any AI agent asked to build a similar UI (e.g., a Financial App Dashboard, an Interactive Data Explorer, or an Editorial Hero) can reproduce Elementa's exact aesthetic and structural standards with 100% predictability.

---

## How to Document a New Finalized UI Archetype

Every time a UI screen or section is finalized, append a new **Archetype Blueprint** using this structure:
1. **Archetype Name & Use Case**: What type of screen/section it is (e.g., *Financial Portfolio Dashboard*, *Interactive Token Matrix*, *Centered Orbital Hero*).
2. **Spatial & Container Anatomy**: Viewport height, max-width (`max-w-[1440px]`), section padding (`py-24 px-4 sm:px-8`), and section boundary treatment (`bg-bg-base-accent-primary border-y border-stroke-base-primary` when alternating between `bg-bg-base-primary` sections).
3. **Typography & Header Hierarchy**: Exact alignment (centered vs. split), font family (`font-heading` Rowan vs. `font-sans` Satoshi vs. `font-mono` JetBrains Mono), and heading-to-subtitle spacing (`gap-3` / `12px`).
4. **Component & Surface Composition**: Step-by-step breakdown of the controls, tables, cards, charts, or visual artifacts inside the section, including which elevation layer (`base`, `flat`, `elevated`, `glass`) each element occupies.
5. **Interactive Affordances & Anti-Patterns**: How interactive triggers (buttons, selects, switches, copy actions) differentiate from passive decorative elements, and what clutter to omit (e.g., no decorative badges above headings).

---

## Archetype 01: Centered Editorial Hero with Orbital 3D Brand Artifacts

**Use Case**: Primary landing heroes for foundational pillars, product showcases, or brand narratives where a strong central thesis is framed by floating, tactile 3D artifacts.

### 1. Spatial & Container Anatomy
- **Viewport & Alignment**: Full viewport height (`min-h-screen w-full`) using flex column centering (`flex flex-col items-center justify-center px-4 py-20 sm:px-8`) on `bg-bg-base-primary`.
- **Center Focal Cluster**: Constrain the central narrative column to `max-w-3xl text-center` at `z-20` so it sits cleanly inside the orbital ring without vertical offset.
- **5-Point Orbital Arch (`lg` and above)**: Position 5 floating elements around the centered narrative in a tight framing arch (never pushed to the far screen corners):
  - **Top-Left**: `top-[15%] left-[18%] xl:left-[22%]`
  - **Top-Right**: `top-[15%] right-[18%] xl:right-[22%]`
  - **Mid-Left**: `top-[46%] left-[10%] xl:left-[15%]`
  - **Bottom-Left**: `bottom-[15%] left-[20%] xl:left-[24%]`
  - **Bottom-Right**: `bottom-[15%] right-[20%] xl:right-[24%]`
- **Mobile Adaptation (`< 1024px`)**: Collapse floating orbital coordinates into a centered horizontal row (`flex flex-wrap items-center justify-center gap-4`) directly above the heading so 400px viewports remain balanced.

### 2. Typography & CTA Composition
- **No Decorative Badges**: Do not place pill badges above the hero `<Text variant={TextVariant.H1}>`. Start directly with the display headline.
- **Display Headline (`<Text variant={TextVariant.H1}>`)**: `font-heading text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-[1.06] text-text-primary`, with the emotional keyword highlighted in `text-text-brand-primary`.
- **Lead Subtitle**: `font-heading text-lg sm:text-xl font-semibold text-text-brand-secondary`.
- **Supporting Body Copy**: `max-w-xl text-sm sm:text-base leading-relaxed text-text-tertiary`.
- **Dual Action Bar**: Centered flex row (`gap-3 pt-2`) pairing a primary `<Button>` (`bg-bg-brand-primary text-text-on-brand-primary`) with a secondary `<Button>` (`bg-bg-brand-secondary text-text-on-brand-secondary`).
- **Scroll Indicator**: Pinned near the bottom (`bottom-6`), using `text-xs font-medium tracking-wide text-text-tertiary` and a subtle vertical bounce (`y: [0, 5, 0]`).

### 3. Tactile 3D Coin / Emblem Construction
- **Pure Brand Palette Stops**: Construct 3D metallic/tactile emblems directly from the 5 static brand ladders (`--ev-*`, `--dr-*`, `--ms-*`, `--tr-*`, `--gh-*`) using pure stops (`200` specular highlight, `300` rim text, `500` core face, `600` inner recess, `800` deep bevel, `900` 3D extruded edge)—never dilute with `bg-bg-base-primary` `color-mix`.
- **3D Motion Physics**: Combine gentle vertical float (`y: [0, -10, 0]`), 3D Y/X tilt (`rotateY: [-22, 22, -22]`, `rotateX: [12, -10, 12]`), a continuous `360deg` SVG circular inscription ring, and a diagonal specular sheen sweep.

---

## Archetype 02: Interactive Data Matrix / Token Explorer with Contextual Controls

**Use Case**: Dense reference matrices, semantic token inspectors, financial ledger tables, configuration registries, or multi-category data explorers that must remain compact and scannable without endless page scrolling.

### 1. Spatial & Section Separation
- **Section Boundary**: Wrap the entire section in `bg-bg-base-accent-primary border-y border-stroke-base-primary py-24 px-4 sm:px-8` to establish crisp architectural separation from adjacent `bg-bg-base-primary` sections.
- **Inner Container**: `mx-auto max-w-[1440px] flex flex-col gap-10`.

### 2. Section Header & Control Toolbar Anatomy
- **Top Section Header**: Centered `<Text variant={TextVariant.H2}>` (`font-heading text-3xl sm:text-5xl font-bold text-text-primary`) + centered subtitle (`max-w-2xl text-sm sm:text-base text-text-tertiary`), with zero badge clutter.
- **Unified Toolbar (`rounded-2xl border border-stroke-base-primary bg-bg-flat-primary p-4 sm:p-5`)**:
  - **Left — Search Input**: `<Input>` with leading search icon (`bg-bg-base-primary`) for instant keyword filtering.
  - **Center — Contextual Filter Toggle**: Compact pill container (`rounded-xl border border-stroke-base-primary bg-bg-base-primary px-3.5 py-2`) housing a `<Switch>` + `<Label>` (e.g., *Energy-Specific Only*) to isolate dynamic rows.
  - **Right — Active Context Selector**: `<Select>` dropdown (with live 4-channel color preview dots inside the trigger and items) to switch the active runtime context/energy and immediately recalculate connected values.

### 3. Tabbed View & Decoupled Category Header
- **Category `<TabsList>`**: Centered horizontal tab bar (`bg-bg-flat-primary border border-stroke-base-primary rounded-2xl p-1.5`) with active tab styled via `data-[state=active]:bg-bg-brand-primary data-[state=active]:text-text-on-brand-primary`.
- **Decoupled Category Heading Below Tabs**: Place the active category's `<Text variant={TextVariant.H3}>` (`font-heading text-2xl sm:text-3xl font-bold text-text-primary`) and descriptive sub-heading (`max-w-2xl text-sm sm:text-base text-text-tertiary`) in a dedicated centered block **below** the `<TabsList>` and **above** the `<Table>` (`mb-8 flex flex-col items-center gap-2 text-center`).

### 4. Architectural `<Table>` Design (No Card Bloat)
- **Table Container**: Render a single clean `<Table>` inside `overflow-hidden rounded-2xl border border-stroke-base-primary bg-bg-base-primary` (never wrap individual rows in separate `<Card>` components).
- **Column Structure**:
  1. **Column 1 — Primary Identifier / Tailwind Utility (`w-[34%]`)**:
     - Leading decorative category icon uses a **ghost ring affordance** (`border border-stroke-brand-primary/30 bg-transparent text-text-brand-primary`).
     - Primary token/item name in `font-mono text-sm font-semibold text-text-primary` + description in `text-xs text-text-tertiary`.
     - Trailing interactive copy `<Button>` uses an **elevated solid pill affordance** (`border border-stroke-base-secondary bg-bg-elevated-primary text-text-secondary hover:bg-bg-brand-primary hover:text-text-on-brand-primary`) so users never confuse decorative icons with clickable actions.
  2. **Column 2 — Secondary Identifier / CSS Variable (`w-[22%]`)**:
     - Monospace badge (`rounded-md border border-stroke-base-primary bg-bg-flat-primary px-2.5 py-1 font-mono text-xs text-text-secondary`) + copy button.
  3. **Columns 3 & 4 — Theme / Value Swatch Columns (`w-[22%]` each)**:
     - Keep value columns dedicated strictly to visual color swatches (`size-6 rounded-md border border-stroke-base-secondary`) and their human-readable scale label (`font-mono text-xs font-medium text-text-primary` + hex/value subtitle in `text-[11px] text-text-tertiary`).

---

## Archetype 03: Financial / Enterprise Analytics Dashboard Blueprint

**Use Case**: Predictable blueprint for designing high-density enterprise workspaces, financial app dashboards, telemetry monitors, and multi-panel operational views in Elementa.

### 1. Spatial & Elevation Layering (4-Layer Rule)
- **Canvas (`Layer 1 — Base`)**: Root shell uses `bg-bg-base-primary`. Left navigation rail (`240px` expanded / `64px` collapsed) uses `bg-bg-flat-primary border-r border-stroke-base-primary`.
- **Header Bar (`64px` height)**: Sticky top bar (`bg-bg-glass-primary backdrop-blur-md border-b border-stroke-base-primary px-6`) containing breadcrumb title on the left and global context controls (Date Range `<Select>`, Portfolio/Account switcher, Theme/Energy switcher) on the right.
- **Workspace Grid**: `max-w-[1600px] mx-auto p-6 sm:p-8 flex flex-col gap-8` using a 12-column CSS Grid (`grid-cols-1 md:grid-cols-12 gap-6`).

### 2. KPI Metric Strip (Top Row — Max 4 Cards)
- **Grid**: 4 equal columns (`col-span-12 sm:col-span-6 xl:col-span-3`).
- **Card Anatomy**: Flat container (`rounded-2xl border border-stroke-base-primary bg-bg-flat-primary p-6 flex flex-col justify-between gap-4`)—maximum 3 data points per card:
  1. **Metric Label**: `text-xs font-semibold uppercase tracking-wider text-text-tertiary` + subtle Ghost-bordered icon (`border border-stroke-base-secondary bg-transparent`).
  2. **Primary Value**: `font-mono text-2xl sm:text-3xl font-bold tracking-tight text-text-primary` (`tabular-nums`).
  3. **Delta / Variance Indicator**: Semantic status text (`text-text-status-positive-primary` for gains, `text-text-status-negative-primary` for drawdowns) paired with comparison period in `text-xs text-text-tertiary`.

### 3. Primary Chart & Allocation Split (Middle Row)
- **8 / 4 Asymmetric Split**:
  - **Left (`col-span-12 xl:col-span-8`) — Time-Series Performance Canvas**: Container on `bg-bg-flat-primary border border-stroke-base-primary rounded-2xl p-6`. Header pairs centered or left-aligned title with a compact timeframe `<TabsList>` (`1D`, `1W`, `1M`, `1Y`, `ALL`). Primary line/area series uses `--bg-brand-primary`; comparison benchmark uses `--bg-brand-secondary`.
  - **Right (`col-span-12 xl:col-span-4`) — Asset Allocation / Breakdown**: Ranked horizontal progress bars or donut breakdown using the 4 active energy channels (`--bg-brand-primary`, `--bg-brand-secondary`, `--bg-accent-primary`, `--bg-accent-secondary`) with `font-mono` percentage readouts.

### 4. Transaction / Ledger Section (Bottom Row)
- Reuse **Archetype 02 (Architectural `<Table>`)** directly below a section divider (`border-t border-stroke-base-primary pt-8`):
  - Toolbar with search `<Input>`, status `<Select>`, and export `<Button variant="outline">`.
  - Clean `<Table>` on `bg-bg-base-primary` with monospace transaction IDs, semantic status indicators, and right-aligned `font-mono tabular-nums` currency amounts.

---

## Archetype 04: Zero-Knowledge Landing & Authentication Page with Atmospheric Canvas, Dynamic Energy SVGs, and Glass Overlays

**Use Case**: Primary consumer-facing or enterprise login/signup landing pages, security credentials restoration, and cryptographic onboarding experiences.

### 1. Spatial & Elevation Layering (Border-Free Elevation)
- **Atmospheric Canvas**: Full-bleed WebGL / ASCII gradient canvas (`GradientASCII` fixed at `-z-0 opacity-30 pointer-events-none`) with color stops dynamically wired to the 4 color channels of the active `ENERGY_THEMES`.
- **Elevation Hierarchy**:
  - **Base Canvas**: `bg-bg-base-primary` with `relative z-10`.
  - **Primary Card Container**: `bg-bg-flat-primary shadow-md rounded-2xl p-6 sm:p-8` (no boundary border; elevation communicated purely via `shadow-md` and surface chromatic shift).
  - **Nested Callouts & Badges**: `bg-bg-raised-secondary shadow-md rounded-xl p-3.5` (e.g. Zero-Knowledge Architecture callouts and security feature strips).
  - **Modal / Overlay Surface**: `bg-bg-modal-primary/90 backdrop-blur-xl border-none shadow-2xl rounded-2xl` with glass effect.

### 2. Header & Energy Orchestration
- **Dynamic Energy Logo**: Renders `/icons/logo-small-${energy}.svg` reacting in real-time to active `useElementa()` context.
- **Mobile Responsive Header**: Forces inner energy label visibility on mobile viewports using `[&_div.hidden]:!flex [&_div.hidden]:!flex-col` to prevent icon-only truncation on narrow mobile screens.

### 3. Storyset Illustration Integration
- **5-Color Palette Mapping**: Uses 5 canonical brand primary codes (`ev`, `dr`, `ms`, `tr`, `gh`) to dynamically serve `/illus/recovery/recovery-${colorCode}.svg`.
- **Container Encasement**: Illustrations encased in `bg-bg-raised-secondary shadow-md rounded-2xl h-40` at the header of recovery modals.

### 4. Motion Physics & Micro-Interactions
- **Spring Login Transition**: On successful authentication, cross-fades the login form into an animated sanctuary unlocking card (`scale: 1, y: 0` with spring damping `22`, stiffness `280`) before programmatic routing.
- **Form State Feedback**: Real-time password confirmation validation with error alerts and disabled submit states.
