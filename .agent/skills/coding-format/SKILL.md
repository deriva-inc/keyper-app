---
name: coding-format
description: >-
    Standardized coding conventions, documentation style, architecture design choices,
    and formatting rules for building enterprise Next.js applications consistent with the repository.
---

# Enterprise Codebase Standards & Format Specification
This skill serves as the canonical blueprint for developing, structuring, and maintaining applications following the repository's exact engineering standards. Any new repository or service module scaffolded under this skill must adhere strictly to these patterns.

---

## 1. Core Toolchain & Configuration Standards
### 1.1 Prettier Configuration (`prettier.config.js`)
All code must adhere to the following Prettier rules:

- **Indent**: 4 spaces (`tabWidth: 4`, no hard tabs).
- **Quotes**: Single quotes (`singleQuote: true`).
- **Semicolons**: Always required (`semi: true`).
- **Line Length**: 80 characters (`printWidth: 80`).
- **Trailing Commas**: ES5 compatible (`trailingComma: 'es5'`).
- **Arrow Functions**: Avoid parentheses for single arguments (`arrowParens: 'avoid'`).
- **Bracket Spacing**: Enabled (`bracketSpacing: true`).
- **Plugins**: `prettier-plugin-tailwindcss` for class sorting.

```javascript
module.exports = {
    plugins: ['prettier-plugin-tailwindcss'],
    semi: true,
    singleQuote: true,
    tabWidth: 4,
    printWidth: 80,
    trailingComma: 'es5',
    arrowParens: 'avoid',
    bracketSpacing: true,
};
```

### 1.2 TypeScript Configuration (`tsconfig.json`)
- Strict type checking enabled (`strict: true`).
- Index signature safety enabled (`noUncheckedIndexedAccess: true`).
- Use relative paths always for easier bundling: `./*`.
- Modern target and module: `target: "es5"`, `module: "esnext"`, `moduleResolution: "node"`.
- Use `@total-typescript/ts-reset` in `reset.d.ts` for type-safe built-ins (e.g. `JSON.parse` returns `unknown`, `fetch` types).

### 1.3 Import Ordering & Grouping (`eslint.config.mjs`)
Always enable alphabetical sorting of imports for easier lookup.
Imports within each group must be **alphabetized** (case-insensitive). No blank lines between two imports. All imports must be consecutive.
Unused variables must use leading underscore ignore patterns: `^_`.
Here is an example:

```typescript
import { Button } from 'get-elementa-ui';
import { Text } from 'get-elementa-ui';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';
import { cn } from 'get-elementa-ui';
import type { ServiceItem } from './services/servive1/types';
```

---

## 2. Documentation & Commenting Standards
### 2.1 File Header Comments
Every file must begin with a concise JSDoc comment describing its responsibility:

```typescript
/** This file contains the service functions for the inference service. */
```

```typescript
/** This page renders the compute instances management interface on the UI. */
```

```typescript
/** Store for managing the state of the inference models page. */
```

### 2.2 Section Delimiters (`// SECTION:` & `// !SECTION:`)

Code inside types, components, pages, and stores **MUST** be structured into explicit, searchable comment sections:

#### Section Blocks in Types (`types.ts`):
```typescript
// SECTION: Constants
const STATUS_OPTIONS = ['ACTIVE', 'INACTIVE'] as const;
// !SECTION: Constants

// SECTION: Export Constants
export { STATUS_OPTIONS };
// !SECTION: Export Constants

// SECTION: Zod Schemas
const ItemSchema = z.object({
    id: z.string(),
    name: z.string(),
});
// !SECTION: Zod Schemas

// SECTION: Export Zod Schemas
export { ItemSchema };
// !SECTION: Export Zod Schemas

// SECTION: TypeScript Types
type Item = z.infer<typeof ItemSchema>;
// !SECTION: TypeScript Types

// SECTION: Export TypeScript Types
export type { Item };
// !SECTION: Export TypeScript Types
```

