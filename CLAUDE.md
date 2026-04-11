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
- The `clothes` table uses **snake_case** columns (`name`, `color`, `type`, `image`, `image_id`, `material`, `style`, `user_id`, `starred`). The `OutfitDoc` interface in the provider uses **PascalCase** (`OuterWear`, `Top`, `Bottom`, `Date`) mapped from the snake_case Supabase columns (`outer_wear`, `top`, `bottom`, `date`).

### Clothing class

`classes/clothes.tsx` is a plain TS class. Firebase snapshots are hydrated into `Clothing` instances inside `ClosetProvider`. Always use getters (`getName()`, `getType()`, `getImageUrl()`, `getColor()`, `getStyle()`, `getMaterial()`) — fields are private.

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

### AI features

- `api/gemeniapi.ts` — server action calling Gemini 1.5 Flash. Reads `GEMENI_PUBLIC_API_KEY` from env. Only used in `test/page.tsx`.
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
