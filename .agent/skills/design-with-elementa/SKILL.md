---
name: design-with-elementa
description: >-
    Foundational guidelines containing the very basics of what makes the Elementa design system unique to deriva's identity. This skill can be used
    to design UI screens keeping in mind they are not AI generic, and showcase the true abilities of elementa.
---

# Frontend Design & Elementa UI/UX Architecture

> **Operational Scope & Synchronization Mandate**:
> 1. **UI/UX Design Principles Only**: This skill instructs on **how to design UI/UX screens, spatial layouts, visual hierarchy, color/energy orchestration, typography, motion physics, and editorial voice** using Elementa's design principles. It is **not** meant for code formatting, TypeScript conventions, or repository folder standards (consult `../coding-format/SKILL.md` for all coding standards).
> 2. **Reference Images = Inspiration, Never Copy-Paste**: Whenever screenshots, mockups, or reference images are attached in a prompt, use them strictly for **conceptual reference and structural inspiration**. Never copy-paste their literal chrome, generic dark-mode styling, or foreign color palettes. Reimagine the underlying workflow through Elementa's elevation layers, 5 brand hues, 10 dynamic energies, and `Rowan` / `Satoshi` typography.
> 3. **Predictable UI Blueprint Registry (`./learnings-from-past.md`)**: Before designing any screen, read `./learnings-from-past.md` to follow established Elementa UI archetypes. Once the user finalizes a screen design (e.g., a financial app dashboard, an interactive token matrix, or an editorial hero), document **how to design and construct that UI archetype step-by-step** in `./learnings-from-past.md` so future AI agents can build that class of UI with 100% predictability.
> 4. **Live Synchronization with `/DESIGN_SYSTEM.md`**: `/DESIGN_SYSTEM.md` at the repository root is the external-facing master specification used by Design AI Agents. Whenever `.agent/skills/design-with-elementa/SKILL.md` (or `learnings-from-past.md`) is updated, you **MUST** update `/DESIGN_SYSTEM.md` in the same turn so both files remain 100% synchronized without losing any context.

Approach this as the design lead at a design studio known for giving every client a distinct visual identity that is not mistaken for anyone else's. This client has already rejected proposals that felt cliché or templated, and is paying for a distinctive point of view: make deliberate, opinionated choices about palette, typography, and layout that are specific to this brief, and take aesthetic risk if justified.

## Ground your designs in the subject matter

If the brief does not identify what the product or subject matter is, identify it yourself before designing, and confirm with the client. You can come up with one concrete subject, the design's audience, and the design's primary job, as a proposal. If there's any information in your memory about the client's preferences or context about what they're building, use that as a hint. The subject's industry, subject matter, materials, and vernacular are where distinctive visual choices come from — a design for a toy for girls aged 8–11 will be very aesthetically different from a dashboard for financial analysts. Build with the brief's real content and subject matter throughout.

## Process: plan, review against the brief, build, critique

