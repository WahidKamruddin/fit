# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start dev server (Next.js on localhost:3000)
npm run build     # Production build
npm run lint      # ESLint
```

There are no tests configured.

## Architecture

**Fit.Ai** is a Next.js 14 fashion/wardrobe management app using the App Router.

**Backend is fully Supabase** (auth + database + storage + real-time). Firebase has been removed — do not add any Firebase dependencies.

### Route structure

```
src/app/
  not-found.tsx              # App-level 404 page
  (routes)/
    layout.tsx               # Root HTML shell (Nunito body font, globals.css)
    page.tsx                 # Public landing page (Navbar, Hero, Wardrobe, AiOutfitFeature, Shop, Timeline, Faq, Contact, Footer)
    login/page.tsx           # Split-panel editorial login (Google sign-in only)
    pricing/page.tsx         # Public pricing page (Free vs Premium tiers + comparison table)
    (main)/
      layout.tsx             # Authenticated shell: ClosetProvider + AppNavbar
      dashboard/page.tsx
      (fashion)/             # Route group — no extra layout
        closet/page.tsx
        outfits/page.tsx
        calendar/page.tsx
      (library)/
        blog/page.tsx
        fashion/page.tsx
      settings/general | account | privacy
      shop/page.tsx
      test/page.tsx          # Gemini AI dev sandbox (not production)