#### Section Blocks in React Components / Pages:
```typescript
export default function ServiceManager() {
    // SECTION: Constants and Variables
    const defaultPageSize = 20;
    // !SECTION: Constants and Variables

    // SECTION: States
    const [searchTerm, setSearchTerm] = useState('');
    // !SECTION: States

    // SECTION: Functions
    const formatTimestamp = (date: string) => { ... };
    // !SECTION: Functions

    // SECTION: Event Handlers
    const handleSearchChange = (value: string) => { ... };
    // !SECTION: Event Handlers

    // SECTION: API Calls
    const loadServiceData = async () => { ... };
    // !SECTION: API Calls

    // SECTION: Side Effects
    useEffect(() => {
        loadServiceData();
    }, []);
    // !SECTION: Side Effects

    // SECTION: UI
    return (
        <div className="flex flex-col gap-4">
            {/* Header Toolbar */}
            ...
        </div>
    );
    // !SECTION: UI
}
```

#### Section Blocks in Zustand Stores:
```typescript
const useServiceStore = create<ServiceState & ServiceActions>((set, get) => ({
    // SECTION: State
    items: [],
    isLoading: false,
    // !SECTION: State

    // SECTION: Actions
    setItems: items => set({ items }),
    fetchItems: async () => { ... },
    // !SECTION: Actions
}));
```

### 2.3 Function & Method JSDoc
All exported functions, service calls, and non-trivial handlers must have JSDoc blocks:

```typescript
/**
 * This function fetches models from the network with optional filters, sorting, and pagination.
 *
 * @param searchParams - The search params including query, filters, sort_by, sort_order, page, page_size.
 * @returns A promise that resolves to a ModelsResponse or a ClientSideError.
 */
```

---

## 3. Architectural Design Choices
### 3.1 Service-Driven Modular Architecture (`services/`)
Application logic is partitioned into standalone domain packages under `services/<service-name>/`:

```
services/<service-name>/
├── components/         # Service-specific UI components
│   ├── ServiceCard.tsx
│   ├── ServiceTable.tsx
│   └── ServiceFilters.tsx
├── stores/             # Zustand state management stores
│   └── use-<service>-store.ts
├── constants.ts        # Enums, static options, display mappings
├── network.ts          # Client-side API caller functions
├── types.ts            # Zod schemas and inferred TypeScript types
└── utils.ts            # Service-specific data mappers and adapters
```

- Use React composition pattern to break down bigger components into smaller one.
- Always create constants in the separate `constants.ts` file for that service/feature. Combine all the constants for a particular service/feature in one single `constants.ts` file. Don't create multiple files for sub-features.
- First create a single file for whatever you are doing. Analyze the work being done in the file. Always follow the principle of pushing down the logic of the component into sub-components. If a component is becoming too large, it's a signal to break it down into smaller components.

### 3.2 Schema-First Typing (Zod + TypeScript Inference)
- **Always** define data structures with Zod schemas first.
- Infer TypeScript types directly from schemas via `z.infer<typeof Schema>`.
- Client-side entities use **camelCase**.
- External backend entities using **snake_case** are mapped via helper adapters in `utils.ts` (e.g., `convertKeysToCamelCase` or dedicated `adapt<Entity>` functions).

### 3.3 Network & API Layer Architecture
#### Client-Side Network Functions (`services/<service>/network.ts`)

- Use the naming conventions:
    - `fetch<Entity>FromNetwork(...)`
    - `create<Entity>InNetwork(...)`
    - `update<Entity>InNetwork(...)`
    - `delete<Entity>FromNetwork(...)`
- Always return a union of `Promise<<SuccessResponse> | ClientSideError>`.
- Always wrap in `try/catch` and route errors through `handleErrorOnClientSideAPICalls(error)`.
- Client calls invoke internal Next.js API routes (`/api/<service>/...`), passing needed credentials via headers and session tokens from local storage / IndexedDB.

```typescript
/** This file contains the service functions for the user service. */

import type { UserProfile, UserProfileResponse } from '@/service/user/types';
import {
    ClientSideError,
    handleErrorOnClientSideAPICalls,
} from 'get-elementa-ui';

/**
 * This function fetches the current user profile from the network.
 *
 * @returns A promise that resolves to UserProfileResponse or a ClientSideError.
 */
export const fetchUserProfileFromNetwork = async (): Promise<
    UserProfileResponse | ClientSideError
> => {
    try {
        const response = await fetch('/api/user/profile', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = (await response.json()) as UserProfileResponse;
        return data;
    } catch (error: any) {
        return handleErrorOnClientSideAPICalls(error);
    }
};
```

