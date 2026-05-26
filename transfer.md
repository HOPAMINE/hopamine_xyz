# Onboarding Flow — Context Transfer

## What we're building

The post-signup onboarding flow for **Hopamine** — a solarpunk / eco-tech community platform connecting builders and organizers around hopeful futures.

**Route:** `/onboard`

**Stack:** Next.js 16, Tailwind CSS v4, Framer Motion v12, Clerk (auth), Convex (backend)

**Design tokens:**
- Primary: `#00a6f3` (electric blue), referenced as `text-accent-navbar` / `border-accent-navbar` / `bg-accent-navbar`
- Fonts: Instrument Serif (`font-serif`) for display, Roboto Mono (`font-mono`) for labels/UI

---

## The flow

A fullscreen scroll-based white card on a blue gradient background. Questions appear one at a time as the user scrolls down — each answer locks into flowing prose before the next question reveals.

### Interaction model

**Chip / select questions (Q1, Q2, Q3) — Inline Reveal:**
- Locked answer displays as a prose sentence, no underline
- Hover fades in a small black "edit" label inline
- Clicking the sentence reveals the original options below it (the prose stays visible)
- Single-select (Q1, Q3): tapping a chip auto-saves and closes
- Multi-select (Q2): chips toggle, Save/Cancel buttons confirm

**Long-form text question (Q4) — Expand In Place:**
- Locked answer shows the question text + quoted response
- Hover fades in "edit" label
- Clicking replaces the locked block entirely with the textarea + Save/Cancel
- Cancel restores the previous text without saving

### Done state
After Q4 is submitted, a "Welcome to the network / Now let's build something." section fades in below.

---

## Question set (implemented)

1. **Name + Location** — name text input + location single-select
   - Name: free-form text
   - Location: San Francisco, New York, Austin, Berlin, Somewhere else
   - Displays: *"[Name], building from [location]."*

2. **Archetype Selection** — multi-select with emojis & quotes
   - 10 archetypes: The Seedcaster, The Fabricant, The Mycelian, The Terraformer, The Developer, The Artisan, The Chronicler, The Cultivar, The Loomkeeper, The Verdant
   - Each with emoji, title, and inspirational quote
   - Displays: *"Archetypes: [archetypes joined with &]"*

3. **Core Skills** — long-form textarea (auto-grows, word count)
   - Locks as: question text above + quoted answer below, truncated at 300 chars

4. **Vision for the Future** — long-form textarea (auto-grows, word count)
   - Locks as: question text above + quoted answer below, truncated at 300 chars

5. **Why This Movement Matters** — long-form textarea (auto-grows, word count)
   - Displays the full answer (not truncated) in italic text

---

## Next step

1. **Wire to Convex** — store answers against the user's Clerk identity (`tokenIdentifier`) via a mutation on each question submission; the flow should resume from saved state if the user refreshes mid-flow
