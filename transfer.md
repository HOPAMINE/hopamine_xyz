# Hopamine — Context Transfer

## App overview

**Hopamine** — a platform connecting ambitious builders. Think a combination of a builder directory, project board, and collaboration network.

**Stack:** Next.js 16, Tailwind CSS v4, Framer Motion v12, Clerk (auth), Convex (backend/DB)

**Design tokens:**
- Primary: `#00a6f3` (electric blue) — used as `text-accent-navbar` / `border-accent-navbar` / `bg-accent-navbar`
- Fonts: Instrument Serif (`font-serif`) for display/headings, Roboto Mono (`font-mono`) for labels/UI
- Background gradient (dashboard, bento): `bg-[linear-gradient(to_bottom_right,#00a6f3_0%,#00a6f3_35%,#cdeefc_62%,#f5fafc_82%,#fefefe_100%)]`
- Nav padding constant: `NAV_ALIGN_PAD` from `@/lib/layoutConstants`

**Auth:** Clerk. Middleware at `src/middleware.ts`. Onboarding gate in `src/app/client-layout.tsx` — redirects to `/onboard` if `onboardingCompletedAt` is null.

---

## What's been built

| Route | State |
|---|---|
| `/` | Landing page |
| `/onboard` | Multi-step onboarding flow (complete, wired to Convex) |
| `/builders` | Builder directory with hex-mosaic `BuilderCard` component |
| `/dashboard` | Tab shell (Projects / Profile / Settings). Projects = empty. Settings = complete. Profile = `<div />` — **needs building** |
| `/sign-in`, `/sign-up` | Clerk auth |
| `/profile-compare` | Dev-only comparison page (4 layout explorations, no auth required) |

---

## Convex schema — `users` table

```ts
users: {
  clerkId: string           // primary key (indexed)
  email: string
  name: string
  username?: string         // indexed
  avatarUrl: string         // Clerk image or Convex storage URL
  avatarStorageId?: Id<"_storage"> | null
  bio?: string
  website?: string
  buttonColor?: string      // hex string e.g. "#FF1A00"
  location?: string
  archetypes?: string[]     // set during onboarding
  skills?: string           // free text, set during onboarding
  vision?: string           // set during onboarding
  why?: string              // set during onboarding
  onboardingCompletedAt?: number
  socialLinks?: Record<string, string>
  stripeCustomerId?: string
  createdAt: number
  updatedAt: number
}
```

## Convex mutations/queries in `convex/users.ts`

- `getCurrentUser` — query, no args, returns current user row
- `updateProfile` — mutation, updates: `name`, `bio`, `username`, `website`, `buttonColor`, `storageId` (avatar upload)
- `generateUploadUrl` — mutation, returns a Convex storage upload URL for avatar
- `updateProfilePicture` — mutation, takes `storageId`, updates `avatarUrl` + `avatarStorageId`
- `completeOnboarding` — mutation, sets `location`, `archetypes`, `skills`, `vision`, `why`, `onboardingCompletedAt`
- `deleteAccount` — mutation

**Gap:** `location`, `archetypes`, `skills`, `vision`, `why` are NOT editable via `updateProfile` — you'll need to either extend that mutation or add a new one when wiring up the profile edit form.

---

## Profile page — decision made

**Chosen layout: Bento Grid** (same as V1 in `/profile-compare`)

The comparison page at `/profile-compare` has 4 variants to reference. V1 is the chosen one.

### Bento Grid structure

```
Background: blue → white gradient (same as /dashboard)

grid-cols-[260px  minmax(0,1fr)  240px]
grid-rows: [auto  1fr]

┌─────────────────┬──────────────────────────────┬──────────────────┐
│  Profile Card   │                              │   Availability   │
│  (col 1, row 1) │      Core Profile            │   Calendar       │
│                 │      (col 2, rows 1–2)       │   (col 3, row 1) │
├─────────────────│                              ├──────────────────┤
│  Passport       │                              │   Projects List  │
│  Stamps         │                              │   (col 3, row 2) │
│  (col 1, row 2) │                              │                  │
└─────────────────┴──────────────────────────────┴──────────────────┘
```

### Panel contents

**Profile Card** (top-left)
- Reuses the mosaic triangle banner + initials avatar from `BuilderCard`
- Shows: name, @username, location, archetypes as tags, Connect button, website
- Edit pencil button in top-right corner of card
- Editable fields: name, username, location, avatar (upload)

**Passport Stamps** (bottom-left)
- Empty for now — shows a "no stamps yet" empty state
- Future: list of vouches earned from completed projects

**Core Profile** (center, full height)
- Header with "Edit" button
- Sections: Bio (free text), Archetypes (tags), Skills, Vision (quoted), Why I Build
- All fields editable

**Availability Calendar** (top-right)
- 7-day × 3-period (AM/PM/EVE) grid
- Filled = available (blue), empty = not available (gray)
- Editable — user clicks to toggle slots
- Shows "Pacific Time (PT)" label

**Projects List** (bottom-right)
- List of projects the user has joined, with their role
- Empty for now (no projects table yet)

### Edit UX
- Each panel has an edit pencil icon in its header
- Clicking opens that panel in edit mode (inline — no separate edit page)
- Save/Cancel per panel

---

## Key files to touch

```
src/app/dashboard/page.tsx          ← ProfileTab() is currently <div />, build it here
src/app/builders/BuilderCard.tsx    ← reference for the profile card visual
src/app/builders/hexMosaic.ts       ← mosaic triangle generator (reuse)
src/app/profile-compare/page.tsx    ← V1Section has the full reference implementation with fake data
convex/users.ts                     ← extend updateProfile to include location, archetypes, skills, vision, why
convex/schema.ts                    ← reference for field names/types
src/lib/layoutConstants.ts          ← NAV_ALIGN_PAD
```

---

## Things still open / not decided

1. **Video intro** — user is considering a video field on the profile. Recommendation: start with a URL field (YouTube/Loom link), not native upload. No schema field exists yet.
2. **Interests vs Archetypes** — the onboarding uses `archetypes` (predefined: Builder, Designer, etc.), not a separate "interests" field. Treat them as the same for now.
3. **Avatar photo** — `BuilderCard` currently renders initials only, but the schema has `avatarUrl`. Decide whether the profile card shows real photo or keeps initials/mosaic identity.
4. **Calendar timezone** — currently shows "Pacific Time (PT)" hardcoded. Timezone-awareness is a future concern.
5. **Mobile layout** — the 3-column bento grid needs a stacking strategy for small screens.
6. **Passport stamps data model** — no schema table yet. Leave as empty state until the projects/vouching system is built.