#### Next.js Route Handlers (`app/api/<service>/.../route.ts`)
- Act as the Backend-For-Frontend (BFF) proxy to upstream microservices (`process.env.SERVER_BASE_URL`).
- Read headers (`x-account-id`, `x-user-id`, `Authorization`).
- Log operations with `logger.info(...)`, `logger.error(...)`, `logger/debug(...)`, and `logger.warn(...)`.
- Always put log statements in `route.ts` files like:
```typescript
logger.info(`[GET → /v1/registry/entities] Fetching datasets (q: "${params.q || ''}", limit: ${params.limit || 50})`);
```
- Standardize status codes using `HTTP_STATUS_CODE` from `@/app/api/types`.
- Use `handleErrorOnServerSideAPICalls(...)` in catch blocks.
- Whenever you are implementing an API, remove all mock data, development fallback, and etc. The UI should only show data coming from the BE platform or smart nulls/defaults. Not mock data that does not exist anywhere.

```typescript
import { NextResponse } from 'next/server';
import {
    HTTP_STATUS_CODE,
    ServerSideResponse,
    handleErrorOnServerSideAPICalls,
    logger
} from '@aion-intelligence/utils';

/** Fetch User Profile */
export async function GET(req: Request) {
    const accountId = req.headers.get('x-account-id') as string;
    const userId = req.headers.get('x-user-id') as string;

    logger.info(
        `Fetching profile for user: ${userId} in account: ${accountId}`
    );

    try {
        const response = await fetch(
            `${process.env.SERVER_BASE_URL}/users/${userId}`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'x-account-id': accountId,
                    'x-user-id': userId,
                    Authorization: req.headers.get('authorization') as string,
                },
            }
        );

        const data = (await response.json()) as ServerSideResponse;

        if (!response.ok) {
            return NextResponse.json(data, {
                status: HTTP_STATUS_CODE.INTERNAL_ERROR,
            });
        }

        return NextResponse.json(data, { status: HTTP_STATUS_CODE.SUCCESS });
    } catch (error: unknown) {
        return handleErrorOnServerSideAPICalls(
            error,
            'Failed to fetch user profile.',
            HTTP_STATUS_CODE.INTERNAL_ERROR,
            '/api/user/profile'
        );
    }
}
```

### 3.4 State Management Strategy
1. **Component State**: Ephemeral UI toggles, local inputs (`useState`, `useRef`).
2. **Context (useContext)**:
    - Use when it is neither specific to a component or on a global level.
    - A state that needs to be shared with related components, e.g. `Stepper` component.
3. **Service/Global State**: Zustand stores (`zustand`).
    - Define split interfaces: `interface <Service>State` and `interface <Service>Actions`.
    - Create typed store: `create<<Service>State & <Service>Actions>((set, get) => ({ ... }))`.
    - Use explicit action methods to mutate state.

### 3.5 Design System & UI Principles (Very Important to Follow)

#### 3.5.1 Primitives
- Always use primitives from `get-elementa-ui` first and foremost.
- If a primitive is not present in `get-elementa-ui`, then use Radix UI headless components (`@radix-ui/react-*`).

#### 3.5.2 Variants
- Use Class Variance Authority (`cva`) for styling component states and variants.

#### 3.5.3 Components, Composition & Class Merging
- **Components**: **STRICTLY** use components from `get-elementa-ui` library instead of creating new ones. If a component is not available in the library, create one following the same patterns and guidelines.
- **Composition**: Use Radix `Slot` (`asChild?: boolean`) so buttons or interactive components can wrap Next.js `<Link>` seamlessly.
- **Class Merging**: `cn(...)` utility (`clsx` + `tailwind-merge`) is mandatory for all dynamic class generation.
- **No Ad-Hoc Component Overrides**: Do not put custom classes on `get-elementa-ui` library components and blocks unless specifically required for layout placement.

#### 3.5.4 Design Tokens & Dynamic Energy Mappings
Tailwind v4 `@theme` tokens are defined in `get-elementa-ui/dist/theme.css` and `get-elementa-ui/dist/energies/*.css`. Only use colors, strokes, and text classes from these files. Never use generic Tailwind classes (e.g., `text-red-500`, `bg-gray-100`) or opacity modifiers (`/50`, `/80`).

##### Consolidated Semantic Tokens Table (Layers 1–4)

