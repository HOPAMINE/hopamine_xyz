"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { useMutation, useConvexAuth } from "convex/react"
import { api } from "../../../convex/_generated/api"
import { PROJECT_TILES } from "@/lib/projectTiles"
import Lottie from "lottie-react"
import globeAnimation from "../../../public/globe.json"

// ─── Constants ────────────────────────────────────────────────────────────────

const BADGES = [
  { id: "seedcaster",  emoji: "🌱", title: "THE SEEDCASTER",  quote: "They plant what others haven't imagined yet." },
  { id: "fabricant",   emoji: "⚙️",  title: "THE FABRICANT",   quote: "If it doesn't exist, they build it." },
  { id: "mycelian",    emoji: "🍄",  title: "THE MYCELIAN",    quote: "They think in networks and grow in the dark." },
  { id: "terraformer", emoji: "🏗️", title: "THE TERRAFORMER", quote: "They redesign the spaces we inhabit." },
  { id: "developer",   emoji: "💻",  title: "THE DEVELOPER",   quote: "They write the tools of sovereignty." },
  { id: "artisan",     emoji: "🎨",  title: "THE ARTISAN",     quote: "They make the future beautiful enough to want." },
  { id: "chronicler",  emoji: "📡",  title: "THE CHRONICLER",  quote: "They make sure the work gets seen." },
  { id: "cultivar",    emoji: "🌿",  title: "THE CULTIVAR",    quote: "They bridge the lab and the land." },
  { id: "loomkeeper",  emoji: "🔗",  title: "THE LOOMKEEPER",  quote: "They hold the network together." },
  { id: "verdant",     emoji: "📜",  title: "THE VERDANT",     quote: "They change the rules of the game." },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

function joinList(items: string[]) {
  if (items.length === 1) return items[0]
  if (items.length === 2) return `${items[0]} & ${items[1]}`
  return `${items.slice(0, -1).join(", ")} & ${items[items.length - 1]}`
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function AutoTextarea({
  value,
  onChange,
  placeholder,
}: {
  value: string
  onChange: (v: string) => void
  placeholder: string
}) {
  const ref = useRef<HTMLTextAreaElement>(null)
  useEffect(() => {
    if (ref.current) {
      ref.current.style.height = "auto"
      ref.current.style.height = ref.current.scrollHeight + "px"
    }
  }, [value])
  return (
    <textarea
      ref={ref}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={3}
      className="w-full resize-none overflow-hidden bg-transparent font-serif text-2xl text-neutral-700 placeholder:text-neutral-300 focus:outline-none leading-relaxed border-b border-neutral-200 focus:border-accent-navbar transition-colors pb-1"
    />
  )
}

async function fetchCitySuggestions(input: string): Promise<{ id: string; label: string }[]> {
  const key = process.env.NEXT_PUBLIC_GOOGLE_PLACES_KEY
  if (!key || !input.trim()) return []
  const res = await fetch("https://places.googleapis.com/v1/places:autocomplete", {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Goog-Api-Key": key },
    body: JSON.stringify({ input, includedPrimaryTypes: ["locality", "administrative_area_level_3"] }),
  })
  if (!res.ok) return []
  const data = await res.json()
  return (data.suggestions ?? []).map((s: { placePrediction: { placeId: string; text: { text: string } } }) => ({
    id: s.placePrediction.placeId,
    label: s.placePrediction.text.text,
  }))
}

function LocationCombobox({
  onSelect,
  onSubmit,
}: {
  onSelect: (v: string) => void
  onSubmit: () => void
}) {
  const [value, setValue] = useState("")
  const [suggestions, setSuggestions] = useState<{ id: string; label: string }[]>([])
  const [open, setOpen] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const containerRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  const fetchSuggestions = useCallback((input: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(async () => {
      const results = await fetchCitySuggestions(input)
      setSuggestions(results)
      setHighlightedIndex(-1)
      setOpen(results.length > 0)
    }, 250)
  }, [])

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setValue(e.target.value)
    fetchSuggestions(e.target.value)
  }

  function handleSelect(label: string) {
    setValue(label)
    setSuggestions([])
    setOpen(false)
    setHighlightedIndex(-1)
    onSelect(label)
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault()
      if (!open || suggestions.length === 0) return
      const next = Math.min(highlightedIndex + 1, suggestions.length - 1)
      setHighlightedIndex(next)
      listRef.current?.children[next]?.scrollIntoView({ block: "nearest" })
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      if (!open || suggestions.length === 0) return
      const next = Math.max(highlightedIndex - 1, 0)
      setHighlightedIndex(next)
      listRef.current?.children[next]?.scrollIntoView({ block: "nearest" })
    } else if (e.key === "Enter") {
      if (open && highlightedIndex >= 0 && suggestions[highlightedIndex]) {
        e.preventDefault()
        handleSelect(suggestions[highlightedIndex].label)
        onSubmit()
      } else if (value.trim()) {
        setOpen(false)
        onSelect(value)
        onSubmit()
      }
    } else if (e.key === "Escape") {
      setOpen(false)
      setHighlightedIndex(-1)
    }
  }

  return (
    <div ref={containerRef} className="relative mb-4">
      <input
        autoFocus
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="Type your city…"
        aria-autocomplete="list"
        aria-expanded={open}
        aria-activedescendant={highlightedIndex >= 0 ? `city-option-${highlightedIndex}` : undefined}
        className="w-full bg-transparent font-serif text-2xl text-neutral-700 placeholder:text-neutral-300 focus:outline-none border-b border-neutral-200 focus:border-accent-navbar transition-colors pb-2"
      />
      <AnimatePresence>
        {open && (
          <motion.ul
            ref={listRef}
            role="listbox"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="absolute z-20 top-full left-0 right-0 bg-white border border-neutral-200 shadow-lg mt-1 max-h-52 overflow-y-auto"
          >
            {suggestions.map(({ id, label }, index) => (
              <li
                key={id}
                id={`city-option-${index}`}
                role="option"
                aria-selected={index === highlightedIndex}
                onMouseDown={(e) => { e.preventDefault(); handleSelect(label) }}
                onMouseEnter={() => setHighlightedIndex(index)}
                className={`px-4 py-2.5 font-mono text-sm cursor-pointer transition-colors ${
                  index === highlightedIndex
                    ? "bg-accent-navbar text-white"
                    : "text-neutral-600 hover:bg-accent-navbar hover:text-white"
                }`}
              >
                {label}
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function OnboardPage() {
  const router = useRouter()
  const completeOnboarding = useMutation(api.users.completeOnboarding)
  const { isAuthenticated, isLoading: isAuthLoading } = useConvexAuth()

  // Submission state
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState("")

  // Question answers
  const [name, setName] = useState("")
  const [nameDone, setNameDone] = useState(false)

  const [location, setLocation] = useState("")
  const [locationDone, setLocationDone] = useState(false)

  const [badges, setBadges] = useState<string[]>([])
  const [badgesDone, setBadgesDone] = useState(false)
  const [openBadges, setOpenBadges] = useState(false)
  const [tempBadges, setTempBadges] = useState<string[]>([])

  const [skillsList, setSkillsList] = useState<string[]>(["", ""])
  const [skillsDone, setSkillsDone] = useState(false)
  const [editingSkills, setEditingSkills] = useState(false)
  const [tempSkillsList, setTempSkillsList] = useState<string[]>(["", ""])

  const [visionDraft, setVisionDraft] = useState("")
  const [vision, setVision] = useState("")
  const [visionDone, setVisionDone] = useState(false)
  const [editingVision, setEditingVision] = useState(false)
  const [tempVision, setTempVision] = useState("")

  const [whyDraft, setWhyDraft] = useState("")
  const [why, setWhy] = useState("")
  const [done, setDone] = useState(false)

  const [discord, setDiscord] = useState("")
  const [discordError, setDiscordError] = useState("")
  const [discordDone, setDiscordDone] = useState(false)

  // Confirmation screen
  const [confirmed, setConfirmed] = useState(false)

  const endRef = useRef<HTMLDivElement>(null)
  const topRef = useRef<HTMLDivElement>(null)

  function scrollDown() {
    setTimeout(() => endRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }), 120)
  }

  // ── Question submit handlers ──────────────────────────────────────────────

  function submitName() {
    if (!name.trim()) return
    setNameDone(true)
    scrollDown()
  }

  function submitLocation() {
    if (!location.trim()) return
    setLocationDone(true)
    scrollDown()
  }

  function submitBadges() {
    if (badges.length === 0) return
    setBadgesDone(true)
    scrollDown()
  }

  function saveBadges() {
    if (tempBadges.length === 0) return
    setBadges(tempBadges)
    setOpenBadges(false)
  }

  function submitSkills() {
    if (!skillsList.some((s) => s.trim())) return
    setSkillsDone(true)
    scrollDown()
  }

  function saveSkills() {
    if (!tempSkillsList.some((s) => s.trim())) return
    setSkillsList([...tempSkillsList])
    setEditingSkills(false)
  }

  function submitVision() {
    if (!visionDraft.trim()) return
    setVision(visionDraft.trim())
    setVisionDone(true)
    scrollDown()
  }

  function saveVision() {
    if (!tempVision.trim()) return
    setVision(tempVision.trim())
    setEditingVision(false)
  }

  // Q6 just locks the answer locally — no mutation yet
  function submitWhy() {
    if (!whyDraft.trim()) return
    setWhy(whyDraft.trim())
    setDone(true)
    scrollDown()
  }

  function submitDiscord() {
    const trimmed = discord.trim().replace(/^@/, "")
    if (trimmed && !/^[a-zA-Z0-9_.]{2,32}(#\d{4})?$/.test(trimmed)) {
      setDiscordError("Just your username — e.g. jonsmith or jonsmith#1234")
      return
    }
    setDiscordError("")
    setDiscord(trimmed)
    setDiscordDone(true)
    scrollDown()
  }

  // The actual Convex commit happens here
  async function finishOnboarding() {
    if (submitting || !isAuthenticated) return
    setSubmitting(true)
    setSubmitError("")
    try {
      await completeOnboarding({
        name: name.trim(),
        location: location.trim(),
        archetypes: badges,
        skills: skillsList.filter((s) => s.trim()),
        vision,
        why,
        discord: discord.trim() || undefined,
      })
      setConfirmed(true)
      setTimeout(() => topRef.current?.scrollTo({ top: 0, behavior: "smooth" }), 80)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Something went wrong — please try again."
      setSubmitError(msg)
    } finally {
      setSubmitting(false)
    }
  }

  // ── Derived display values ────────────────────────────────────────────────

  const displayVision = vision.length > 300 ? vision.slice(0, 300).trimEnd() + "…" : vision
  const badgeLabels = badges
    .map((id) => BADGES.find((b) => b.id === id)?.title)
    .filter((t): t is string => Boolean(t))

  // ── Shared button class helpers ───────────────────────────────────────────

  const outlineBtn = (active: boolean) =>
    `font-mono text-sm uppercase tracking-wide px-6 py-2.5 border-2 transition-colors cursor-pointer ${
      active
        ? "border-accent-navbar text-accent-navbar hover:bg-accent-navbar hover:text-white"
        : "border-neutral-200 text-neutral-300 cursor-default"
    }`

  const smallOutlineBtn =
    "font-mono text-sm uppercase tracking-wide px-5 py-2 border border-neutral-200 text-neutral-400 hover:text-neutral-700 transition-colors cursor-pointer"

  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div
      ref={topRef}
      className="fixed inset-0 z-0 overflow-y-auto bg-[linear-gradient(to_bottom_right,#00a6f3_0%,#00a6f3_35%,#cdeefc_62%,#f5fafc_82%,#fefefe_100%)]"
    >
      {/* Globe background */}
      <div
        className="pointer-events-none fixed"
        style={{
          top: "50%",
          left: "50%",
          width: "min(90vw, 90vh)",
          height: "min(90vw, 90vh)",
          transform: "translate(-5%, -20%) rotate(30deg)",
          opacity: 0.3,
          zIndex: 0,
        }}
      >
        <Lottie animationData={globeAnimation} loop autoplay initialSegment={[0, 151]} />
      </div>

      <div className="relative z-10 flex justify-center px-5 pb-48 pt-28 md:pt-32">
        <AnimatePresence mode="wait">

          {/* ══ Confirmation screen ══════════════════════════════════════════ */}
          {confirmed ? (
            <motion.div
              key="confirmation"
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.55, ease: "easeOut" }}
              className="w-full max-w-2xl bg-white rounded-2xl shadow-[0_24px_80px_rgba(0,0,0,0.14)] px-8 py-10 md:px-12 md:py-12"
            >
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent-navbar mb-3">
                You&apos;re in.
              </p>
              <h1 className="font-serif text-4xl tracking-[-0.05em] text-neutral-900 leading-[0.95] mb-3 md:text-5xl">
                Welcome to the Hopamine Network.
              </h1>
              <p className="font-serif text-lg text-neutral-500 mb-10">
                Here&apos;s what others are already building.
              </p>

              {/* 2×2 project grid — same visual format as /projects */}
              <div className="grid grid-cols-2 gap-4 mb-10">
                {PROJECT_TILES.map(({ caption, title, person }, i) => (
                  <motion.article
                    key={title}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + i * 0.08, duration: 0.4 }}
                    className="flex min-w-0 flex-col"
                  >
                    <div className="relative aspect-video min-h-0 w-full rounded-none border-2 border-accent-navbar bg-white">
                      <div className="absolute bottom-0 left-0 flex max-w-[92%] flex-col items-start gap-1 p-2.5">
                        <p className="line-clamp-2 font-mono text-[9px] leading-snug tracking-wide text-accent-navbar uppercase">
                          {caption}
                        </p>
                        <h3 className="font-serif text-[1rem] leading-[1.1] tracking-[-0.03em] text-neutral-900 line-clamp-2">
                          {title}
                        </h3>
                      </div>
                    </div>
                    <div className="mt-2">
                      <p className="font-mono text-xs tracking-wide text-neutral-500">
                        {person}
                      </p>
                    </div>
                  </motion.article>
                ))}
              </div>

              {/* ——— and ——— divider */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.4 }}
                className="flex items-center gap-4 mb-8"
              >
                <div className="flex-1 h-px bg-neutral-200" />
                <span className="font-mono text-xs uppercase tracking-[0.2em] text-neutral-400">and</span>
                <div className="flex-1 h-px bg-neutral-200" />
              </motion.div>

              {/* Discord CTA */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.4 }}
                className="mb-10"
              >
                <p className="font-serif text-xl text-neutral-700 mb-5">
                  The real work happens in our community.
                </p>
                <a
                  href="https://discord.gg/ESymdPMhCD"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 font-mono text-sm uppercase tracking-wide px-6 py-3 bg-[#5865F2] text-white hover:bg-[#4752c4] transition-colors"
                >
                  {/* Discord glyph */}
                  <svg width="18" height="14" viewBox="0 0 18 14" fill="none" aria-hidden="true">
                    <path
                      d="M15.245 1.175A14.81 14.81 0 0 0 11.587 0c-.162.29-.35.68-.48.99a13.705 13.705 0 0 0-4.214 0A10.68 10.68 0 0 0 6.41 0 14.855 14.855 0 0 0 2.75 1.178C.395 4.703-.242 8.14.076 11.527a15.01 15.01 0 0 0 4.591 2.347c.37-.507.7-1.047.982-1.617a9.69 9.69 0 0 1-1.546-.749c.13-.096.257-.195.38-.298 2.978 1.39 6.212 1.39 9.153 0 .124.103.252.202.38.298-.491.293-1.011.547-1.549.75.283.57.612 1.111.982 1.617a14.99 14.99 0 0 0 4.593-2.348c.376-3.965-.637-7.367-2.797-10.352ZM6.013 9.44c-.908 0-1.655-.845-1.655-1.879 0-1.034.73-1.88 1.655-1.88.924 0 1.67.846 1.655 1.88 0 1.034-.73 1.88-1.655 1.88Zm6.14 0c-.908 0-1.655-.845-1.655-1.879 0-1.034.73-1.88 1.655-1.88.924 0 1.67.846 1.655 1.88 0 1.034-.73 1.88-1.655 1.88Z"
                      fill="currentColor"
                    />
                  </svg>
                  Join us on Discord
                </a>
              </motion.div>

              {/* Secondary — dashboard */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.75, duration: 0.4 }}
              >
                <button
                  onClick={() => router.push("/dashboard")}
                  className={outlineBtn(true)}
                >
                  Go to your dashboard →
                </button>
              </motion.div>
            </motion.div>

          ) : (

          /* ══ Onboarding questions ════════════════════════════════════════ */
          <motion.div
            key="onboard"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="w-full max-w-2xl bg-white rounded-2xl shadow-[0_24px_80px_rgba(0,0,0,0.14)] px-8 py-10 md:px-12 md:py-12"
          >
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent-navbar mb-3">
              The Hopamine Network
            </p>
            <h1 className="font-serif text-4xl tracking-[-0.05em] text-neutral-900 leading-[0.95] mb-10 md:text-5xl">
              We&apos;re building a hopeful future for all.
            </h1>

            <div className="space-y-8">

              {/* Q1 — Name ─────────────────────────────────────────────── */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                <AnimatePresence mode="wait">
                  {!nameDone ? (
                    <motion.div key="q1-ask" exit={{ opacity: 0, transition: { duration: 0.2 } }}>
                      <p className="font-serif text-2xl text-neutral-900 mb-5">What&apos;s your name?</p>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your name"
                        onKeyDown={(e) => e.key === "Enter" && submitName()}
                        className="w-full bg-transparent font-serif text-2xl text-neutral-700 placeholder:text-neutral-300 focus:outline-none border-b border-neutral-200 focus:border-accent-navbar transition-colors pb-2 mb-4"
                      />
                      <button onClick={submitName} disabled={!name.trim()} className={outlineBtn(!!name.trim())}>
                        Continue
                      </button>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="q1-done"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                      onClick={() => setNameDone(false)}
                      className="cursor-pointer hover:opacity-70 transition-opacity group"
                    >
                      <p className="font-serif text-3xl text-neutral-900 leading-snug">
                        I&apos;m <span className="text-accent-navbar">{name}</span>.
                        <span className="ml-2 font-mono text-xs text-neutral-900 opacity-0 group-hover:opacity-100 transition-opacity align-middle">edit</span>
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Q2 — Location ──────────────────────────────────────────── */}
              <AnimatePresence>
                {nameDone && (
                  <motion.div
                    key="q2"
                    initial={{ opacity: 0, y: 22 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.55, ease: "easeOut" }}
                  >
                    <AnimatePresence mode="wait">
                      {!locationDone ? (
                        <motion.div key="q2-ask" exit={{ opacity: 0, transition: { duration: 0.2 } }}>
                          <p className="font-serif text-2xl text-neutral-900 mb-5">
                            Where are you building from?
                          </p>
                          <LocationCombobox
                            onSelect={setLocation}
                            onSubmit={submitLocation}
                          />
                          <button
                            onClick={submitLocation}
                            disabled={!location.trim()}
                            className={outlineBtn(!!location.trim())}
                          >
                            Continue
                          </button>
                        </motion.div>
                      ) : (
                        <motion.div
                          key="q2-done"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.5 }}
                          onClick={() => setLocationDone(false)}
                          className="cursor-pointer hover:opacity-70 transition-opacity group"
                        >
                          <p className="font-serif text-3xl text-neutral-900 leading-snug">
                            I&apos;m building from <span className="text-accent-navbar">{location}</span>.
                            <span className="ml-2 font-mono text-xs text-neutral-900 opacity-0 group-hover:opacity-100 transition-opacity align-middle">edit</span>
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Q3 — Archetypes ────────────────────────────────────────── */}
              <AnimatePresence>
                {locationDone && (
                  <motion.div
                    key="q3"
                    initial={{ opacity: 0, y: 22 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.55, ease: "easeOut" }}
                  >
                    <AnimatePresence mode="wait">
                      {!badgesDone ? (
                        <motion.div key="q3-ask" exit={{ opacity: 0, transition: { duration: 0.2 } }}>
                          <p className="font-serif text-2xl text-neutral-900 mb-5">
                            Which archetypes resonate with you?
                          </p>
                          <div className="space-y-2 mb-5 max-h-96 overflow-y-auto">
                            {BADGES.map((badge) => (
                              <button
                                key={badge.id}
                                onClick={() =>
                                  setBadges((prev) =>
                                    prev.includes(badge.id)
                                      ? prev.filter((x) => x !== badge.id)
                                      : [...prev, badge.id]
                                  )
                                }
                                className={`w-full text-left border px-4 py-3 font-serif text-sm transition-colors cursor-pointer ${
                                  badges.includes(badge.id)
                                    ? "border-accent-navbar bg-accent-navbar/10 text-neutral-900"
                                    : "border-neutral-200 text-neutral-600 hover:border-accent-navbar"
                                }`}
                              >
                                <span className="text-lg mr-2">{badge.emoji}</span>
                                <span className="font-mono font-semibold text-xs">{badge.title}</span>
                                <p className="font-serif text-xs text-neutral-500 italic mt-1">
                                  &ldquo;{badge.quote}&rdquo;
                                </p>
                              </button>
                            ))}
                          </div>
                          <button
                            onClick={submitBadges}
                            disabled={badges.length === 0}
                            className={outlineBtn(badges.length > 0)}
                          >
                            Continue
                          </button>
                        </motion.div>
                      ) : (
                        <motion.div key="q3-done" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                          <p
                            onClick={() => { setTempBadges([...badges]); setOpenBadges(!openBadges) }}
                            className="font-serif text-3xl text-neutral-900 leading-snug cursor-pointer hover:opacity-70 transition-opacity group mb-3"
                          >
                            Archetypes: <span className="text-accent-navbar">{joinList(badgeLabels)}</span>
                            <span className="ml-2 font-mono text-xs text-neutral-900 opacity-0 group-hover:opacity-100 transition-opacity align-middle">edit</span>
                          </p>
                          <AnimatePresence>
                            {openBadges && (
                              <motion.div
                                initial={{ opacity: 0, y: -6 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -6 }}
                                transition={{ duration: 0.25, ease: [0.25, 0, 0, 1] }}
                                className="mt-4 space-y-2 mb-4 max-h-72 overflow-y-auto"
                              >
                                {BADGES.map((badge) => (
                                  <button
                                    key={badge.id}
                                    onClick={() =>
                                      setTempBadges((prev) =>
                                        prev.includes(badge.id)
                                          ? prev.filter((x) => x !== badge.id)
                                          : [...prev, badge.id]
                                      )
                                    }
                                    className={`w-full text-left border px-3 py-2 font-serif text-xs transition-colors cursor-pointer ${
                                      tempBadges.includes(badge.id)
                                        ? "border-accent-navbar bg-accent-navbar/10"
                                        : "border-neutral-200 hover:border-accent-navbar"
                                    }`}
                                  >
                                    <span className="text-lg mr-2">{badge.emoji}</span>
                                    <span className="font-mono font-semibold text-xs">{badge.title}</span>
                                  </button>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                          <AnimatePresence>
                            {openBadges && (
                              <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex gap-3"
                              >
                                <button
                                  onClick={saveBadges}
                                  disabled={tempBadges.length === 0}
                                  className={outlineBtn(tempBadges.length > 0).replace("px-6 py-2.5", "px-5 py-2")}
                                >
                                  Save
                                </button>
                                <button onClick={() => setOpenBadges(false)} className={smallOutlineBtn}>
                                  Cancel
                                </button>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Q4 — Skills ────────────────────────────────────────────── */}
              <AnimatePresence>
                {badgesDone && (
                  <motion.div
                    key="q4"
                    initial={{ opacity: 0, y: 22 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.55, ease: "easeOut" }}
                  >
                    <AnimatePresence mode="wait">
                      {!skillsDone ? (
                        <motion.div key="q4-ask" exit={{ opacity: 0, transition: { duration: 0.2 } }}>
                          <p className="font-serif text-2xl text-neutral-900 mb-5">What are your core skills?</p>
                          <div className="space-y-3 mb-4">
                            {skillsList.map((skill, i) => (
                              <div key={i} className="flex items-center gap-3">
                                <input
                                  value={skill}
                                  onChange={(e) => {
                                    const next = [...skillsList]
                                    next[i] = e.target.value
                                    setSkillsList(next)
                                  }}
                                  maxLength={35}
                                  placeholder={i === 0 ? "Permaculture design…" : i === 1 ? "Regenerative agriculture…" : `Skill ${i + 1}…`}
                                  className="flex-1 bg-transparent font-serif text-xl text-neutral-700 placeholder:text-neutral-300 focus:outline-none border-b border-neutral-200 focus:border-accent-navbar transition-colors pb-1"
                                />
                                {skillsList.length > 1 && (
                                  <button
                                    onClick={() => setSkillsList(skillsList.filter((_, j) => j !== i))}
                                    className="text-neutral-300 hover:text-neutral-400 transition-colors font-mono text-xl leading-none pb-1"
                                  >
                                    ×
                                  </button>
                                )}
                              </div>
                            ))}
                          </div>
                          {skillsList.length < 5 && (
                            <button
                              onClick={() => setSkillsList([...skillsList, ""])}
                              className="flex items-center gap-1.5 font-mono text-sm text-accent-navbar hover:text-[#0090d4] transition-colors mb-5"
                            >
                              <span className="text-xl font-light leading-none">+</span>
                              <span>Add skill</span>
                            </button>
                          )}
                          <button
                            onClick={submitSkills}
                            disabled={!skillsList.some((s) => s.trim())}
                            className={outlineBtn(skillsList.some((s) => s.trim()))}
                          >
                            Continue
                          </button>
                        </motion.div>
                      ) : editingSkills ? (
                        <motion.div key="q4-edit" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                          <p className="font-serif text-2xl text-neutral-900 mb-5">What are your core skills?</p>
                          <div className="space-y-3 mb-4">
                            {tempSkillsList.map((skill, i) => (
                              <div key={i} className="flex items-center gap-3">
                                <input
                                  value={skill}
                                  onChange={(e) => {
                                    const next = [...tempSkillsList]
                                    next[i] = e.target.value
                                    setTempSkillsList(next)
                                  }}
                                  maxLength={35}
                                  placeholder={`Skill ${i + 1}…`}
                                  className="flex-1 bg-transparent font-serif text-xl text-neutral-700 placeholder:text-neutral-300 focus:outline-none border-b border-neutral-200 focus:border-accent-navbar transition-colors pb-1"
                                />
                                {tempSkillsList.length > 1 && (
                                  <button
                                    onClick={() => setTempSkillsList(tempSkillsList.filter((_, j) => j !== i))}
                                    className="text-neutral-300 hover:text-neutral-400 transition-colors font-mono text-xl leading-none pb-1"
                                  >
                                    ×
                                  </button>
                                )}
                              </div>
                            ))}
                          </div>
                          {tempSkillsList.length < 5 && (
                            <button
                              onClick={() => setTempSkillsList([...tempSkillsList, ""])}
                              className="flex items-center gap-1.5 font-mono text-sm text-accent-navbar hover:text-[#0090d4] transition-colors mb-4"
                            >
                              <span className="text-xl font-light leading-none">+</span>
                              <span>Add skill</span>
                            </button>
                          )}
                          <div className="mt-2 flex items-center gap-4">
                            <button
                              onClick={saveSkills}
                              disabled={!tempSkillsList.some((s) => s.trim())}
                              className={outlineBtn(tempSkillsList.some((s) => s.trim())).replace("px-6 py-2.5", "px-5 py-2")}
                            >
                              Save
                            </button>
                            <button onClick={() => setEditingSkills(false)} className={smallOutlineBtn}>Cancel</button>
                          </div>
                        </motion.div>
                      ) : (
                        <motion.div
                          key="q4-done"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.5 }}
                          onClick={() => { setTempSkillsList([...skillsList]); setEditingSkills(true) }}
                          className="cursor-pointer hover:opacity-70 transition-opacity group"
                        >
                          <p className="font-serif text-3xl text-neutral-900 leading-snug mb-3">
                            Core skills:
                            <span className="ml-2 font-mono text-xs text-neutral-900 opacity-0 group-hover:opacity-100 transition-opacity align-middle">edit</span>
                          </p>
                          <ul className="flex flex-col gap-1.5">
                            {skillsList.filter((s) => s.trim()).map((s, i) => (
                              <li key={i} className="font-serif text-2xl text-accent-navbar">
                                {s}
                              </li>
                            ))}
                          </ul>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Q5 — Vision ────────────────────────────────────────────── */}
              <AnimatePresence>
                {skillsDone && (
                  <motion.div
                    key="q5"
                    initial={{ opacity: 0, y: 22 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.55, ease: "easeOut" }}
                  >
                    <AnimatePresence mode="wait">
                      {!visionDone ? (
                        <motion.div key="q5-ask" exit={{ opacity: 0, transition: { duration: 0.2 } }}>
                          <p className="font-serif text-2xl text-neutral-900 mb-5">What&apos;s your vision for the future?</p>
                          <AutoTextarea value={visionDraft} onChange={setVisionDraft} placeholder="Describe your vision…" />
                          <div className="mt-4 flex items-center gap-4">
                            <button onClick={submitVision} disabled={!visionDraft.trim()} className={outlineBtn(!!visionDraft.trim())}>
                              Continue
                            </button>
                            <span className="font-mono text-xs text-neutral-300">
                              {visionDraft.trim().split(/\s+/).filter(Boolean).length} words
                            </span>
                          </div>
                        </motion.div>
                      ) : editingVision ? (
                        <motion.div key="q5-edit" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                          <p className="font-serif text-2xl text-neutral-900 mb-5">What&apos;s your vision for the future?</p>
                          <AutoTextarea value={tempVision} onChange={setTempVision} placeholder="Describe your vision…" />
                          <div className="mt-4 flex items-center gap-4">
                            <button onClick={saveVision} disabled={!tempVision.trim()} className={outlineBtn(!!tempVision.trim())}>
                              Save
                            </button>
                            <button onClick={() => setEditingVision(false)} className={smallOutlineBtn}>Cancel</button>
                            <span className="font-mono text-xs text-neutral-300 ml-auto">
                              {tempVision.trim().split(/\s+/).filter(Boolean).length} words
                            </span>
                          </div>
                        </motion.div>
                      ) : (
                        <motion.div
                          key="q5-done"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.5 }}
                          onClick={() => { setTempVision(vision); setEditingVision(true) }}
                          className="cursor-pointer hover:opacity-70 transition-opacity group"
                        >
                          <p className="font-serif text-3xl text-neutral-900 leading-snug mb-3">
                            Your vision:
                            <span className="ml-2 font-mono text-xs text-neutral-900 opacity-0 group-hover:opacity-100 transition-opacity align-middle">edit</span>
                          </p>
                          <p className="font-serif text-3xl text-accent-navbar leading-snug">
                            &ldquo;{displayVision}&rdquo;
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Q6 — Why ──────────────────────────────────────────────── */}
              <AnimatePresence>
                {visionDone && (
                  <motion.div
                    key="q6"
                    initial={{ opacity: 0, y: 22 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.55, ease: "easeOut" }}
                  >
                    <AnimatePresence mode="wait">
                      {!done ? (
                        <motion.div key="q6-ask" exit={{ opacity: 0, transition: { duration: 0.2 } }}>
                          <p className="font-serif text-2xl text-neutral-900 mb-5">
                            Why does this movement matter to you?
                          </p>
                          <AutoTextarea
                            value={whyDraft}
                            onChange={setWhyDraft}
                            placeholder="Share what draws you to this work…"
                          />
                          <div className="mt-4 flex items-center gap-4">
                            <button
                              onClick={submitWhy}
                              disabled={!whyDraft.trim()}
                              className={outlineBtn(!!whyDraft.trim())}
                            >
                              Continue
                            </button>
                            <span className="font-mono text-xs text-neutral-300">
                              {whyDraft.trim().split(/\s+/).filter(Boolean).length} words
                            </span>
                          </div>
                        </motion.div>
                      ) : (
                        <motion.div key="q6-done" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                          <p className="font-serif text-3xl text-neutral-900 leading-snug mb-3">
                            Why does this movement matter to you?
                          </p>
                          <p className="font-serif text-3xl text-accent-navbar leading-snug italic">
                            &ldquo;{why}&rdquo;
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Q7 — Discord ──────────────────────────────────────────── */}
              <AnimatePresence>
                {done && (
                  <motion.div
                    key="q7"
                    initial={{ opacity: 0, y: 22 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.55, ease: "easeOut" }}
                  >
                    <AnimatePresence mode="wait">
                      {!discordDone ? (
                        <motion.div key="q7-ask" exit={{ opacity: 0, transition: { duration: 0.2 } }}>
                          <p className="font-serif text-2xl text-neutral-900 mb-1">
                            What&apos;s your Discord? <span className="font-mono text-sm text-neutral-400">(optional)</span>
                          </p>
                          <p className="font-mono text-xs text-neutral-400 mb-5">Others can copy your username to add you directly.</p>
                          <input
                            type="text"
                            value={discord}
                            onChange={(e) => { setDiscord(e.target.value); setDiscordError("") }}
                            onKeyDown={(e) => e.key === "Enter" && submitDiscord()}
                            placeholder="yourname"
                            className="w-full bg-transparent font-serif text-xl text-neutral-700 placeholder:text-neutral-300 focus:outline-none border-b border-neutral-200 focus:border-accent-navbar transition-colors pb-2 mb-2"
                          />
                          {discordError && (
                            <p className="font-mono text-xs text-red-500 mb-3">{discordError}</p>
                          )}
                          <div className="flex items-center gap-3 mt-4">
                            <button onClick={submitDiscord} className={outlineBtn(true)}>
                              Continue
                            </button>
                            <button
                              onClick={() => { setDiscord(""); setDiscordError(""); setDiscordDone(true); scrollDown() }}
                              className={smallOutlineBtn}
                            >
                              Skip
                            </button>
                          </div>
                        </motion.div>
                      ) : (
                        <motion.div
                          key="q7-done"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.5 }}
                          onClick={() => setDiscordDone(false)}
                          className="cursor-pointer hover:opacity-70 transition-opacity group"
                        >
                          <p className="font-serif text-3xl text-neutral-900 leading-snug">
                            Discord:{" "}
                            <span className="text-accent-navbar">
                              {discord.trim() ? discord.replace(/^https?:\/\//, "") : "skipped"}
                            </span>
                            <span className="ml-2 font-mono text-xs text-neutral-900 opacity-0 group-hover:opacity-100 transition-opacity align-middle">edit</span>
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Finish CTA ─────────────────────────────────────────────── */}
              <AnimatePresence>
                {discordDone && (
                  <motion.div
                    key="done"
                    initial={{ opacity: 0, y: 22 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="pt-6 border-t border-neutral-100"
                  >
                    <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent-navbar mb-3">
                      Welcome to the network.
                    </p>
                    <h2 className="font-serif text-4xl tracking-[-0.04em] text-neutral-900 mb-8">
                      Now let&apos;s build something.
                    </h2>
                    <button
                      onClick={() => void finishOnboarding()}
                      disabled={submitting || isAuthLoading || !isAuthenticated}
                      className={`font-mono text-sm uppercase tracking-wide px-8 py-3 transition-colors cursor-pointer ${
                        submitting || isAuthLoading || !isAuthenticated
                          ? "bg-neutral-200 text-neutral-400 cursor-default"
                          : "bg-accent-navbar text-white hover:bg-[#0090d4]"
                      }`}
                    >
                      {submitting ? "Saving…" : isAuthLoading ? "Loading…" : "Submit →"}
                    </button>
                    {submitError && (
                      <p className="mt-3 font-mono text-xs text-red-500">{submitError}</p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

            </div>
            <div ref={endRef} className="h-1" />
          </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