```

All pages under `(main)` are protected by middleware. During the brief session-hydration window where `useUser()` returns `null`, pages render `<PageSkeleton />` instead of crashing.

### Auth

- **`useUser()`** (`auth/auth.tsx`) — wraps `supabase.auth.onAuthStateChange`. Returns Supabase `User | null`.
- User fields: `user.id` (not `uid`), `user.user_metadata.full_name` (not `displayName`).
- Sign-in: Google OAuth via `googleSignIn()`. Sign-out: `logOut()`.
- Middleware handles unauthenticated redirects at the routing level — no in-component auth guards needed. Use `<PageSkeleton />` only for the transient null window on first render.

### Data flow

- **`ClosetProvider`** (`providers/closetContext.tsx`) — wraps all `(main)` routes. Fetches clothes and outfits from Supabase on mount, then subscribes to real-time updates via `supabase.channel()` + `postgres_changes`. Exposes `{ cards, outfits, hasClothes, addCard, removeCard, addOutfit, removeOutfit, updateOutfitDate }` through `useCloset()`.
- All reads and writes use Supabase: `supabase.from('clothes')`, `supabase.from('outfits')`, `supabase.storage.from('clothing-images')`.
- The `clothes` table uses **snake_case** columns: `name`, `color` (jsonb), `type`, `image`, `image_id`, `material`, `style`, `comfort`, `warmth`, `weather`, `vibe`, `size`, `user_id`, `starred`.
- The `outfits` table columns: `outer_wear`, `top`, `bottom`, `shoes`, `accessories` (text[]), `date`. All store clothing row UUIDs. The `OutfitDoc` interface in the context uses **PascalCase** (`OuterWear`, `Top`, `Bottom`, `Shoes`, `Accessories`, `Date`) mapped from snake_case. `OuterWear` is `string | null` (optional).

### Clothing class

`classes/clothes.tsx` is a plain TS class. Rows from Supabase are hydrated into `Clothing` instances inside `ClosetProvider`. Fields are private — always use getters: `getName()`, `getType()`, `getImageUrl()`, `getColor()`, `getColorName()`, `getColorHex()`, `getMaterial()`, `getStyle()`, `getVibe()`, `getWeather()`, `getWarmth()`, `getComfort()`, `getSize()`, `getStarred()`.

**Note**: The `Clothing` class is planned for deprecation in favour of plain TypeScript interfaces. Design new features against `ClothingItem` / `ClothingRow` from `types/clothing.ts`, not the class.

### UI / Design system

- **Fonts**: `font-cormorant` (Cormorant Garamond — display/editorial headlines), Nunito (body, set as CSS default). Both loaded via Google Fonts `@import` in `globals.css`.
- **Tailwind brand palette**: `mocha-{100–500}`, `off-white-100`, `olive-{100,200}`. Prefer these over generic grays for all UI chrome.
- **shadcn/ui** components live in `components/ui/` — do not edit these directly.
- Custom components are in `components/` (flat, kebab-case filenames).
- **Animations** (defined in `globals.css`):
  - `animate-fade-in-up` — staggered entrance (use `style={{ animationDelay: '...' }}`)
  - `animate-fade-in`, `animate-scale-in`
  - `animate-wiggle` — iOS-style pendulum wiggle for edit mode on cards (2-keyframe `rotate(-1.5deg)` ↔ `rotate(1.5deg)`, `ease-in-out infinite`)
  - `reveal` / `reveal-left` / `reveal-right` — scroll-triggered via `.is-visible` class, used with `useInView()` hook
- **`useInView()`** (`hooks/use-in-view.ts`) — `IntersectionObserver` hook, fires once at 35% visibility. Returns `{ ref, inView }`. Cast ref as `React.RefObject<HTMLElement>` on `<section>` elements.
- **Landing page sections** all have `snap-start` class; `<html>` has `snap-y snap-mandatory` for scroll snap.
- **Modal pattern**: `fixed inset-0 bg-black/40 backdrop-blur-sm z-50` overlay, `bg-off-white-100 rounded-3xl p-8 sm:p-10 shadow-2xl` panel, close button as circular bordered `✕`, inputs as underline-only (`border-b border-mocha-200 bg-transparent`), submit as full-width pill (`rounded-full bg-mocha-500`).
- **Page header pattern** (app pages): overline `text-[10px] tracking-[0.5em] uppercase text-mocha-400` with flanking rule, Cormorant headline using `clamp(2.8rem, 5vw, 4.5rem)`, divider `h-px bg-mocha-200`, staggered `animate-fade-in-up` / `animate-fade-in` with `animationDelay`.

### Navigation

- **Landing page** (`components/navbar.tsx`) — public nav with scroll-aware background. Links: Home, Pricing (`/pricing`), Login/Dashboard CTA.
- **App navbar** (`components/app-navbar.tsx`) — fixed authenticated nav replacing the old sidebar. Logo left, hover-dropdown groups (Fashion, Library, Shop, Settings) center, user pill with dropdown right. Mobile: hamburger → full-width drawer. Used in `(main)/layout.tsx`.
- The old sidebar files (`app-sidebar.tsx`, `nav-main.tsx`, `nav-user.tsx`, `nav-dashboard.tsx`, `components/ui/sidebar.tsx`) still exist but are **no longer wired into the layout** — do not reintroduce them.

### Card interactions

- **`card.tsx`** — clothing cards support long-press (500ms timer via `useRef`) to enter edit mode, `animate-wiggle` in edit mode, ✕ delete button (top-right), star toggle (top-left), hover overlay showing name/type.
- **`outfit-card.tsx`** — outfit cards have the same long-press, wiggle, and ✕ pattern. `deleteDate` prop shows a ✕ to unassign from calendar. `canEdit` prop controls wiggle/delete visibility.
- **`card-list.tsx`** — forwards `onLongPress` down to `Card`.

### Key components

- **`components/page-skeleton.tsx`** — pulse skeleton shown during session hydration (`if (!user) return <PageSkeleton />`). Matches the app page header layout with gray placeholder bars and cards.
- **`components/coming-soon.tsx`** — used by settings and shop pages that aren't built yet.
- **`components/faq.tsx`** — accordion FAQ section on the landing page (between Timeline and Contact). Uses `useInView()` for scroll reveal.
- **`app/not-found.tsx`** — Next.js App Router 404 page, on-theme with mocha palette.

### Clothing metadata

Every clothing item stored in the `clothes` table carries rich metadata inferred by Gemini at upload time:

| Column | Type | Description |
|---|---|---|
| `color` | `jsonb` | `[colorName, hexCode]` tuple, e.g. `["Charcoal", "#36454F"]` |
| `material` | `text` | Primary material (cotton, wool, denim…) |
| `comfort` | `int` | 1–10 scale (1 = corset, 10 = sweatpants) |
| `warmth` | `int` | 1–10 scale (1 = breathable, 10 = insulating) |
| `weather` | `text[]` | Subset of `WEATHER_OPTIONS`: hot, warm, mild, cool, cold, rainy, windy, snowy |
| `style` | `text[]` | Subset of `STYLE_OPTIONS`: layering-piece, statement, basic, accent, versatile, seasonal |
| `vibe` | `text[]` | Subset of `VIBE_OPTIONS`: streetwear, minimalist, sporty, casual, formal, preppy, bohemian, vintage, techwear, athleisure, smart-casual, loungewear |

All option sets are defined as `as const` arrays in `types/clothing.ts` and used for both AI prompt constraints and TypeScript types. The `Clothing` class exposes getters for all fields (`getWarmth()`, `getComfort()`, `getVibe()`, `getStyle()`, `getWeather()`).

**Upload flow**: photo → background removal API → base64 FileReader → Gemini `analyzeClothing()` server action (parallel with Supabase storage upload) → insert full row including metadata. Falls back to defaults if `GEMENI_PUBLIC_API_KEY` is missing or AI call fails.

### Outfit generation

`api/generate-outfit.ts` — pure client-side utility (no server action, no network call). Takes `ClothingCard[]` from `ClosetContext` and `OutfitPreferences`, returns `GeneratedOutfit | { error: string }`.

**Do not make this a server action** — the shared `supabase` client is a `createBrowserClient` which carries no session in server context, so RLS would block the query. The data is already available in `ClosetContext`.

#### Scoring

Each clothing item receives a `matchScore ∈ [0, 1]` against the user's preferences:

```
matchScore = 0.4 × vibeScore + 0.3 × styleScore + 0.3 × weatherScore