| Layer | Category | Tailwind Utility | CSS Variable | Light Mode (`amber-white`) | Dark Mode (`gun-metal`) | Functional Role |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Layer 1** | Base Surface | `bg-bg-base-primary` | `--bg-base-primary` | `amber-white-100` (`#FCFCFB`) | `gun-metal-1100` (`#111418`) | Root workspace canvas & infinite floor |
| **Layer 1** | Flat Surface | `bg-bg-flat-primary` | `--bg-flat-primary` | `amber-white-200` (`#F9F9F8`) | `gun-metal-1000` (`#1A1E24`) | Sidebars, primary cards & input wells |
| **Layer 1** | Base Stroke | `border-stroke-base-primary` | `--stroke-base-primary` | `gun-metal-1000` (`#1A1E24`) | `amber-white-200` (`#F9F9F8`) | Root canvas & section divider stroke |
| **Layer 1** | Flat Stroke | `border-stroke-flat-primary` | `--stroke-flat-primary` | `gun-metal-900` (`#232932`) | `amber-white-300` (`#F6F6F6`) | Recessed well & input boundary stroke |
| **Layer 1** | Base Accent 1 | `bg-bg-base-accent-primary` | `--bg-base-accent-primary` | `<primary>-200` *(Dynamic)* | `<primary>-900` *(Dynamic)* | Primary energy section wash |
| **Layer 1** | Base Accent 2 | `bg-bg-base-accent-secondary` | `--bg-base-accent-secondary` | `<secondary>-200` *(Dynamic)* | `<secondary>-900` *(Dynamic)* | Secondary energy section wash |
| **Layer 1** | Disabled / Muted | `bg-bg-disabled`<br>`bg-bg-muted`<br>`border-stroke-disabled` | `--bg-disabled`<br>`--bg-muted`<br>`--stroke-disabled` | `disabled-amber` (`#969696`)<br>`muted` (`#BFBFBF`)<br>`stroke-disabled-amber` (`#7A7A7A`) | `disabled-gun-metal` (`#343434`)<br>`muted` (`#BFBFBF`)<br>`stroke-disabled-gun-metal` (`#4D4D4D`) | Inert controls, tab tracks & disabled borders |
| **Layer 2** | Raised Surfaces | `bg-bg-raised-primary`<br>`bg-bg-raised-secondary` | `--bg-raised-primary`<br>`--bg-raised-secondary` | `amber-white-300` (`#F6F6F6`)<br>`amber-white-400` (`#F3F4F5`) | `gun-metal-900` (`#232932`)<br>`gun-metal-800` (`#2D343E`) | Elevated bento cards & nested card wells |
| **Layer 2** | Raised Strokes | `border-stroke-raised-primary`<br>`border-stroke-raised-secondary` | `--stroke-raised-primary`<br>`--stroke-raised-secondary` | `gun-metal-700` (`#373F4A`)<br>`gun-metal-600` (`#404956`) | `amber-white-400` (`#F3F4F5`)<br>`amber-white-500` (`#EFF0F2`) | Elevated card & nested well borders |
| **Layer 2** | Neutral Text | `text-text-primary`<br>`text-text-secondary`<br>`text-text-tertiary`<br>`text-text-disabled` | `--text-primary`<br>`--text-secondary`<br>`--text-tertiary`<br>`--text-disabled` | `gun-metal-1100` (`#111418`)<br>`gun-metal-500` (`#5F6874`)<br>`gun-metal-300` (`#9DA6AF`)<br>`text-on-disabled` (`#696969`) | `amber-white-100` (`#FCFCFB`)<br>`amber-white-700` (`#C8C9CC`)<br>`amber-white-900` (`#828385`)<br>`text-on-disabled` (`#696969`) | Headings, body prose, captions/metadata & disabled copy *(never use `text-text-muted`)* |
| **Layer 2** | Energy Text | `text-text-accent-primary`<br>`text-text-accent-secondary` | `--text-accent-primary`<br>`--text-accent-secondary` | `<primary>-600` *(Dynamic)*<br>`<secondary>-600` *(Dynamic)* | `<primary>-400` *(Dynamic)*<br>`<secondary>-400` *(Dynamic)* | Dynamic primary & secondary accent text |
| **Layer 2** | Status Text | `text-text-success`<br>`text-text-destructive`<br>`text-text-info`<br>`text-text-warning` | `--text-success`<br>`--text-destructive`<br>`--text-info`<br>`--text-warning` | `basil-amber-dark` (`#116932`)<br>`tomato-amber-dark` (`#AC2F2B`)<br>`blueberry-amber-dark` (`#20508E`)<br>`corn-amber-dark` (`#946600`) | `basil-gun-metal-light` (`#5EDB8B`)<br>`tomato-gun-metal-light` (`#FF8078`)<br>`blueberry-gun-metal-light` (`#7CC0FF`)<br>`corn-gun-metal-light` (`#F8C13E`) | Basil, Tomato, Blueberry & Corn semantic text |
| **Layer 3** | Modal Surfaces & Strokes | `bg-bg-modal-primary`<br>`bg-bg-modal-secondary`<br>`border-stroke-modal-primary`<br>`border-stroke-modal-secondary` | `--bg-modal-primary`<br>`--bg-modal-secondary`<br>`--stroke-modal-primary`<br>`--stroke-modal-secondary` | `amber-white-500` (`#EFF0F2`)<br>`amber-white-600` (`#ECECEF`)<br>`gun-metal-500` (`#5F6874`)<br>`gun-metal-400` (`#7E8793`) | `gun-metal-700` (`#373F4A`)<br>`gun-metal-600` (`#404956`)<br>`amber-white-600` (`#ECECEF`)<br>`amber-white-700` (`#C8C9CC`) | Dialogs, sheets, drawers, popovers & menus |
| **Layer 3** | Feedback Surfaces & Strokes | `bg-bg-<status>`<br>`bg-bg-fill-<status>`<br>`bg-bg-hover-<status>`<br>`border-stroke-<status>` | `--bg-<status>`<br>`--bg-fill-<status>`<br>`--bg-hover-<status>`<br>`--stroke-<status>` | 18% OKLCH mix<br>Solid status amber<br>9% OKLCH mix<br>Solid status amber | 18% OKLCH mix<br>Solid status gun-metal<br>9% OKLCH mix<br>Solid status gun-metal | `<status>` $\in$ `{success, destructive, info, warning}` |
| **Layer 4** | Neutral Active Controls | `bg-bg-active-primary`<br>`bg-bg-active-secondary`<br>`border-stroke-active-primary`<br>`border-stroke-active-secondary` | `--bg-active-primary`<br>`--bg-active-secondary`<br>`--stroke-active-primary`<br>`--stroke-active-secondary` | `amber-white-700` (`#C8C9CC`)<br>`amber-white-800` (`#A5A6A8`)<br>`gun-metal-300` (`#9DA6AF`)<br>`gun-metal-200` (`#BCC2C9`) | `gun-metal-500` (`#5F6874`)<br>`gun-metal-400` (`#7E8793`)<br>`amber-white-800` (`#A5A6A8`)<br>`amber-white-900` (`#828385`) | Table headers (`thead`), footers (`tfoot`), row hovers & neutral triggers |
| **Layer 4** | Energy Active Controls | `bg-bg-active-accent-<ch>`<br>`bg-bg-active-hover-accent-<ch>`<br>`bg-bg-active-fill-accent-<ch>`<br>`border-stroke-active-accent-<ch>` | `--bg-active-accent-<ch>`<br>`--bg-active-hover-accent-<ch>`<br>`--bg-active-fill-accent-<ch>`<br>`--stroke-active-accent-<ch>` | `<ch>-600` *(Dynamic)*<br>`<ch>-400` *(Dynamic)*<br>`<ch>-100` *(Dynamic)*<br>`<ch>-400` *(Dynamic)* | `<ch>-400` *(Dynamic)*<br>`<ch>-200` *(Dynamic)*<br>`<ch>-1000` *(Dynamic)*<br>`<ch>-200` *(Dynamic)* | `<ch>` $\in$ `{primary, secondary}`; CTAs, active tabs, focus rings & soft fill wells |
| **Layer 4** | Chart Series | `bg-chart-primary-1..5`<br>`bg-chart-secondary-1..5`<br>`bg-chart-3`<br>`bg-chart-4` | `--chart-primary-1..5`<br>`--chart-secondary-1..5`<br>`--chart-3`<br>`--chart-4` | `<primary>-400..800`<br>`<secondary>-400..800`<br>`<accent1>-600`<br>`<accent2>-600` | `<primary>-200..600`<br>`<secondary>-200..600`<br>`<accent1>-400`<br>`<accent2>-400` | Dynamic 5-step chart ramps & comparative series |

