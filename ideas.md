# Hopamine — Status Panel: Future Ideas

This file tracks future expansions for the builder status/presence system.
Current implementation: heartbeat presence + availability schedule + manual "now playing" text field.

---

## Music / Now Playing Sources

Beyond the manual text field — ways to auto-detect what someone is listening to:

- **Spotify** — Web API + OAuth. Shows current track in real-time. Requires user to connect their Spotify account. Richest data (track, artist, album art, progress bar).
- **Apple Music** — MusicKit JS. Browser-based, no server needed. Requires Apple Music subscription.
- **Last.fm** — Scrobble-based. Works across any music player. Lower friction than Spotify OAuth (API key + username lookup). Good for users who already use Last.fm.
- **YouTube Music** — No public "now playing" API. Would need a browser extension or manual.
- **SoundCloud** — Has a public API. Niche but fits the builder/creator demo.

**Recommendation when ready:** Start with Last.fm (lowest friction, no OAuth popup) then add Spotify as the premium option.

---

## Other Status Signal Sources

- **GitHub activity** — Show "pushed 2 hours ago" or a contribution heatmap. GitHub API, no auth needed for public profiles. Makes builders with active repos feel especially alive.
- **Vercel / deployment status** — "Just shipped" indicator when a deploy completes. Webhook → Convex.
- **"Currently building"** — A dropdown/search of their Hopamine projects. "🔨 Building: Hopamine auth flow." Ties presence to project activity.
- **Pomodoro / focus timer** — "In a 25-min focus block" with a countdown. Signals "active but DND." Could integrate with Forest, Focusmate, or be native.
- **Custom status** — Emoji + short text, Discord-style. "🚀 Shipping today", "☕ Coffee break", "🎯 Deep work."

---

## Profile "Alive" Visual Expansions

- **Particle system** — Subtle floating particles in the mosaic banner when alive. Fade out when sleeping.
- **Audio visualizer** — Animated bars tied to "now playing" state. Pure CSS, no audio processing.
- **Typing indicator** — If user is actively editing their profile, show a typing pulse on their BuilderCard in the directory.
- **Heat signature** — Color temperature of the whole profile shifts warmer when active (slightly more orange/red), cooler when sleeping (blue/gray). Subtle.

---

## Calendar Enhancements

- **Specific time slots** — Replace AM/PM/EVE with hour-by-hour (or 2-hour blocks). More precise but more setup friction.
- **Recurring events** — "Every Tuesday 9am-12pm" with Google Calendar sync.
- **"Available now" override** — One-tap "I'm free right now" that overrides the schedule for 30 min.
- **Timezone-aware display** — When viewing someone else's schedule, show it converted to YOUR timezone.
- **Booking link** — "Schedule a call" → Calendly / Cal.com integration.

---

## Builder Directory Enhancements

- **"Live now" section** — Pin active builders to the top of `/builders`. Changes every 30s via Convex real-time.
- **Presence filter** — Filter by "online now", "active today", "available this week."
- **Notification** — "Alex just came online" push notification for builders you've connected with.

---

## Passport Stamps (future)

- Stamps earned from completed projects (already in design)
- Special stamp for "100 hours logged on Hopamine" (based on heartbeat data)
- Verified skill stamps from collaborators

---

## Notes

- Keep music as a text field until there's real demand for auto-detection (see Last.fm as the first step)
- The heartbeat data (`lastSeenAt`) unlocks a lot of the above — protect that timestamp, it's the foundation
- Don't add Spotify OAuth until you have users who are upset it doesn't exist
