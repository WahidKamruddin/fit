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

**Backend is Supabase** (auth + database + storage). `ClosetProvider` still uses Firebase Firestore for real-time reads — this is a migration in progress. Do not add new Firebase dependencies; new writes should use Supabase.

### Route structure

```
src/app/
  (routes)/
    layout.tsx               # Root HTML shell (Nunito body font, globals.css)
    page.tsx                 # Public landing page (Navbar, Hero, Wardrobe, AiOutfitFeature, Shop, Timeline, Contact, Footer)
    login/page.tsx           # Split-panel editorial login (Google sign-in only)
    (main)/
      layout.tsx             # Authenticated shell: ClosetProvider + SidebarProvider + AppSidebar
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

All pages under `(main)` are protected — they render `<NotLoggedIn />` if `useUser()` returns `null`.

### Auth

- **`useUser()`** (`auth/auth.tsx`) — wraps `supabase.auth.onAuthStateChange`. Returns Supabase `User | null`.
- User fields: `user.id` (not `uid`), `user.user_metadata.full_name` (not `displayName`).
- Sign-in: Google OAuth via `googleSignIn()`. Sign-out: `logOut()`.

### Data flow

- **`ClosetProvider`** (`providers/closetContext.tsx`) — wraps all `(main)` routes. Currently subscribes to Firebase Firestore (`users/{uid}/clothes` and `users/{uid}/outfits`) via `onSnapshot`. Exposes `{ cards, outfits, hasClothes }` through `useCloset()`.
- **Writes** go directly to Supabase: `supabase.from('clothes')`, `supabase.from('outfits')`, `supabase.storage.from('clothing-images')`.
- The Supabase `clothes` table uses **snake_case** columns (`name`, `color`, `type`, `image`, `image_id`, `material`, `style`, `user_id`, `starred`). The Firebase documents use **PascalCase** (`Name`, `Color`, `Type`, etc.). This mismatch exists during migration.

### Clothing class

`classes/clothes.tsx` is a plain TS class. Firebase snapshots are hydrated into `Clothing` instances inside `ClosetProvider`. Always use getters (`getName()`, `getType()`, `getImageUrl()`, `getColor()`, `getStyle()`, `getMaterial()`) — fields are private.

### UI / Design system

- **Fonts**: `font-cormorant` (Cormorant Garamond — display/editorial headlines), Nunito (body, set as CSS default). Both loaded via Google Fonts `@import` in `globals.css`.
- **Tailwind brand palette**: `mocha-{100–500}`, `off-white-100`, `olive-{100,200}`. Prefer these over generic grays for all UI chrome.
- **shadcn/ui** components live in `components/ui/` — do not edit these directly.
- Custom components are in `components/` (flat, kebab-case filenames).
- **Sidebar CSS variables** (`--sidebar-*` in `globals.css`) are mapped to the mocha palette — do not reset them to generic grays.
- **Animations** (defined in `globals.css`):
  - `animate-fade-in-up` — staggered entrance (use `style={{ animationDelay: '...' }}`)
  - `animate-fade-in`, `animate-scale-in`
  - `reveal` / `reveal-left` / `reveal-right` — scroll-triggered via `.is-visible` class, used with `useInView()` hook
- **`useInView()`** (`hooks/use-in-view.ts`) — `IntersectionObserver` hook, fires once at 35% visibility. Returns `{ ref, inView }`. Cast ref as `React.RefObject<HTMLElement>` on `<section>` elements.
- **Landing page sections** all have `snap-start` class; `<html>` has `snap-y snap-mandatory` for scroll snap.
- **Modal pattern**: `fixed inset-0 bg-black/40 backdrop-blur-sm z-50` overlay, `bg-off-white-100 rounded-3xl p-8 sm:p-10 shadow-2xl` panel, close button as circular bordered `✕`, inputs as underline-only (`border-b border-mocha-200 bg-transparent`), submit as full-width pill (`rounded-full bg-mocha-500`).

### AI features

- `api/gemeniapi.ts` — server action calling Gemini 1.5 Flash. Reads `GEMENI_PUBLIC_API_KEY` from env. Only used in `test/page.tsx`.
- Background removal — external API service called during clothing upload in `closet/page.tsx`. Sends a `POST` with `X-Api-Key` header.

### Environment variables (`.env.local`)

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key |
| `NEXT_PUBLIC_FIREBASE_*` | Firebase config (read-only context, migration) |
| `NEXT_PUBLIC_API_URL` | Background removal service base URL |
| `NEXT_PUBLIC_BG_REMOVER_API_KEY` | API key sent as `X-Api-Key` header to background removal service |
| `GEMENI_PUBLIC_API_KEY` | Gemini key (server-only, no `NEXT_PUBLIC_` prefix) |

### Next.js config note

`next.config.js` modularizes `react-icons` imports for bundle size. Always import react-icons using the standard path (e.g. `react-icons/hi`) — the transform is automatic.