##### 10 Energy Theme Channel Bindings Table

| Energy Theme | `data-energy` ID | Code | Primary (`<primary>`) | Secondary (`<secondary>`) | Chart 3 (`<accent1>`) | Chart 4 (`<accent2>`) |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Acoustic Wood** | `acoustic-wood` | `aw` | `terracotta-rust` (`tr`) | `dusty-rose` (`dr`) | `matcha-sage` (`ms`) | `electric-violet` (`ev`) |
| **Cipher Vault** | `cipher-vault` | `cv` | `electric-violet` (`ev`) | `matcha-sage` (`ms`) | `dusty-rose` (`dr`) | `terracotta-rust` (`tr`) |
| **Crema Extraction** | `crema-extraction` | `ce` | `terracotta-rust` (`tr`) | `golden-hour` (`gh`) | `dusty-rose` (`dr`) | `electric-violet` (`ev`) |
| **Dawn Chorus** | `dawn-chorus` | `dc` | `golden-hour` (`gh`) | `dusty-rose` (`dr`) | `electric-violet` (`ev`) | `terracotta-rust` (`tr`) |
| **Dusk Bloom** | `dusk-bloom` | `db` | `dusty-rose` (`dr`) | `electric-violet` (`ev`) | `golden-hour` (`gh`) | `matcha-sage` (`ms`) |
| **Event Horizon** | `event-horizon` | `eh` | `electric-violet` (`ev`) | `terracotta-rust` (`tr`) | `matcha-sage` (`ms`) | `golden-hour` (`gh`) |
| **Maker's Canvas** | `makers-canvas` | `mc` | `terracotta-rust` (`tr`) | `matcha-sage` (`ms`) | `electric-violet` (`ev`) | `golden-hour` (`gh`) |
| **Neon Symphony** | `neon-symphony` | `ns` | `electric-violet` (`ev`) | `golden-hour` (`gh`) | `dusty-rose` (`dr`) | `matcha-sage` (`ms`) |
| **Tropical Grid** | `tropical-grid` | `tg` | `matcha-sage` (`ms`) | `golden-hour` (`gh`) | `terracotta-rust` (`tr`) | `dusty-rose` (`dr`) |
| **Zen Toolkit** | `zen-toolkit` | `zt` | `matcha-sage` (`ms`) | `dusty-rose` (`dr`) | `golden-hour` (`gh`) | `terracotta-rust` (`tr`) |

