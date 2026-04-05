# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start dev server (Next.js on localhost:3000)
npm run build     # Production build
npm run lint      # ESLint
```

There are no tests configured. The background-removal Python server (Flask on port 5000) must be running separately for clothing upload to work.

## Architecture

**Fit.Ai** is a Next.js 14 fashion/wardrobe management app using the App Router with Firebase (Auth, Firestore, Storage) as the backend.

### Route structure

```
src/app/
  (routes)/
    layout.tsx               # Root HTML shell (Inter font, globals.css)
    page.tsx                 # Public landing page (Navbar, Hero, Wardrobe, Outfits, Shop, Timeline, Contact, Footer)
    login/page.tsx
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

### Data flow

- **`useUser()`** (`auth/auth.tsx`) — thin hook wrapping `onAuthStateChanged`. Returns `User | null`. Called once per component that needs it; does not use context.
- **`ClosetProvider`** (`providers/closetContext.tsx`) — wraps all `(main)` routes. Subscribes to `users/{uid}/clothes` and `users/{uid}/outfits` via `onSnapshot`. Exposes `{ cards, outfits, hasClothes }` through `useCloset()`. Cleans up both listeners on unmount.
- Pages consume `useCloset()` for reads and call Firestore directly (`addDoc`, `deleteDoc`, `updateDoc`) for writes.

### Firestore data model

```
users/{uid}/clothes/{id}  → { Name, Color, Type, Image (URL), ImageID, Material, Style, Starred }
users/{uid}/outfits/{id}  → { OuterWear (clothesId), Top (clothesId), Bottom (clothesId), Date (MMddyy | null) }
```

Outfit documents store **references** (clothing document IDs), not embedded data. `OutfitCard` resolves images by scanning the `cards` array from context.

### Clothing class

`classes/clothes.tsx` is a plain TS class (not a plain object). Firestore snapshots are hydrated into `Clothing` instances inside `ClosetProvider`. Always use getters (`getName()`, `getType()`, `getImageUrl()`, etc.) — fields are private.

### UI layer

- **shadcn/ui** components live in `components/ui/` — do not edit these directly.
- Custom components are in `components/` (flat, kebab-case filenames).
- Tailwind custom colors: `mocha-{100–500}`, `off-white-100`, `olive-{100,200}`. These are the brand palette — prefer them over generic grays for UI chrome.
- The sidebar (`AppSidebar`) renders on every `(main)` page. Nav data is a static array defined at module level in `app-sidebar.tsx`.

### AI features

- `api/gemeniapi.ts` — server action calling Gemini 1.5 Flash to analyze a clothing image. Reads `GEMENI_PUBLIC_API_KEY` from env. Currently only used in `test/page.tsx`.
- Background removal (`NEXT_PUBLIC_API_URL/remove-background`) — external Python/Flask service called during clothing upload in `closet/page.tsx`.

### Environment variables (`.env.local`)

All Firebase config values are in `.env.local` as `NEXT_PUBLIC_FIREBASE_*`. The background-removal service base URL is `NEXT_PUBLIC_API_URL`. The Gemini key is `GEMENI_PUBLIC_API_KEY` (server-only, no `NEXT_PUBLIC_` prefix).

### Next.js config note

`next.config.js` modularizes `react-icons` imports via `@react-icons/all-files` for bundle size. Always import react-icons using the standard path (e.g. `react-icons/hi`) — the transform is automatic.