vibeScore    = prefs.vibes.length > 0
                 ? |item.vibe ∩ prefs.vibes| / prefs.vibes.length
                 : 0.5   ← neutral when user expresses no vibe preference

styleScore   = prefs.styles.length > 0
                 ? |item.style ∩ prefs.styles| / prefs.styles.length
                 : 0.5

weatherScore = prefs.weather.length > 0
                 ? |item.weather ∩ prefs.weather| / prefs.weather.length
                 : 0.5
```

#### Construction

1. Score all items, group by `type`.
2. **Required**: Top + Bottom. If either category is empty → `{ error: "Not enough clothes found…" }`.
3. **Outerwear**: only included if `prefs.weather` contains any of `cool | cold | windy | snowy`. Skipped otherwise even if items exist.
4. **Shoes** and **Accessories** (up to 1): always included if items exist.
5. From each category, the item with the highest `matchScore` is selected.

#### Warmth / comfort scores (weighted aggregation)

Role weights before normalization:

| Role | Weight |
|---|---|
| Outerwear | 0.35 |
| Top | 0.20 |
| Bottom | 0.20 |
| Shoes | 0.15 |
| Accessory | 0.10 |

Weights for roles **not present** in the outfit are dropped and the remaining weights are normalized to sum to 1. This means if there's no outerwear, its 0.35 is redistributed proportionally across the other roles.

```
itemWarmth_100  = (item.warmth  − 1) / 9 × 100   // maps 1–10 → 0–100
itemComfort_100 = (item.comfort − 1) / 9 × 100

outfitWarmth  = Σ (itemWarmth_100  × normalizedWeight)
outfitComfort = Σ (itemComfort_100 × normalizedWeight)
```

#### Derived outfit metadata

- `dominantVibes` / `dominantStyles` — vibes/styles present in **≥ 2** selected items.
- `weatherSuitability` — union of all `weather[]` arrays across selected items.
- `confidenceScore` — average `matchScore` of all selected items × 100.

#### Saving

`components/outfit-generator-modal.tsx` handles the DB insert after the user clicks "Save Look". The `generateOutfit()` call is synchronous; only the Supabase insert is async.

### AI features

- `api/analyze-clothing.ts` — server action calling Gemini 2.5 Flash. Receives base64 image, returns `ClothingAnalysis` (name, color tuple, type, full metadata). Falls back to `DEFAULT_ANALYSIS` if key missing or call fails.
- `api/gemeniapi.ts` — legacy server action, only used in `test/page.tsx` sandbox.
- Background removal — external API service called during clothing upload in `closet/page.tsx`. Sends a `POST` with `X-Api-Key` header.

### Environment variables (`.env.local`)

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key |
| `NEXT_PUBLIC_API_URL` | Background removal service base URL |
| `NEXT_PUBLIC_BG_REMOVER_API_KEY` | API key sent as `X-Api-Key` header to background removal service |
| `GEMENI_PUBLIC_API_KEY` | Gemini key (server-only, no `NEXT_PUBLIC_` prefix) |

### Next.js config note

`next.config.js` modularizes `react-icons` imports for bundle size. Always import react-icons using the standard path (e.g. `react-icons/hi`) — the transform is automatic.