#### 3.5.5 Sizing & Spacing
Strictly use the spacing scale, screen zone dimensions, harmonic grid divisions, touch target rules, and responsive breakpoints defined in `../design-with-elementa/SKILL.md`. Arbitrary pixel sizing/spacing (e.g., `p-[13px]`, `gap-[19px]`, `w-[347px]`) is forbidden.

| Dimension Category | Allowed Scale / Tokens | Usage Rules |
| :--- | :--- | :--- |
| **4px Atomic Spacing Scale** | `space-px` (1px), `0.5` (2px), `1` (4px), `1.5` (6px), `2` (8px), `2.5` (10px), `3` (12px), `4` (16px), `5` (20px), `6` (24px), `8` (32px), `10` (40px), `12` (48px), `16` (64px), `20` (80px), `24` (96px), `32` (128px) | Use the same numeric scale for `p-*`, `px-*`, `py-*`, `m-*`, `gap-*`, and `space-*`. `4` (16px) is the Base Content Unit; `1` (4px) is the Base Atom. |
| **Screen Zone Dimensions** | Header: `h-16` / `h-20`<br>Primary Sidebar: `w-60` / `w-64` (Collapsed rail: `w-16`)<br>Right Inspector Rail: `w-72` to `w-88`<br>Mobile Companion Dock: `h-16` | Maintain consistent anatomical shell dimensions across all pages and layouts. |
| **Touch & Hit Targets** | Minimum physical hit box: `48px × 48px` (`size-12` / `space-12`)<br>Visual footprints: `40px` (`h-10`), `32px` (`size-8`), `24px` (`size-6`)<br>Adjacent target gap: minimum `8px` (`gap-2`) | Expand compact visual controls (`size-6`, `size-8`) to `48px` physical hit areas via `after:absolute after:-inset-2`. |
| **Border Radius** | `rounded-sm` (4px), `rounded-lg` (8px), `rounded-xl` (10px–14px), `rounded-2xl` (16px), `rounded-3xl` (24px) | Tied to `--radius: 0.625rem`. Never use arbitrary radii like `rounded-[19px]`. |
| **Responsive Breakpoints** | `sm` (640px, 16px margin, 12px gutter)<br>`md` (768px, 24px margin, 16px gutter)<br>`lg` (1024px, 32px margin, 20px gutter)<br>`xl` (1280px, 40px margin, 24px gutter)<br>`2xl` (1536px, 48px margin, 24px gutter)<br>`3xl` (1920px, 64px margin, 32px gutter)<br>`4xl` (2560px, 80px margin, 32px gutter) | Design Large-First and realign down to `400px` mobile viewports without horizontal overflow. |