For calibration, AI-generated design right now clusters around some traits:
1. a warm cream background (near #F4F1EA) with a high-contrast serif display and a terracotta or warm-clay accent (often near #D97757 — Anthropic's own Claude-interaction accent, so on a user's brief it reads as a tell);
2. a near-black background with a single bright acid-green or vermilion accent;
3. a broadsheet-style layout with hairline rules, zero border-radius, and dense newspaper-like columns;
4. the SaaS-card kit: content chopped into identical rounded cards, one border-radius on everything regardless of hierarchy, the same soft grey shadow (rgba(0,0,0,.1)) under each, and gradient washes as decoration;
5. template chrome that appears whatever the subject: a tracked-out ALL-CAPS eyebrow label above every heading; meta strings joined with middle dots ('A · B · C'); labels built as 'WORD — fragment' with a spaced em dash; tinted near-black (#0B0B0B, #111) standing in for black; a monospace face for small data labels; a '→' appended to link and button text.
6. too much use of gradients, like putting everything under some form of gradient and just overusing it
7. no sense of creating complex and data driven cards. just give number, put border and we are done. no respect for elementa's hierarchy and IA foundations
8. putting numbers everywhere
9. don't bloat a single UI area. keep DRY and no cross-cutting principles in mind. elementa is clean at its core. conveys the message but wows the user
10. the fear to go bold with designs, background, layouts, that govern how a design truly comes out
11. the love towards small text size, everything small, to again, cramp up a given real estate

All traits are legitimate for some briefs, but they are defaults rather than choices, and they appear regardless of subject. Where the brief pins down a visual direction, follow it exactly — the brief's own words always win, including when it asks for one of these looks. Where it leaves an axis free, don't spend that freedom on one of these defaults. As with a hired human designer, there's often a careful balance between doing what you're good at and taking each project as a chance to experiment and learn.

Then review that plan against the brief before building: if any part of it reads like the generic default you would produce for any similar page (work through a similar prompt to see if you arrive somewhere similar) rather than a choice made for this specific brief — revise that part, say what you changed and why. Only after you've confirmed the relative uniqueness of your design plan should you proceed with the revised design.

## Restraint and self-critique

Spend your boldness in one place. Let one element be the memorable thing, keep everything around it quiet and disciplined, and cut any decoration that does not serve the brief. Build to a quality floor without announcing it: responsive down to mobile, visible keyboard focus, reduced motion respected, visually accessible, harmonious color palettes. Critique your own work as you build, taking screenshots to review if your environment supports it — a picture is worth 1000 tokens. Consider Chanel's advice: before leaving the house, take a look in the mirror and remove one accessory. Human creatives have memory and always try to do something new, so if you have a space to quickly jot down notes about what you've tried, it can help you in future passes.

## More on writing in design

Words appear in a design for one reason: to make it easier to understand and use. They are design content, not decoration. Bring the same intentionality and minimalism to copywriting that you would bring to spacing and color. Before writing anything, ask what the design needs to say, and how it can best be said to help the person navigate the experience.

Write from the end user's perspective. Name things by what users will understand in simple language, not by how the system is built. A user manages notifications, not webhook config. Describe what something is or does in plain terms rather than selling it. Being specific and legible to new users is always better than being clever.

Use active voice as default. A CTA says exactly what happens when it is used: "Save changes," not "Submit." An action keeps the same name through the whole flow, so the button that says "Publish" produces a toast that says "Published." The vocabulary of an interface is the signposting for someone navigating the product. Cohesion and consistency are how people learn their way around.

Treat failure and emptiness as moments for direction, not mood. Explain what went wrong and how to fix it, in the interface's voice rather than a person's. Errors don't apologize, and they are never vague about what happened. An empty screen is an invitation to act.

Keep the tone conversational: plain verbs, sentence case, no filler, with tone matched to the brand and the audience. Let each written element do exactly one job.

---

# Elementa UI Foundations & Design Philosophy

## 1. Problem and Solution
Deriva has a portfolio of more than 5 products. All these products solve a separate user problem. Each product has its own unique set of problems and product features. However, Deriva aims to provide a seamless experience to the end user with these products irrespective of the problems these solve. That’s where **elementa-ui** comes into the picture.

Built upon the robust foundations of shadcn-ui, elementa-ui extends the "headless" component philosophy by injecting Deriva’s unique visual DNA—the elementa design library. It re-uses UI components from shadcn-ui to prevent re-inventing the wheel.

By providing one design system to design all the products, it helps solve multiple problems for the brand:
1. **Unified Portfolio Experience**: It keeps the UI/UX of all different apps consistent; this provides the end-user a feeling of seamless transition from one product to another in the same portfolio.
2. **Effortless UI Development**:
   - Reusable components
   - Reusable configs
   - Single repository to maintain
3. **High-Velocity Development**: Decision-making overhead is eliminated with clear system invariants.
4. **Instant Prototyping**: Easy to prototype UI designs out of the box with production-grade components.
5. **Complex Overrides**: Highly complex UI with override configs for specific product use-cases.

---

## 2. Design Philosophy

### 2.1 Core Mechanics: Frictionless Execution

#### 2.1.1 Simple, Effective, and Fun
- **The Minimum Viable Form**: Eliminate lines, borders, or text elements that lack clear functional purpose.
- **Power via Utility**: True simplicity means providing absolute clarity of intention, enabling single-purpose primitives to work perfectly together.
- **Fun Again**: UI needs fun again. Even when working on complex data in a tabular form, the UI should keep the workflow interesting and delightful.

#### 2.1.2 Ease of Doing
- **Frictionless Action**: Structure layouts to dramatically reduce the mental and physical steps required to complete tasks.

### 2.2 Spatial Hierarchy: Cognitive Comfort

#### 2.2.1 Right Info, Right Place
- **Context-ful Allocation**: Anchor information strictly by environmental relevance, placing primary actions in focal zones and secondary data in nested containers.
- **Not Overwhelming**: Minimize cognitive fatigue using progressive disclosure, revealing deep workflows only when requested.

#### 2.2.2 Easy to Glance
- **Immediate Scannability**: Ensure users grasp system states within a 200ms glance using high-contrast typography sizes and spatial groupings.

### 2.3 Visual Encodings & System Physics

#### 2.3.1 Consistent Encodings
- **Predictable Signifiers**: Pair color shifts with physical markers (shape changes or structural pills) so UI states remain unmistakable.
- **Strict Token Mapping**: Colors map directly to functional logic rather than aesthetic whims, remaining uniform across all product tiers.

#### 2.3.2 Atmospheric Depth & Motion
- **Subtle Radiance**: Apply soft, low-contrast depth without competing with readable type or introducing decorative AI gradient slop.
- **Elegant Animations**: Use custom spring physics instead of rigid, linear transitions to create tactile, responsive movement.

### 2.4 The Energy Layer: Fun, Fresh, & Delightful

#### 2.4.1 Vibrant Energy Injection
- **Vibe Shifts**: Use data attributes to inject fresh, high-intensity color accents (like active limes or neon mints) into neutral surfaces, keeping the interface from ever feeling sterile or purely corporate.
- **Playful Contexts**: Let the color profile morph dynamically based on the product personality—shifting seamlessly from calculated finance tracking to high-energy live environments.

#### 2.4.2 The "Aww" Factor
- **Micro-Moments of Joy**: Craft subtle interactions—like a toggle switch that springs back with a tiny bloom of color or a side panel that glides open with realistic momentum—to leave users with a sense of polished craftsmanship.
- **Unexpected Textures**: Incorporate deliberate, organic accents (like hand-inked vector perimeters or atmospheric background blurs) to make the digital space feel warm, tactile, and premium.

---

## 3. Key Functionalities

### 3.1 Centralized Global Styling
The library exports a Global CSS file intended for consumption by all product repos. This ensures that fundamental styles—typography, spacing, and the "Energy" variable definitions—are managed in one place. Product teams no longer maintain local base CSS; they simply import the `elementa-ui` globals.

### 3.2 Smart Components with Overrides
Elementa-ui provides a suite of common components (`Button`, `Text`, `Input`, etc.) that are context-aware:
- **Smart Defaults**: Components automatically inherit styles based on which of the 10 themes the product has active.
- **Tailwind Flexibility**: While components come pre-styled, they are fully extensible. Client repositories can pass custom Tailwind classes to override or augment styles using the design tokens defined in the global CSS.

### 3.3 Asset & Custom Component Support
Beyond "off-the-shelf" components, the library provides the low-level assets (icons, color tokens, and utility functions) necessary for product teams to build bespoke UI components. This ensures that even "one-off" requirements remain visually consistent with the broader ecosystem.
- **Styling**: Tailwind CSS with a centralized Global CSS architecture.
- **Assets**: Powered by the open-source `elementa-icons` (available on npm and [elementa.deriva.xyz/icons](https://elementa.deriva.xyz/icons)).

---

## 4. Information Architecture: Layers, Surfaces & Luminance

Surfaces are the fundamental spatial building blocks of any Elementa interface. We categorize all surfaces into five distinct **Elevation Levels** (Layers 0 through 4). This structure creates a mathematically consistent hierarchy where the background canvas provides rock-solid contextual stability, containers delineate functional zones, and overlays/active controls demand focused user attention.

---

### 4.1 The Five Elevation Layers

| Elevation Layer | Physical Analogy | IA Role & Spatial Behavior | Exact Tailwind Classes | Canonical `get-elementa-ui` Components |
| :--- | :--- | :--- | :--- | :--- |
| **Layer 0: Base** | *The Floor* | The root container and infinite workspace canvas. Permanent, low-contrast backdrop that recedes from visual attention. Also forms modal backdrops/scrims. | `bg-bg-base-primary`<br>`bg-bg-base-accent-primary`<br>`bg-bg-base-accent-secondary`<br>`border-stroke-base-primary`<br>`stroke-stroke-base-primary` | Root Page Canvas, App Viewport Layout, `AlertDialogOverlay`, `SheetOverlay`, `AvatarBadge` boundary ring |
| **Layer 1: Flat** | *The Table* | Secondary containers and structural wells sunken or embedded within the base. Delineates fixed navigation, primary cards, and form input wells without popping forward. | `bg-bg-flat-primary`<br>`border-stroke-flat-primary`<br>`bg-bg-disabled`<br>`bg-bg-muted`<br>`border-stroke-disabled` | App `Sidebar`, `SidebarContent`, Primary Cards, `Input`, `Textarea`, `InputGroup`, `SelectTrigger`, `SelectContent`, `Calendar` body |
| **Layer 2: Raised** | *The Tray* | Discrete interactive objects that sit visibly above the base or well. Signals self-contained domain entities, data modules, and nested card wells. | `bg-bg-raised-primary`<br>`bg-bg-raised-secondary`<br>`border-stroke-raised-primary`<br>`border-stroke-raised-secondary` | Bento containers, Metric Cards, Feature Panels, `ColorStudio` container, nested card wells (`bg-bg-raised-secondary`), item hover wells |
| **Layer 3: Modal / Overlays** | *The Floating Paper* | High-priority temporary overlays that interrupt the normal workflow. Highest contrast; commands isolated focus and physically obscures lower surfaces. | `bg-bg-modal-primary`<br>`bg-bg-modal-secondary`<br>`border-stroke-modal-primary`<br>`border-stroke-modal-secondary`<br>`ring-stroke-modal-primary` | `DialogContent`, `AlertDialogContent`, `SheetContent`, `DrawerContent`, `PopoverContent`, `DropdownMenuContent`, `ContextMenuContent`, `Skeleton` (`bg-bg-modal-primary`), `InputOTPSlot` |
| **Layer 4: Active** | *Ink on the Paper* | The interactive summit. Demands direct user interaction or signals immediate state change. Sits atop *any* lower layer (Base, Flat, Raised, or Modal). | **Neutral:** `bg-bg-active-primary`, `bg-bg-active-secondary`, `border-stroke-active-primary`, `border-stroke-active-secondary`<br>**Accent:** `bg-bg-active-accent-primary`, `bg-bg-active-hover-accent-primary`, `bg-bg-active-fill-accent-primary`, `border-stroke-active-accent-primary`, `bg-bg-active-accent-secondary`, `bg-bg-active-hover-accent-secondary`, `bg-bg-active-fill-accent-secondary`, `border-stroke-active-accent-secondary` | `Button` (default, outline, secondary), `Switch`, `Checkbox`, `TabsTrigger` active indicator, `TableHeader` (`bg-bg-active-primary`), `TableRow` hover wells, `Item` badges |

#### Core Surface Principles
- **Higher Elevation = Higher Focus**: Visual intensity, borders, and contrast increase with layer elevation.
- **Contextual Stability (Layers 0 & 1)**: Neutral and quiet. Permanent fixtures that users navigate through without cognitive fatigue.
- **Affordance & Identity (Layer 2)**: Crisp visual boundaries that encapsulate distinct records, domain objects, or transactions.
- **The Attention Isolation Rule (Layer 3)**: Overlay surfaces that capture modality, trap focus, or display contextual floating tools.
- **The Action Directness Rule (Layer 4)**: Interactive triggers and controls. Whether a button is on a Layer 0 canvas or inside a Layer 3 Dialog, it is strictly governed by Layer 4 active tokens.

---

### 4.2 Consolidated Surface & Stroke Codex (`theme.css` & `energies/*.css`)

Every token is mapped directly from `get-elementa-ui`'s centralized theme engine (`theme.css` and `@theme inline`). In Tailwind CSS v4, `--color-*` variables are accessed via `bg-`, `border-`, `stroke-`, `ring-`, and `text-` utility prefixes. Tokens marked with `<Primary>` or `<Secondary>` dynamically resolve from the active `[data-energy="<id>"]` attribute:

| Layer Tier | Semantic CSS Variable | Tailwind Utility | Light Mode (`[data-theme="light"]`) | Dark Mode (`.dark, [data-theme="dark"]`) | Functional Role |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Layer 1 · Base** | `--bg-base-primary` | `bg-bg-base-primary` | `--color-amber-white-100` (`#FCFCFB`) | `--color-gun-metal-1100` (`#111418`) | Root workspace canvas & page floor |
| **Layer 1 · Base** | `--bg-flat-primary` | `bg-bg-flat-primary` | `--color-amber-white-200` (`#F9F9F8`) | `--color-gun-metal-1000` (`#1A1E24`) | Recessed sidebars, primary cards & inputs |
| **Layer 1 · Base** | `--stroke-base-primary` | `border-stroke-base-primary` | `--color-gun-metal-1000` (`#1A1E24`) | `--color-amber-white-200` (`#F9F9F8`) | Root canvas structural hairline stroke |
| **Layer 1 · Base** | `--stroke-flat-primary` | `border-stroke-flat-primary` | `--color-gun-metal-900` (`#232932`) | `--color-amber-white-300` (`#F6F6F6`) | Recessed well & input boundary stroke |
| **Layer 1 · Base** | `--bg-base-accent-primary` | `bg-bg-base-accent-primary` | `--color-<primary>-200` *(Dynamic)* | `--color-<primary>-900` *(Dynamic)* | Subtle primary energy backdrop tint |
| **Layer 1 · Base** | `--bg-base-accent-secondary` | `bg-bg-base-accent-secondary` | `--color-<secondary>-200` *(Dynamic)* | `--color-<secondary>-900` *(Dynamic)* | Subtle secondary energy backdrop tint |
| **Layer 1 · Base** | `--bg-disabled` | `bg-bg-disabled` | `--color-disabled-amber` (`#969696`) | `--color-disabled-gun-metal` (`#343434`) | Inert / locked control surface |
| **Layer 1 · Base** | `--bg-muted` | `bg-bg-muted` | `--color-muted` (`#BFBFBF`) | `--color-muted` (`#BFBFBF`) | De-emphasized neutral track surface |
| **Layer 1 · Base** | `--stroke-disabled` | `border-stroke-disabled` | `--color-stroke-disabled-amber` (`#7A7A7A`) | `--color-stroke-disabled-gun-metal` (`#4D4D4D`) | Inert / disabled boundary stroke |
| **Layer 2 · Raised** | `--bg-raised-primary` | `bg-bg-raised-primary` | `--color-amber-white-300` (`#F6F6F6`) | `--color-gun-metal-900` (`#232932`) | Elevated bento cards & inspection panels |
| **Layer 2 · Raised** | `--bg-raised-secondary` | `bg-bg-raised-secondary` | `--color-amber-white-400` (`#F3F4F5`) | `--color-gun-metal-800` (`#2D343E`) | Nested surfaces inside cards & hover wells |
| **Layer 2 · Raised** | `--stroke-raised-primary` | `border-stroke-raised-primary` | `--color-gun-metal-700` (`#373F4A`) | `--color-amber-white-400` (`#F3F4F5`) | Primary elevated card boundary stroke |
| **Layer 2 · Raised** | `--stroke-raised-secondary` | `border-stroke-raised-secondary`| `--color-gun-metal-600` (`#404956`) | `--color-amber-white-500` (`#EFF0F2`) | Secondary nested well boundary stroke |
| **Layer 3 · Modal** | `--bg-modal-primary` | `bg-bg-modal-primary` | `--color-amber-white-500` (`#EFF0F2`) | `--color-gun-metal-700` (`#373F4A`) | `Dialog`, `Sheet`, `Drawer` & `Popover` overlays |
| **Layer 3 · Modal** | `--bg-modal-secondary` | `bg-bg-modal-secondary` | `--color-amber-white-600` (`#ECECEF`) | `--color-gun-metal-600` (`#404956`) | Modal footers, nested drawers & submenus |
| **Layer 3 · Modal** | `--stroke-modal-primary` | `border-stroke-modal-primary` | `--color-gun-metal-500` (`#5F6874`) | `--color-amber-white-600` (`#ECECEF`) | Primary modal & popover perimeter stroke |
| **Layer 3 · Modal** | `--stroke-modal-secondary` | `border-stroke-modal-secondary`| `--color-gun-metal-400` (`#7E8793`) | `--color-amber-white-700` (`#C8C9CC`) | Secondary modal divider stroke |
| **Layer 4 · Active** | `--bg-active-primary` | `bg-bg-active-primary` | `--color-amber-white-700` (`#C8C9CC`) | `--color-gun-metal-500` (`#5F6874`) | Neutral active surface, `thead` & row hover |
| **Layer 4 · Active** | `--stroke-active-primary` | `border-stroke-active-primary` | `--color-gun-metal-300` (`#9DA6AF`) | `--color-amber-white-800` (`#A5A6A8`) | Neutral active control perimeter stroke |
| **Layer 4 · Active** | `--bg-active-secondary` | `bg-bg-active-secondary` | `--color-amber-white-800` (`#A5A6A8`) | `--color-gun-metal-400` (`#7E8793`) | Secondary neutral active surface & `tfoot` |
| **Layer 4 · Active** | `--stroke-active-secondary` | `border-stroke-active-secondary`| `--color-gun-metal-200` (`#BCC2C9`) | `--color-amber-white-900` (`#828385`) | Secondary neutral active boundary stroke |
| **Layer 4 · Active** | `--bg-active-accent-primary` | `bg-bg-active-accent-primary` | `--color-<primary>-600` *(Dynamic)* | `--color-<primary>-400` *(Dynamic)* | Primary CTA button fill & checked `Switch` |
| **Layer 4 · Active** | `--bg-active-hover-accent-primary` | `bg-bg-active-hover-accent-primary` | `--color-<primary>-400` *(Dynamic)* | `--color-<primary>-200` *(Dynamic)* | Hover state for primary energy CTAs |
| **Layer 4 · Active** | `--bg-active-fill-accent-primary` | `bg-bg-active-fill-accent-primary` | `--color-<primary>-100` *(Dynamic)* | `--color-<primary>-1000` *(Dynamic)* | Soft primary fill well (active nav, bento card) |
| **Layer 4 · Active** | `--stroke-active-accent-primary` | `border-stroke-active-accent-primary` | `--color-<primary>-400` *(Dynamic)* | `--color-<primary>-200` *(Dynamic)* | 2px keyboard focus ring & active accent border |
| **Layer 4 · Active** | `--bg-active-accent-secondary` | `bg-bg-active-accent-secondary` | `--color-<secondary>-600` *(Dynamic)* | `--color-<secondary>-400` *(Dynamic)* | Secondary energy CTA button fill |
| **Layer 4 · Active** | `--bg-active-hover-accent-secondary` | `bg-bg-active-hover-accent-secondary` | `--color-<secondary>-400` *(Dynamic)* | `--color-<secondary>-200` *(Dynamic)* | Hover state for secondary energy controls |
| **Layer 4 · Active** | `--bg-active-fill-accent-secondary` | `bg-bg-active-fill-accent-secondary` | `--color-<secondary>-100` *(Dynamic)* | `--color-<secondary>-1000` *(Dynamic)* | Soft secondary fill well (badges, bento card) |
| **Layer 4 · Active** | `--stroke-active-accent-secondary` | `border-stroke-active-accent-secondary` | `--color-<secondary>-400` *(Dynamic)* | `--color-<secondary>-200` *(Dynamic)* | Secondary energy active outline & badge border |

---

### 4.3 Luminance Shift Rules & Physical Surface Codex

Elementa does not use arbitrary drop shadows or generic blurs to communicate depth. Elevation is communicated strictly through **Chromatic Contrast** and **Boundary Luminance**:

- **Light Mode (`Amber-White` Palette)**:
  - Surfaces get **darker** as they elevate.
  - *Why*: In a high-key light environment, elevated elements feel denser, more tangible, and cast visual weight.
  - Progression: Canvas (`100` L: 99.1%) $\rightarrow$ Well (`200` L: 98.5%) $\rightarrow$ Card (`300` L: 97.8%) $\rightarrow$ Modal (`500` L: 96.4%) $\rightarrow$ Active Button (`700` L: 83.5%).
- **Dark Mode (`Gun-Metal` Palette)**:
  - Surfaces get **lighter** as they elevate.
  - *Why*: In a low-key dark environment, elevated planes catch directional light from the user's viewport.
  - Progression: Canvas (`1100` L: 14.6%) $\rightarrow$ Well (`1000` L: 18.0%) $\rightarrow$ Card (`900` L: 21.9%) $\rightarrow$ Modal (`700` L: 29.3%) $\rightarrow$ Active Button (`500` L: 45.2%).

---

### 4.4 Same-Layer Distinction & Spatial Containment ("Same-Same, Puppy Shame?")

When multiple elements share the same elevation tier or are nested within one another, avoid visual confusion by enforcing the following spatial rules:

1. **The Primary Canvas vs. Navigation Well Rule**:
   - The primary command canvas must use the cleanest baseline: `bg-bg-base-primary`.
   - Sidebars, persistent header bars, and collapsible rails must use `bg-bg-flat-primary`. This creates a recessed container "well" that stays quietly parked at the periphery.
2. **Authentic Elementa Sidebar Anatomy**:
   - **Header Well**: Brand logo / badge container (`bg-bg-active-fill-accent-primary text-text-accent-primary size-8 rounded-xl shadow-md`) + Workspace Title (`Subtitle1` / `Subtitle2`) and environment subtitle (`Caption`).
   - **Group Label**: `TextVariant.Caption` uppercase tracked label (`text-text-tertiary px-2.5 tracking-wider uppercase font-medium`).
   - **Active Nav Item**: `bg-bg-active-fill-accent-primary text-text-accent-primary rounded-xl px-3 py-2 text-sm font-medium`.
   - **Inactive Nav Item**: `text-text-secondary hover:bg-bg-raised-secondary hover:text-text-primary rounded-xl px-3 py-2 text-sm font-medium transition-colors`.
   - **Footer Well**: Recessed user / account profile card (`bg-bg-raised-secondary rounded-xl p-2.5 shadow-md flex items-center gap-2.5`).
3. **Card and Inner Surface Elevation Rule**:
   - Primary cards use `bg-bg-flat-primary` with `shadow-md`.
   - Surfaces inside cards use `bg-bg-raised-secondary` with `shadow-md`.
   - When further nesting inside that surface (e.g., metric wells or data rows), alternate back to `bg-bg-flat-primary` with `shadow-md`.
   - Never use opacity modifiers (`/x`) on color tokens. Always use tokens from the library as-is.
4. **Bento Card StorySet Illustration Standards**:
   - Use clean, scalable StorySet vector-style SVGs for bento cards (e.g. 2-column bento layouts).
   - Use Elementa semantic tokens (`text-text-accent-primary`, `text-text-accent-secondary`, `bg-bg-active-fill-accent-primary`, `bg-bg-raised-secondary`) for vector accents and character fills rather than arbitrary hardcoded hex codes.
   - Encase illustrations inside inner elevated surfaces (`bg-bg-raised-secondary shadow-md rounded-2xl`).
5. **Table & List Distinction**:
   - Table container: `bg-bg-flat-primary` or transparent on canvas.
   - Table header (`thead`): `bg-bg-active-primary text-text-primary`.
   - Table rows (`tr`): `hover:bg-bg-active-primary`.
   - Selected row: `bg-bg-active-fill-accent-primary`.
   - Table footer (`tfoot`): `bg-bg-active-secondary`.
6. **Interactive Running Borders on Workstation Zones**:
   - When showcasing multi-zone interfaces (e.g., Navigation Well, Focal Canvas, Inspector Rail), default state keeps running animated dashed borders on all three zones.
   - When a specific zone is selected or focused, only keep the running border animation on that active zone, while the other two zones settle into clean static borders (`border-stroke-base-primary`).

---

### 4.5 The Semantic Typography Codex

Typography tokens automatically adapt between light and dark themes. Always use `text-text-tertiary` for captions, helper tips, and metadata (never use `text-text-muted`, which stays fixed at `--color-gun-metal-900` and lacks contrast in dark mode):

| Text Token | CSS Variable | Tailwind Utility | Light Mode (`amber-white`) | Dark Mode (`gun-metal`) | Applied Context |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Primary Text** | `--text-primary` | `text-text-primary` | `--color-gun-metal-1100` (`#111418`) | `--color-amber-white-100` (`#FCFCFB`) | Headings (`font-heading`), card titles, active tab labels, high-emphasis metrics |
| **Secondary Text** | `--text-secondary` | `text-text-secondary` | `--color-gun-metal-500` (`#5F6874`) | `--color-amber-white-700` (`#C8C9CC`) | Body copy (`font-body`), supporting descriptions, inactive nav labels |
| **Tertiary Text** | `--text-tertiary` | `text-text-tertiary` | `--color-gun-metal-300` (`#9DA6AF`) | `--color-amber-white-900` (`#828385`) | Captions, placeholders, timestamps, micro-metadata, group labels, input icons |
| **Disabled Text** | `--text-disabled` | `text-text-disabled` | `--color-text-on-disabled` (`#696969`) | `--color-text-on-disabled` (`#696969`) | Inactive buttons, disabled inputs, locked options |
| **Muted Text (Legacy)** | `--text-muted` | `text-text-muted` | `--color-gun-metal-900` (`#232932`) | `--color-gun-metal-900` (`#232932`) | Do not use for UI copy; always convert `text-text-muted` to `text-text-tertiary` |
| **Accent Primary Text** | `--text-accent-primary` | `text-text-accent-primary` | `--color-<primary>-600` *(Dynamic)* | `--color-<primary>-400` *(Dynamic)* | Energy-highlighted terms, active segmented indicators, key KPIs |
| **Accent Secondary Text** | `--text-accent-secondary` | `text-text-accent-secondary`| `--color-<secondary>-600` *(Dynamic)* | `--color-<secondary>-400` *(Dynamic)* | Secondary energy highlights, eyebrow outline badges (`variant="outline"`), category tags |

---

### 4.6 The Feedback & Status Codex

Feedback colors are strictly scoped to semantic signals (Success, Destructive, Warning, Info). Each status provides high-contrast text, 18% OKLCH tinted backgrounds, solid fills, 9% OKLCH hover surfaces, and border strokes across Light and Dark modes:

| Feedback Domain | Semantic Token | Tailwind Utility | Light Mode (`[data-theme="light"]`) | Dark Mode (`.dark, [data-theme="dark"]`) | Usage Invariants |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Basil (Success)** | `--text-success`<br>`--bg-success`<br>`--bg-fill-success`<br>`--bg-hover-success`<br>`--stroke-success` | `text-text-success`<br>`bg-bg-success`<br>`bg-bg-fill-success`<br>`bg-bg-hover-success`<br>`border-stroke-success` | `--color-basil-amber-dark`<br>`color-mix(var(--color-basil-amber), transparent 82%)`<br>`--color-basil-amber`<br>`color-mix(var(--color-basil-amber), transparent 91%)`<br>`--color-basil-amber` | `--color-basil-gun-metal-light`<br>`color-mix(var(--color-basil-gun-metal), transparent 82%)`<br>`--color-basil-gun-metal`<br>`color-mix(var(--color-basil-gun-metal), transparent 91%)`<br>`--color-basil-gun-metal` | Positive delta, successful transactions, online status |
| **Tomato (Destructive)** | `--text-destructive`<br>`--bg-destructive`<br>`--bg-fill-destructive`<br>`--bg-hover-destructive`<br>`--stroke-destructive` | `text-text-destructive`<br>`bg-bg-destructive`<br>`bg-bg-fill-destructive`<br>`bg-bg-hover-destructive`<br>`border-stroke-destructive` | `--color-tomato-amber-dark`<br>`color-mix(var(--color-tomato-amber), transparent 82%)`<br>`--color-tomato-amber`<br>`color-mix(var(--color-tomato-amber), transparent 91%)`<br>`--color-tomato-amber` | `--color-tomato-gun-metal-light`<br>`color-mix(var(--color-tomato-gun-metal), transparent 82%)`<br>`--color-tomato-gun-metal`<br>`color-mix(var(--color-tomato-gun-metal), transparent 91%)`<br>`--color-tomato-gun-metal` | Errors, destructive actions, negative delta, system failure |
| **Blueberry (Info)** | `--text-info`<br>`--bg-info`<br>`--bg-fill-info`<br>`--bg-hover-info`<br>`--stroke-info` | `text-text-info`<br>`bg-bg-info`<br>`bg-bg-fill-info`<br>`bg-bg-hover-info`<br>`border-stroke-info` | `--color-blueberry-amber-dark`<br>`color-mix(var(--color-blueberry-amber), transparent 82%)`<br>`--color-blueberry-amber`<br>`color-mix(var(--color-blueberry-amber), transparent 91%)`<br>`--color-blueberry-amber` | `--color-blueberry-gun-metal-light`<br>`color-mix(var(--color-blueberry-gun-metal), transparent 82%)`<br>`--color-blueberry-gun-metal`<br>`color-mix(var(--color-blueberry-gun-metal), transparent 91%)`<br>`--color-blueberry-gun-metal` | Informational callouts, active links, guided walkthrough tips |
| **Corn (Warning)** | `--text-warning`<br>`--bg-warning`<br>`--bg-fill-warning`<br>`--bg-hover-warning`<br>`--stroke-warning` | `text-text-warning`<br>`bg-bg-warning`<br>`bg-bg-fill-warning`<br>`bg-bg-hover-warning`<br>`border-stroke-warning` | `--color-corn-amber-dark`<br>`color-mix(var(--color-corn-amber), transparent 82%)`<br>`--color-corn-amber`<br>`color-mix(var(--color-corn-amber), transparent 91%)`<br>`--color-corn-amber` | `--color-corn-gun-metal-light`<br>`color-mix(var(--color-corn-gun-metal), transparent 82%)`<br>`--color-corn-gun-metal`<br>`color-mix(var(--color-corn-gun-metal), transparent 91%)`<br>`--color-corn-gun-metal` | Pending confirmations, threshold warnings, amber alerts |
| **Koala (Disabled/Muted)** | `--text-disabled`<br>`--bg-disabled`<br>`--bg-muted`<br>`--stroke-disabled` | `text-text-disabled`<br>`bg-bg-disabled`<br>`bg-bg-muted`<br>`border-stroke-disabled` | `--color-text-on-disabled`<br>`--color-disabled-amber`<br>`--color-muted`<br>`--color-stroke-disabled-amber` | `--color-text-on-disabled`<br>`--color-disabled-gun-metal`<br>`--color-muted`<br>`--color-stroke-disabled-gun-metal` | Disabled buttons/inputs, loading skeletons, muted tab tracks |

---

### 4.7 Energy Themes, Chart Series & Dynamic Accent Layer

Elementa features **10 canonical energy themes** defined in `get-elementa-ui/dist/energies/*.css`. Each energy binds the 5 brand OKLCH palettes (`electric-violet` `#9B6DF2`, `dusty-rose` `#C26D8F`, `matcha-sage` `#70A073`, `terracotta-rust` `#C1582F`, `golden-hour` `#DD9C00`) to 4 semantic channels (`Primary`, `Secondary`, `Chart 3 / Accent 1`, `Chart 4 / Accent 2`):

| Energy Theme | `data-energy` ID | Code | Primary Channel (`<primary>`) | Secondary Channel (`<secondary>`) | Chart 3 (`<accent1>`) | Chart 4 (`<accent2>`) |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Acoustic Wood** | `acoustic-wood` | `aw` | `terracotta-rust` | `dusty-rose` | `matcha-sage` | `electric-violet` |
| **Cipher Vault** | `cipher-vault` | `cv` | `electric-violet` | `matcha-sage` | `dusty-rose` | `terracotta-rust` |
| **Crema Extraction** | `crema-extraction` | `ce` | `terracotta-rust` | `golden-hour` | `dusty-rose` | `electric-violet` |
| **Dawn Chorus** | `dawn-chorus` | `dc` | `golden-hour` | `dusty-rose` | `electric-violet` | `terracotta-rust` |
| **Dusk Bloom** | `dusk-bloom` | `db` | `dusty-rose` | `electric-violet` | `golden-hour` | `matcha-sage` |
| **Event Horizon** | `event-horizon` | `eh` | `electric-violet` | `terracotta-rust` | `matcha-sage` | `golden-hour` |
| **Maker's Canvas** | `makers-canvas` | `mc` | `terracotta-rust` | `matcha-sage` | `electric-violet` | `golden-hour` |
| **Neon Symphony** | `neon-symphony` | `ns` | `electric-violet` | `golden-hour` | `dusty-rose` | `matcha-sage` |
| **Tropical Grid** | `tropical-grid` | `tg` | `matcha-sage` | `golden-hour` | `terracotta-rust` | `dusty-rose` |
| **Zen Toolkit** | `zen-toolkit` | `zt` | `matcha-sage` | `dusty-rose` | `golden-hour` | `terracotta-rust` |

#### Dynamic Energy & Chart Token Resolution Rules (`[data-energy="<id>"]` vs `.dark[data-energy="<id>"]`)
- **Layer 1 Base Accents**: `--bg-base-accent-primary` (`<primary>-200` Light / `<primary>-900` Dark); `--bg-base-accent-secondary` (`<secondary>-200` Light / `<secondary>-900` Dark).
- **Layer 2 Accent Text**: `--text-accent-primary` (`<primary>-600` Light / `<primary>-400` Dark); `--text-accent-secondary` (`<secondary>-600` Light / `<secondary>-400` Dark).
- **Layer 4 Active Primary & Secondary**:
  - Solid Action: `--bg-active-accent-primary` (`<primary>-600` Light / `<primary>-400` Dark); `--bg-active-accent-secondary` (`<secondary>-600` Light / `<secondary>-400` Dark).
  - Hover & Stroke: `--bg-active-hover-accent-primary` & `--stroke-active-accent-primary` (`<primary>-400` Light / `<primary>-200` Dark); `--bg-active-hover-accent-secondary` & `--stroke-active-accent-secondary` (`<secondary>-400` Light / `<secondary>-200` Dark).
  - Soft Fill Wells: `--bg-active-fill-accent-primary` (`<primary>-100` Light / `<primary>-1000` Dark); `--bg-active-fill-accent-secondary` (`<secondary>-100` Light / `<secondary>-1000` Dark).
- **Layer 4 Chart Series (`--chart-*` / `bg-chart-*`)**:
  - `--chart-primary-1` to `--chart-primary-5`: Light `--color-<primary>-400` through `800`; Dark `--color-<primary>-200` through `600`.
  - `--chart-secondary-1` to `--chart-secondary-5`: Light `--color-<secondary>-400` through `800`; Dark `--color-<secondary>-200` through `600`.
  - `--chart-3`: Light `--color-<accent1>-600`; Dark `--color-<accent1>-400`.
  - `--chart-4`: Light `--color-<accent2>-600`; Dark `--color-<accent2>-400`.

---

### 4.8 Zero-Guesswork Implementation Codex (Strict Anti-Patterns)

To prevent generic AI designs, stale assumptions, and broken contrast, strictly adhere to this lookup table when authoring components:

| ❌ NEVER GUESS / NEVER USE | ✅ ALWAYS USE (AUTHENTIC TOKEN) | WHY IT BREAKS ELEMENTA |
| :--- | :--- | :--- |
| `bg-gray-100`, `bg-zinc-900`, `bg-slate-50` | `bg-bg-base-primary`, `bg-bg-flat-primary`, `bg-bg-raised-primary` | Generic Tailwind neutral ramps destroy Elementa's amber-white & gun-metal OKLCH color spaces. |
| `border-gray-200`, `border-border`, `border-zinc-700` | `border-stroke-base-primary`, `border-stroke-flat-primary`, `border-stroke-raised-primary` | Breaks dynamic theme switching; creates jarring high-contrast lines instead of tuned elevation borders. |
| `text-black`, `text-white`, `text-gray-500` | `text-text-primary`, `text-text-secondary`, `text-text-tertiary` | Hardcoded monochrome text ruins dark/light mode transitions and breaks contrast accessibility. |
| Linear / radial gradient backgrounds (`bg-gradient-to-r`) | Flat, solid semantic tokens (`bg-bg-base-primary`, `bg-bg-raised-primary`) | Gradients violate the Deriva Design Ethos and produce dated, AI-generic visual noise. |
| Custom drop shadows (`shadow-2xl`, `shadow-indigo-500/50`) | Standard Elementa elevation shadows (`shadow-xs`, `shadow-sm`, `shadow-md`) | Elementa relies on boundary luminance and precise OKLCH strokes, not exaggerated floating blurs. |
| Ad-hoc green/red hex codes (`text-green-500`, `#ef4444`) | `text-text-success`, `text-text-destructive`, `bg-bg-destructive` | Violates the Basil & Tomato OKLCH feedback calibration. |
| Arbitrary border-radius (`rounded-[19px]`, `rounded-full` on cards) | `rounded-lg` (8px), `rounded-xl` (10px–14px), `rounded-sm` (4px) | Elementa uses calibrated radius tokens tied to `--radius: 0.625rem`. |

---

## 5. Design Ideology & Influences
Elementa design is inspired by stalwarts in the industry:
1. **Apple**: Clean, unique, consumer-centric, and truly global design.
2. **Google**: Fun, colors, balance, and intentional storytelling.
3. **Spotify**: Clean, precise, bias for user action.
4. **Zerodha**: Modern, non-verbose, minimalist, and bias for user action.
5. **Swiggy**: Fun, poppy, micro-animations, and bias for user action.
6. **Sofascore**: Data-first, clarity, and duo-tonic restraint.
7. **Samsung**: Modern, spatial hierarchy, micro-animations, and bias for user action.

### Core Translation:
- **Fun**: Breathing new life into designs to combat monotony; interfaces that spark genuine user joy.
- **Precise**: No fillers. Every pixel justifies its place on the screen. Screen estate is precious land; maximize functional ROI.
- **Attentive**: Each section has one and only one focal point; everything else revolves around it.
- **Intuitive & Action-Biased**: Complete the user's task as quickly as possible.
- **Modern, Sleek, & Un-Generic**: Reject generic AI cliches (decorative gradient slop, card-kit repetition, monotonous rounded boxes).
- **Storytelling**: Every screen tells a cohesive visual story.
- **Micro-Animations**: Used sparingly and smartly to enhance the narrative.
- **The 70-20-10 Color Rule**: 70% neutral canvas, 20% primary structural color, 10% secondary accent energy.

---

## Pillar 01 · Layout & Space Architecture

Elementa inverts the dogmatic "Mobile First" mindset for enterprise and high-density software platforms:
- **Design Large-First**: Begin by designing for large workstations (1920px – 2560px+). This exposes the true information architecture, multi-pane spatial hierarchy (sidebar, canvas, contextual rail, metric grids), and density requirements without artificial compression.
- **Mobile as Disciplined Realignment**: Mobile (360px – 640px) is not a degraded fallback—it is an intentional spatial realignment of the master system. Multi-column command canvases stack into prioritized vertical cards, primary sidebars collapse into bottom safe-area touch docks (`h-16`), and contextual inspection rails transform into smooth bottom sheets.

### 2. Anatomical Screen Zones
Every Elementa interface is composed of six distinct spatial zones:
1. **Zone 01 · Global Utility Header (`h-16` / `h-20`)**: Top-level identity, global omnisearch (`⌘K`), workspace/energy theme toggles, triage notification bells, and account profile.
2. **Zone 02 · Primary Sidebar (`w-60` / `w-64`)**: Fixed spatial anchor for core domain routing. Supports collapsing to an icon-only micro-rail (`w-16` / 64px).
3. **Zone 03 · Command Canvas (Fluid `flex-1`)**: The primary work arena holding page headers, KPI grids, data tables, and interactive visualizations. Governed by the 60-part grid.
4. **Zone 04 · Contextual Inspector / Right Rail (`w-72` – `w-88`)**: Secondary detail surface for telemetry, active item inspection, and quick transaction forms.
5. **Zone 05 · Floating Overlays & Triage Drawers (`z-50`)**: Non-modal popovers with tabbed triage (e.g. Inbox / General / Archived), command bars, and context menus.
6. **Zone 06 · Mobile Companion Dock (`h-16`)**: Replaces the primary sidebar on viewports `< 768px` with 4–5 thumb-accessible primary actions.

### 3. The 3×4×5 (60-Division) Harmonic Grid System
Conventional 12-column grids fail on 5-part groupings (5 KPI cards, 5-day week views), resulting in fractional column spans (2.4 columns). Elementa standardizes on the **60-part composite harmonic grid** (`LCM(3, 4, 5) = 60`):
- Divisible by **1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30, and 60** without fractional pixel remainders.
- **2 Columns**: 30 units (50%)
- **3 Columns**: 20 units (33.3%)
- **4 Columns**: 15 units (25%)
- **5 Columns**: 12 units (20%) — *impossible in standard 12-col grids*
- **6 Columns**: 10 units (16.6%)
- **10 Columns**: 6 units (10%)
- **12 Columns**: 5 units (8.3%)

### 4. 4px Atomic Spacing System
Spacing is the primary driver of visual cadence and Gestalt proximity. Arbitrary pixel margins are strictly forbidden. The base atom is **4px** (`space-1`):
- `space-px` (1px): Hairline borders, optical nudges
- `space-0.5` (2px): Micro badges, status tag padding
- `space-1` (4px): **Base Atom**; icon gaps, tight inline chip margins
- `space-1.5` (6px): Compact button padding, dense list item gaps
- `space-2` (8px): Standard button padding, avatar group gaps
- `space-2.5` (10px): Input internal padding, table cell vertical pad
- `space-3` (12px): Card inner margins, dropdown container padding
- `space-4` (16px): **Base Content Unit**; card padding, mobile margin
- `space-5` (20px): Intermediate metric gap, dialog header gap
- `space-6` (24px): Standard grid gutter, tablet canvas margin
- `space-8` (32px): Modal dialog padding, desktop canvas margin
- `space-10` (40px): Major structural module separation
- `space-12` (48px): Page section vertical breaks, wide canvas margin
- `space-16` (64px): Major landmark dividers, hero separation
- `space-20` (80px): Large monitor canvas margin, hero padding
- `space-24` (96px): Expansive feature section breathing room
- `space-32` (128px): Monumental chapter breaks

### 5. Responsive Breakpoints Scale (Up to 2560px)
- **`sm` (640px)**: Mobile Landscape / Phablet (4 cols, 16px margin, 12px gutter)
- **`md` (768px)**: Tablets / Foldables (8 cols, 24px margin, 16px gutter)
- **`lg` (1024px)**: Compact Laptops (12 cols, 32px margin, 20px gutter)
- **`xl` (1280px)**: Standard Workstation (12 cols, 40px margin, 24px gutter)
- **`2xl` (1536px)**: FHD 1080p Monitors (12 / 15 cols, 48px margin, 24px gutter)
- **`3xl` (1920px)**: QHD 1440p / Studio Displays (15 / 20 cols, 64px margin, 32px gutter)
- **`4xl` (2560px)**: Ultra-Wide / 4K Displays (20 / 60 cols, 80px margin, 32px gutter)

---

## Pillar 02 · Accessibility Architecture (Universal Access)

Elementa treats accessibility not as a post-launch audit checklist, but as a foundational architectural invariant. All interfaces must guarantee WCAG 2.2 AAA / AA compliance by default.

### 1. Contrast & Color Palette Calibration
Every color pairing in Elementa is mathematically validated against the two 11-step neutral surface palettes:
- **Amber White Ramp (`amber-white-100` to `amber-white-1100`)**: Governs light theme surfaces. Steps 100–400 represent light canvas backgrounds; steps 900–1100 represent deep text/surfaces.
- **Gun Metal Ramp (`gun-metal-100` to `gun-metal-1100`)**: Governs dark theme surfaces. Steps 800–1100 represent deep workstation canvases; steps 100–300 represent high-contrast text.
- **The 5 Core Accent Colors**:
  1. **Electric Violet** (`#9B6DF2` / `electric-violet-600`): AAA compliant on `gun-metal-700+` and `amber-white-1100`. Prohibited on light `amber-white-100` to `800` for body text.
  2. **Terracotta Rust** (`#C1582F` / `terracotta-rust-600`): AA compliant (5.2:1) on `amber-white-100` to `400` and AAA on `gun-metal-900+`. Prohibited in middle-gray wash zones.
  3. **Matcha Sage** (`#70A073` / `matcha-sage-600`): AAA compliant on `gun-metal-700+` and `amber-white-1100`. Requires sage-800+ on light canvases.
  4. **Dusty Rose** (`#C26D8F` / `dusty-rose-600`): AA compliant on `amber-white-100/200` and AAA on `gun-metal-800+`.
  5. **Golden Hour** (`#DD9C00` / `golden-hour-600`): Prohibited on white/light canvases for text (< 2.5:1). Highly effective AAA highlight on `gun-metal-600+` (> 8:1).
- **Compliance Floor**:
  - Normal text (< 18px / < 14px bold): **Minimum 4.5:1** (WCAG AA), target **7:1** (WCAG AAA).
  - Large text & graphical boundary indicators: **Minimum 3:1**.
  - Any pairing scoring < 4.5:1 is **cancelled / prohibited** for text.

### 2. Screen Reader Architecture
Assistive technologies (VoiceOver, NVDA, JAWS) navigate sequentially through the accessibility tree:
- **Semantic Landmarks**: Every page must use exactly one `<main>` landmark with descriptive `<header role="banner">`, `<nav>`, `<aside>`, and `<footer>` containers. Never substitute landmark containers with nested generic `<div>` tags.
- **Form Field Association via Elementa `Field`**: Always pair form inputs with Elementa's `Field`, `FieldLabel`, `FieldDescription`, and `FieldError` primitives. They automatically link `aria-labelledby`, `aria-describedby`, and `aria-errormessage` IDs.
- **Async Live Regions (`aria-live`)**:
  - Telemetry counters, streaming metrics, and background job indicators: `aria-live="polite"` (speaks when speech synthesizer pauses).
  - High-severity errors, security alerts, and session timeouts: `aria-live="assertive"` with `aria-atomic="true"`.
- **Decorative vs Actionable Glyphs**:
  - Purely cosmetic icons accompanying visible text: Apply `aria-hidden="true"`.
  - Standalone icon buttons: Must provide an explicit, unambiguous `aria-label` or visually-hidden `.sr-only` description.

### 3. Focus Traversal & Keyboard Choreography
Keyboard navigation must follow predictable spatial trajectories without unexpected quadrant jumps:
- **F-Pattern Traversal (Consoles & Dashboards)**:
  - Sequence: Top Global Header $\to$ Primary Navigation Rail $\to$ Command Canvas Title $\to$ Data Card Row 1 $\to$ Data Card Row 2.
  - Used for analytical studios, multi-column tables, split-pane developer tools.
- **Z-Pattern Traversal (Modals & Action Banners)**:
  - Sequence: Modal Header $\to$ Top-Right Dismiss $\to$ Body Summary $\to$ Secondary Cancel $\to$ Primary Confirm CTA.
  - Used for transaction dialogs, confirmation popovers, marketing banners.
- **Line-Based Linear Traversal (Forms & Steppers)**:
  - Sequence: Field 1 $\to$ Field 2 $\to$ Field 3 $\to$ Submission Trigger in strict 1D vertical order.
  - Used for checkout flows, account setup, billing settings.
- **The Elementa Focus Ring Mandate**:
  - Interactive elements must display a high-visibility 2px solid active ring with a 2px spatial offset (`focus-visible:ring-2 focus-visible:ring-stroke-active-accent-primary focus-visible:ring-offset-2`).
  - Prohibiting or hiding focus rings (`outline: none` without visible replacement) is strictly forbidden.

### 4. Touch Targets & Physical Hit Area Laws
Small visual footprints must never result in compromised physical ergonomics:
- **The 48px Law (`space-12`)**: Minimum physical tap area across all touch and pointer inputs is **48px × 48px** (WCAG 2.5.5 / Android / Apple HIG).
- **Visual Footprint vs Physical Hit Bounding Box**:
  - Standard Button: Visual height `40px` (`space-10`), physical target expanded to `48px` via pseudo-margins.
  - Compact Icon Button: Visual size `32px` (`space-8`), physical hit envelope expanded to `48px × 48px` via `after:absolute after:-inset-2`.
  - Micro Action Trigger: Visual size `24px` (`space-6`), physical hit envelope expanded to `44px–48px`.
  - Toggle Switch: Visual height `24px` (`space-6`), tap target envelope padded to `48px`.
- **Safety Separation**: Minimum **8px (`space-2`)** separation gap between adjacent interactive targets to prevent accidental misclicks.

### 5. Core W3C ARIA Laws
1. **First Rule of ARIA**: Never use ARIA if a native semantic HTML element exists (`<button>` instead of `<div role="button">`). ARIA describes semantics; it does not add native keyboard listeners or focus handling.
2. **State Synchronization**: Visual states must strictly mirror ARIA attributes (`aria-expanded`, `aria-checked`, `aria-selected`, `aria-invalid`, `aria-disabled`).
3. **Roving Tabindex in Composite Widgets**: In composite controls (tabs, menus, radio groups), only the active item holds `tabindex="0"`; siblings hold `tabindex="-1"`. Arrow keys navigate siblings; Tab exits the entire widget.
4. **Modal Focus Trapping & Restoration**: When dialogs open, focus traps inside the dialog; background content is marked inert; `Escape` dismisses the dialog; closing restores focus precisely to the triggering button.

---

## Pillar 03 · Tone & Voice Architecture (Editorial & Visual Data Storytelling)

Copy in Elementa is as much an architectural system as design tokens or spacing scales. Software should speak like a sharp, technically honest peer—never like an evasive legal department or a soulless AI template.

### 1. What Makes Copy Great (The 4 Invariants)
- **Clear & Precise**: Say it in 7 words, not 27. State what happened, why it matters, and what happens next. Cut decorative filler, passive verbs, and preamble apologies.
- **No Jargon**: Strictly ban corporate procurement dialect ("synergize", "leverage", "paradigm shift", "orchestrate holistic synergies"). Speak like a senior engineer explaining a pull request to a teammate.
- **Inclusive to All**: Write simple sentence structures, avoid culturally narrow colloquialisms, and preserve translation parity. Ensure screen readers announce clear semantic meaning without decoding convoluted puns.
- **Gets the Work Done**: Prioritize user velocity. Every error, notification, or confirmation must carry a concrete, immediate remedy or path forward.

### 2. How to Write for Elementa (The Ben Burr Doctrine)
Elementa's voice channels modern, punchy, dry engineer wit—think Ben Burr sitting across the desk reviewing a deployment log:
- **Rule 01 · Stop Apologizing Like a Fortune 500 Lawyer**: Never write *"We sincerely apologize for any inconvenience caused."* If an API pod died, state plainly: *"Database replica timed out after 30s. Retrying connection in 5s."*
- **Rule 02 · Never Blame the User for Product Edge Cases**: Instead of *"You entered invalid authentication credentials"*, write *"Incorrect password for user@deriva.xyz. Reset link sent."*
- **Rule 03 · The 3-Second Elevator Test**: If an engineer scanning your alert while carrying hot coffee cannot decipher what broke in 3 seconds, rewrite it.
- **Rule 04 · Concrete Action Verbs on Buttons**: Avoid passive affirmations like *"Okay"*, *"Proceed"*, or *"Submit"*. Use intent-bearing triggers: *"Deploy to US-East"*, *"Purge Stale Cache"*, *"Roll Back to v2.1"*.

### 3. Alt Text, Captions & Data Storytelling (Signals Over Pixels)
Visual parameters, graphs, and system topologies must communicate cognitive signal, not physical geometry:
- **The Core Law**: Never describe what data *represents* mechanically (e.g., *"A line chart with an x-axis showing 24 hours and a red line fluctuating"*). Always describe what data *tells* the human (e.g., *"US-East-1 cluster CPU peaked at 94% at 14:22 due to runaway ETL batch workers, triggering 4 autoscaled pods before stabilizing at 46%"*).
- **Alt Text vs. Figcaption Division**:
  - `alt="..."` / `aria-label="..."`: Delivers the hidden cognitive deduction, metric delta, and root cause so assistive technology users receive 100% informational parity with sighted analysts.
  - `<figcaption>`: Visible shared context anchored below the graphic for all users, providing figure numbering, executive summary, and source attribution.
- **The Three Canonical Laws of Accessible Visual Data**:
  1. *Headline First Rule*: State the core finding or takeaway in the first 5 words.
  2. *Metric Delta Rule*: Quantify relative deltas and percentages rather than enumerating raw coordinate points.
  3. *Shared Caption Rule*: Pair concise inline alt text with an accessible, visible `<figcaption>` so deep analytical context is available universally.

---

## Pillar 04 · Kinetic States (Interactive & Selection Lifecycle)

Elements in Elementa are physical objects on a digital canvas. They respond to touch, keyboard navigation, and mouse displacement with deliberate mechanical feedback.

### 1. The Six Core Interactive States
1. **Enabled (Idle Baseline)**:
   - Default receptive state waiting for user interaction.
   - Retains 100% opacity, crisp boundary contrast, and explicit pointer affordance.
2. **Disabled (Inert / Locked)**:
   - Suppresses pointer-events and focus tab-stops (`pointer-events-none`, `cursor-not-allowed`).
   - Mutes surface opacity (40-50%) while preserving text legibility.
   - *Rule*: Never disable a primary button silently. Always accompany with an explanatory tooltip or inline prerequisite.
3. **Focused (Keyboard Anchor)**:
   - Distinct 2px high-visibility outline with 2px spatial offset (`ring-2 ring-stroke-active-accent-primary ring-offset-2`).
   - Essential for keyboard navigation (WCAG 2.4.7 / 2.4.11). Never suppress with `outline: none`.
4. **Pressed / Active (Mechanical Force)**:
   - Physical compression simulation via `scale-[0.97]` or slight vertical translation with inset shadow.
   - Provides optical haptic feedback that pointer force has registered.
5. **Hovered (Pre-Intent Lift)**:
   - Anticipatory elevation (`-translate-y-1` or `brightness-105`) that confirms clickability before physical commitment.
   - Never gate critical content or actions exclusively behind hover.
6. **Dragged (Kinetic Motion)**:
   - Dynamic detachment from the layout grid with 3D rotational tilt (2-4°), elevated drop shadow, and `cursor: grabbing`.
   - Releases via damped harmonic spring physics back to the target drop zone.

### 2. The Persistent "Selected" State in Forms
Unlike transient interaction states, **Selected** denotes persistent semantic commitment in the system:
- **Switch**: Instantaneous binary activation taking effect immediately without form submission (e.g., auto-scale toggle).
- **RadioGroup**: Mutually exclusive single choice from 2-5 visible options where exactly one must remain selected.
- **Checkbox**: Additive multi-select allowing zero, one, or multiple independent options with binary or indeterminate (`aria-checked="mixed"`) states.

### 3. State Concurrency & Precedence Cascade
When multiple interaction states occur simultaneously, the hierarchy resolves deterministically:
1. **Priority 1 (Absolute Lock)**: `Disabled` cancels all hover, focus, press, and drag behaviors.
2. **Priority 2 (Spatial Accessibility)**: `Focused` outline visually supersedes `Hovered` styling to safeguard keyboard landmarks.
3. **Priority 3 (Physical Force)**: `Pressed` and `Dragged` mechanical deformation override resting `Hovered` elevation.
4. **Priority 4 (Pre-Intent)**: `Hovered` lifts the element upon pointer intersection.
5. **Priority 5 (Resting Baseline)**: `Enabled` idle state.

---

## Pillar 05 · Shapes Architecture (Expressive Geometry & Container Primitives)

Interfaces should not be prison yards of identical rounded rectangles. In Elementa, **Shapes** represent expressive geometric primitives—ranging from squircle squares to 10-sided decagons, Archimedean spiral circles, and 8-point starbursts—designed to inject curiosity and fun into clinical layouts.

### 1. The Geometric Spectrum
- **The Squircle / Rounded Square**: Continuous curvature envelope that maximizes content real estate while softening mathematical corners.
- **The Decagon**: 10-sided regular polygon with balanced 36° facets, offering a high-tech faceted envelope.
- **The Spiral Circle**: Dynamic expanding curve generating focal depth and curiosity in telemetry anchors.
- **The 8-Point Starburst**: Radial celebratory burst punctuating milestones, VIP statuses, and critical notifications.
- **The Quatrefoil / Bloom**: Symmetrical tangential petals providing organic warmth.

### 2. Functional Application: Shapes as Containers
Shapes are not isolated background clipart; they function as **structural envelopes that wrap other elements**:
- **Avatar Frames**: Decagons and squircles wrapping team member photos and initials to distinguish platform leads from automated service bots.
- **Card Header Icons**: Starbursts framing milestone achievements (e.g. 99.999% SLA uptime, early access keys).
- **Empty-State Anchors**: Spiral circles surrounding search or compass icons, converting unconfigured lists into engaging curiosity invitations.
- **Telemetry Tags**: Organic blooms framing percentage deltas and live throughput indicators.

### 3. The Truffle Oil Principle (The Sparingly Mandate)
Shapes are potent visual accents:
- **Maximum 1–2 Shapes per Viewport**: 90% of layout surfaces remain clean, calm, and serene. A single magnetic decagon avatar or starburst card header stands out only when the surrounding layout is disciplined.
- **Zero Kinetic Overkill**: Subtle rotational micro-animations (under 15° or continuous gentle 60s ambient drift). Never introduce frantic spinning shapes that trigger vestibular discomfort.
- **Dynamic Color Coupling**: Always drive SVG shape strokes via `stroke="currentColor"` and low-opacity fills (`fillOpacity="0.1"` to `0.2"`). Never hardcode static hex values into vector paths.

---

## Pillar 06 · Assets Architecture (Typography, Colors, Icons & Illustrations)

Assets constitute the fundamental sensory materials of Elementa. They govern typographic cadence, mathematical color ramps, crisp optical glyphs, and empathetic vector illustrations.

### 1. Typography Hierarchy & Semantic Scale
- **Font Triad**:
  - `--font-heading` (`Rowan`, Serif): Expressive editorial titles with high-contrast character (`H1` to `H6`).
  - `--font-body` (`Satoshi`, Sans-Serif): Humanist geometric prose balancing legibility and modern clarity (`Body`, `Subtitle1`, `Subtitle2`, `Button`, `Caption`).
  - `--font-code` (`JetBrains Mono`, Monospace): Precision engineering telemetry, code blocks, and data coordinates.
- **Typographic Roles**:
  - `H1`–`H3`: Editorial display anchors, hero headlines, and section titles (center-aligned across major page sections).
  - `H4`–`H6`: Structural sub-sections, card headers, and table column headers.
  - `Body`: Default prose and functional interface copy.
  - `Subtitle1` / `Subtitle2`: Medium-emphasis labels, navigation group titles, and control headers.
  - `Caption`: Compact metadata, timestamps, and helper descriptions (paired with `text-text-tertiary`).

### 2. The Color System (11-Step Mathematical Ramps)
- **5 Design Accents**:
  1. *Electric Violet* (`#9B6DF2` / `electric-violet-600`): High-frequency creative energy & primary brand interaction.
  2. *Terracotta Rust* (`#C1582F` / `terracotta-rust-600`): Volcanic warmth, destructive actions & high-urgency alerts.
  3. *Matcha Sage* (`#70A073` / `matcha-sage-600`): Botanical balance, verified success & healthy telemetry.
  4. *Dusty Rose* (`#C26D8F` / `dusty-rose-600`): Empathetic warmth, community tags & collaborative cursors.
  5. *Golden Hour* (`#DD9C00` / `golden-hour-600`): Luminous caution, pending async states & milestone achievements.
- **Surface Foundations**:
  - *Amber White Ramp (100–1100)*: Light theme paper foundation canvas.
  - *Gun Metal Ramp (100–1100)*: Dark workstation graphite canvas without OLED smear.
- **Feedback Systems**:
  - *Basil* (Success), *Tomato* (Destructive), *Corn* (Warning), *Blueberry* (Info), *Koala* (Disabled/Muted).

### 3. Vector Icon Ecosystem
- **Primary Source**: `elementa-icons` for native SVG React components with 1.5px / 2px optical stroke balance.
- **Utility Fallbacks**: `lucide-react` for extended developer tools and special administrative utilities.
- **Rules**: Icons must inherit `currentColor` and scale across standard 4px multiples (`16px`, `20px`, `24px`, `32px`, `48px`).

### 4. Storyset Emotional Vector Illustrations
- **Emotional UX Mapping**:
  - *Empty State*: Curiosity and onboarding encouragement over blank frustration.
  - *Error State*: Technical transparency and concrete self-healing remedies.
  - *Loading State*: Reassuring continuous feedback for async delays > 1.5s.
  - *Problem-Solution*: Architectural clarity and transformational value.
- **Theme Multi-Tenancy**: Every Storyset SVG is customized across the 5 accent energies (`ev`, `tr`, `ms`, `dr`, `gh`) for dynamic theme parity.

---

## Pillar 07 · Logos and Brand Identity Architecture

Logos are the signatures of software craftsmanship. Across Deriva and its product ecosystem, logos operate under two distinct optical lockup scales with mathematical isolation invariants.

### 1. Two Optical Scales & Lockup Taxonomy
- **Small (Icon Only / Logomark)**:
  - **Core Purpose**: High-density environments where typography would become sub-pixel noise.
  - **Environments**: Browser favicons, PWA application launcher tiles, collapsed command sidebars, mobile headers, social avatars, commit status badges.
  - **Aspect Ratio**: Strict 1:1 Square bounding box.
  - **Minimum Size**: `16px × 16px` (digital) / `5mm` (print). Below 16px, optical legibility fails.
- **Big (Wordmark / With Text)**:
  - **Core Purpose**: Authoritative full identity presentation pairing the logomark glyph with the refined product wordmark.
  - **Environments**: Global application navigation bars, documentation mastheads, invoice headers, keynotes, social banners.
  - **Aspect Ratio**: 3:1 Horizontal lockup.
  - **Minimum Size**: `24px` height (digital) / `10mm` (print). Below 24px height, wordmark counterspaces blur.

### 2. Ecosystem Asset Matrix & Download Standards
- **Brand Verified Assets**:
  - All brand logos must originate strictly from `@public/logos/` (Deriva: `public/logos/deriva/`, Tallileo: `public/logos/tallileo/`) or root SVG vector masters (`/logo-small.svg`, `/logo-big-*.svg`).
  - Never fabricate unofficial logos or scrape external vectors.
- **Multi-Product Spectrum**:
  - *Deriva*: Parent platform & software systems (Available in 512, 1024, 2048, 5000, 4K alpha/solid PNGs).
  - *Elementa*: Universal design system (Available in master SVG and 5 accent energy variants: `ev`, `tr`, `ms`, `gh`, `dr`).
  - *Tallileo*: Workflow intelligence and workspace suite (Available in 512, 1024, 2048, 5000, 4K alpha/solid PNGs).
  - *Claro* & *Khelo*: Scheduled in pipeline staging for verified brand rollout.

### 3. Clear Space Equation & Architectural Isolation
- **The X-Clearance Equation**:
  - Minimum exclusion zone dimension `X` is equal to **50% of the logomark height**.
  - No typography, borders, interactive buttons, or illustrations may enter this exclusion boundary.
- **Header Padding Rules**:
  - Global navigation headers must provide at least `24px` vertical padding and `32px` horizontal padding around the big wordmark.
- **Co-Branding**:
  - Partner or sub-brand lockups must be partitioned by a `1px` vertical divider hairline flanked by `2X` clearance on both lateral flanks.

### 4. Integrity Laws (Prohibited Manipulations)
1. **Never Distort**: Always preserve 1:1 (Small) and horizontal proportions (Big). Never stretch or squash.
2. **Never Recolor Outside Brand Spec**: Never apply unauthorized neon gradients, random hex codes, or inverted filters.
3. **Never Apply Raster Drop Shadows**: Do not apply heavy CSS drop shadows (`drop-shadow-lg`), outer glows, or bevels.
4. **Never Rotate or Skew**: Lockups must always rest parallel to the horizontal baseline of the viewport.

---

## Pillar 08 · Micro-animations and Motion Kinetics

Movement in Elementa is physical, tactile, and purposeful. Interfaces feel organic and responsive because motion adheres strictly to Newtonian spring mechanics rather than artificial linear keyframes.

### 1. Spring-Based Motion & The Tactile Bounce
- **Why Springs Over Easing Curves**:
  - Springs conserve physical momentum and are fully **interruptible** mid-flight without snapping or velocity resets.
  - Linear animations feel synthetic and robotic; cubic-bezier curves lack kinetic responsiveness when targets shift dynamically.
- **The Tactile Bounce Ratio**:
  - Damping ratio $\zeta \in [0.75, 0.95]$ provides subtle physical feedback upon settling without cartoon elasticity.
- **Core Physics Archetypes**:
  - *Snappy UI*: `stiffness: 420, damping: 30, mass: 0.8` (Tabs, pills, toggles, micro-buttons).
  - *Tactile Bounce*: `stiffness: 340, damping: 18, mass: 1` (Puck gestures, favorite pops, notification badges).
  - *Gentle Float*: `stiffness: 220, damping: 26, mass: 1.2` (Modals, drawers, bottom sheets).
  - *Critically Damped*: `stiffness: 500, damping: 45, mass: 1` (Precision dropdowns, zero overshoot).

### 2. The Goldilocks Zone & Time Budgets
- **Perceptual Boundaries**:
  - **< 100ms (Jarring / Glitch)**: Skips optical tracking, perceived as rendering artifacts or dropped frames.
  - **150ms – 300ms (Sweet Spot)**: Frictionless confirmation window. Immediate, tactile, and natural.
  - **> 500ms (Laggy / Sluggish)**: Blocks user flow, perceived as device lag or unoptimized code.
- **Spatial Time Budgets**:
  - *Micro-Actions (100ms–150ms)*: Button press depth (`scale: 0.96`), switch toggle, checkbox draw.
  - *Component Unfolds (200ms–250ms)*: Dropdown menus, tooltips, popovers, accordions.
  - *Structural Overlays (280ms–350ms)*: Dialog modals, bottom sheets, command palettes.
  - *View Transitions (400ms–500ms)*: Shared layout transitions, page routing with choreographed staggers.

### 3. Motion Taxonomy (Vector, Component, Page)
- **Tier 01: Vector SVG Kinetics**:
  - Progressive stroke reveals (`pathLength: 0` to `1` via `strokeDasharray`).
  - Angular oscillation for alert badges (bell chimes) and scale blooms for status hearts.
- **Tier 02: UI Component Springs**:
  - Shared layout morphing using Framer Motion (`layoutId="activePillBubble"`) for seamless tab indicators.
  - Natural height interpolation on disclosures without hardcoded CSS `max-height` hacks.
- **Tier 03: Page Transitions & Accessibility**:
  - Multi-element arrivals sequenced via `staggerChildren: 0.08` to prevent simultaneous visual floods.
  - Strict compliance with `prefers-reduced-motion`: transforms dissolve to instant zero-displacement opacities (`opacity: 1` instantly) to honor vestibular health (WCAG 2.2 Criterion 2.3.3).

---

## Pillar 09 · Keyboard-First Input Architecture

The keyboard is a surgical command instrument that grants power operators 10× execution speed. Every workflow in Elementa must offer 100% mouseless parity.

### 1. Velocity & Ergonomic Mandates
- **Zero Pointer Latency**: Hand repositioning from keyboard to mouse and targeting UI costs ~1,500ms; keyboard chords execute in < 200ms.
- **Preservation of Cognitive Flow**: Shortcuts bypass visual scanning, leveraging spinal muscle memory to preserve deep working context.
- **Ergonomic Longevity**: Neutral home-row typing prevents pronation-induced repetitive strain injuries (RSI).
- **Universal Accessibility (WCAG 2.2 Level AA)**: Keyboard parity is a strict compliance baseline for screen readers, switch hardware, and assistive inputs.

### 2. Two Traversal Modalities: Shortcuts vs. Focus
- **Direct Shortcuts (Chords & Sequences)**:
  - *Global Action Chords*: `⌘K` (Command Palette), `⌘S` (Save/Commit), `⌘Enter` (Fast Submit), `⌘Z` (Undo).
  - *Sequential Mode Keys*: Vim-style `G then D` (Go to Dashboard), `G then S` (Go to Settings), `/` (Focus Filter Field), `?` (Show Cheatsheet).
- **Focus Flow & Sequential DOM Traversal**:
  - *Predictable Tab Order*: Logical reading sequence following visual hierarchy (`Tab` forward, `⇧Tab` backward).
  - *Roving tabIndex Invariant*: In composite widgets (toolbars, tab groups, data grids), only one item holds `tabIndex="0"`; directional arrows (`←`, `→`, `↑`, `↓`) shift active focus with `tabIndex="-1"`.
  - *Visible High-Contrast Rings*: Enforce `focus-visible:ring-2 focus-visible:ring-stroke-active-accent-primary focus-visible:ring-offset-2`. Focus rings must never be globally suppressed with `outline: none` without replacement.
  - *Modal Esc Restoration*: Pressing `Escape` closes overlays and immediately restores focus to the invoking trigger.

### 3. Core Workflow Shortcut Standard
- **Navigation & Search**:
  - `⌘K`: Universal Command Palette & Search.
  - `/`: Focus search/filter field.
  - `G` then `D`: Go to Dashboard.
  - `?`: Shortcut cheat sheet overlay.
- **Data Editing & Forms**:
  - `⌘S`: Save mutations.
  - `⌘Enter`: Submit active dialog/form.
  - `⌘Z` / `⇧⌘Z`: Undo / Redo state.
  - `⌘D`: Duplicate active record.
- **Spatial Selection (Lists & Grids)**:
  - `J` / `↓`: Move cursor down.
  - `K` / `↑`: Move cursor up.
  - `X`: Toggle item selection checkbox.
  - `Space`: Quick Look peek modal.
  - `*`: Select all records.
- **Workspace Window Controls**:
  - `⌘B`: Toggle collapsible navigation rail.
  - `⌘\`: Split workspace panel.
  - `Esc`: Dismiss layer or clear selection.

### 4. UI Hint Affordances & Cheatsheet Deliverables
- **Right-Aligned Menu Hotkeys**: Menus must display right-aligned `<kbd>` chips.
- **Tooltip Inset Badges**: Pair button tooltips with explicit keyboard chords (e.g. `Save mutations [⌘S]`).
- **Proactive Ephemeral Toasts**: When a user clicks a common action 3+ times via mouse, present an ephemeral pro-tip toast: *"Speed tip: Press ⌘S next time!"*.
- **Printable Desk Reference Codex**: Maintain official 300 DPI downloadable cheatsheet cards for macOS and Windows/Linux developer workstations.