#### 3.5.6 Typography & Section Headers
- STRICTLY always use the `Text` component (`get-elementa-ui`) for all text rendering. Never use raw HTML text tags (`<p>`, `<span>`, `<h1>`–`<h6>`).
- Center-align section headings (`text-center mx-auto`).
- Do not customize `Text` on the fly with arbitrary font sizes like `text-[10px]`. Use `TextVariant.Body` as the primary prose variant and `H1`–`H6`, `Subtitle1`, `Subtitle2`, `Button`, `Caption` for hierarchy.
- `font-mono` is strictly reserved for numbers, token names, and code in dashboard/code-block contexts. `font-body` (`Satoshi`) is the main UI typography; `font-heading` (`Rowan`) is the editorial display typography.

#### 3.5.7 Icons
- Use icons from the `elementa-icons` library (`https://elementa.dev/icons/list`).
- Maintain a tracking list (`icon-name` and `icon-url`) for icons not yet available in `elementa-icons`, and use `lucide-react` as the fallback.
- Scale icons strictly on 4px multiples (`16px`, `20px`, `24px`, `32px`, `48px`).

#### 3.5.8 Illustrations (5-Color Folder Architecture)
Illustrations are sourced from [Storyset](https://storyset.com) and stored in `public/illus/` with **5 brand color variants** per illustration so they dynamically adapt when the user switches Energy themes:

| Brand Color | 2-Letter Code | Key Hex (`600`) | File Suffix / Name |
| :--- | :--- | :--- | :--- |
| **Electric Violet** | `ev` | `#9B6DF2` | `ev.svg` or `<slug>-ev.svg` |
| **Dusty Rose** | `dr` | `#C26D8F` | `dr.svg` or `<slug>-dr.svg` |
| **Matcha Sage** | `ms` | `#70A073` | `ms.svg` or `<slug>-ms.svg` |
| **Terracotta Rust** | `tr` | `#C1582F` | `tr.svg` or `<slug>-tr.svg` |
| **Golden Hour** | `gh` | `#DD9C00` | `gh.svg` or `<slug>-gh.svg` |

1. **Directory Organization under `public/illus/`**:
   - **Single-Illustration State Folders** (`public/illus/empty-state/`, `public/illus/error-state/`, `public/illus/loading-state/`): Store the 5 SVGs named directly by their 2-letter color code (`ev.svg`, `dr.svg`, `ms.svg`, `tr.svg`, `gh.svg`).
   - **Multi-Illustration Feature Folders** (`public/illus/home/`, `public/illus/ia/`, `public/illus/<feature>/`): Store all 5 variants per illustration named `<illustration-slug>-<code.svg>` (e.g., `prob-sol-ev.svg`, `prob-sol-dr.svg`, `prob-sol-ms.svg`, `prob-sol-tr.svg`, `prob-sol-gh.svg`).
2. **Runtime Resolution Pattern**:
   - Read the active energy from `useUserUIPreferencesStore(state => state.energy)`.
   - Look up the active energy's primary 2-letter color code from `ENERGY_THEMES`:
     ```tsx
     const energy = useUserUIPreferencesStore(state => state.energy);
     const colorCode =
         ENERGY_THEMES.find(t => t.id === energy)?.colors?.primary?.code ?? 'ev';
     // Single-state folder: `/illus/empty-state/${colorCode}.svg`
     // Feature folder: `/illus/ia/context-ful-design-${colorCode}.svg`
     ```

#### 3.5.9 Cards
- Primary cards use `bg-bg-flat-primary` with `shadow-md`.
- Nested surfaces inside cards use `bg-bg-raised-secondary` with `shadow-md` (and alternate back to `bg-bg-flat-primary` if nesting a third level).
- Never use card backgrounds around tabular matrices when a clean `<Table>` on the section canvas is more legible.

#### 3.5.10 Lists and Maps
- Always use `.map()` for enumerating repeated datasets and UI collections.

#### 3.5.11 User Feedback
- Toast notifications via `sonner` (`toast.success(...)`, `toast.error(...)`).
- Empty states via `EmptyState` component (`/illus/empty-state/${code}.svg`).
- Error states via `ErrorState` component (`/illus/error-state/${code}.svg`).
- Loading states via `LoadingState` or `Skeleton` component (`/illus/loading-state/${code}.svg`).
- Micro-animations via `motion/react` using spring physics (subtle stagger, opacity, and translateY transitions).

#### 3.5.12 Blocks & Charts
- **Blocks**: Before building a composite block from primitives, check `get-elementa-ui` first. If creating a new reusable block, follow `get-elementa-ui` composition conventions.
- **Charts**: Use `echarts-for-react` exclusively, wired to Elementa's dynamic chart tokens (`--chart-primary-1..5`, `--chart-secondary-1..5`, `--chart-3`, `--chart-4`).

#### 3.5.13 Other UI Principles
- Do not put sequential numbers (`01`, `02`, `03`) on cards or section headers; numbering makes the UI look AI-generic.
- Do not overuse borders; rely on surface elevation contrast first and use boundary strokes (`border-stroke-*`) judiciously (e.g., `border-y border-stroke-base-primary` to separate major page sections).
- Never use Tailwind opacity modifiers (`/50`, `/60`) on colors; use `get-elementa-ui` semantic tokens directly.
- Do not litter the UI with unnecessary `Badge` components that add no functional value.

#### 3.5.14 Design with AI
- Consult `../design-with-elementa/SKILL.md`, `../design-with-elementa/learnings-from-past.md`, and `/DESIGN_SYSTEM.md` for all UI/UX design decisions. Never ship generic AI layouts.

---

## 4. Testing & Verification Standards
### 4.1 Unit Testing (Jest + React Testing Library)
- File naming: `<Component>.test.tsx` colocated with component or in corresponding service folder.
- Structure:

```typescript
// Import global from third party libraries.
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

// Import custom utilities.

// Import custom types.

// Import custom components.
import { MyComponent } from './MyComponent';

// Import styles.

/**
 * This function tests the {@link MyComponent} component.
 */
describe('MyComponent should', () => {
    it('should render successfully with default props', () => {
        render(<MyComponent label="Test" />);
        expect(screen.getByText('Test')).toBeInTheDocument();
    });
});
```

### 4.2 End-to-End Testing (Playwright)
- Test files located under `e2e/*.spec.ts`.
- Page-object or flow-based tests validating critical user paths.

---

## 5. Checklist for Scaffolding a New Service or Repository
When applying this skill to write a new service or an entire repository:
1. **Tooling & Setup**:
    - [ ] Ensure `prettier.config.js` has `tabWidth: 4`, `singleQuote: true`, `semi: true`, `printWidth: 80`, `arrowParens: 'avoid'`.
    - [ ] Ensure `tsconfig.json` has `strict: true` and `noUncheckedIndexedAccess: true`.
    - [ ] Ensure `eslint.config.mjs` enforces alphabetical import order and unused variable ignores.
2. **Directory Structure**:
    - [ ] Create domain folder under `services/<service-name>/`.
    - [ ] Implement `types.ts` with Zod schemas and inferred types wrapped in section delimiters.
    - [ ] Implement `network.ts` with typed client API service calls.
    - [ ] Implement `stores/use-<service>-store.ts` with separate State and Actions interfaces.
    - [ ] Implement UI components with section comments (`Constants and Variables`, `States`, `Event Handlers`, `Side Effects`, `UI`).
3. **API & Error Handling**:
    - [ ] Create Next.js route handlers under `app/api/<service>/route.ts`.
    - [ ] Use `handleErrorOnServerSideAPICalls` and `handleErrorOnClientSideAPICalls`.
    - [ ] Log server actions via `logger.info` and errors via `logger.error`.
4. **Design & Code Standards**:
    - [ ] Build components using `cn(...)`, CVA variants, and theme tokens.
    - [ ] Provide JSDoc header and function documentation for all declarations.
    - [ ] Colocate unit tests and stories.
