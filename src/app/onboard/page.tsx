"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

const LOCATIONS = ["San Francisco", "New York", "Austin", "Berlin", "Somewhere else"]

const BADGES = [
  {
    id: "seedcaster",
    emoji: "🌱",
    title: "THE SEEDCASTER",
    quote: "They plant what others haven't imagined yet.",
  },
  {
    id: "fabricant",
    emoji: "⚙️",
    title: "THE FABRICANT",
    quote: "If it doesn't exist, they build it.",
  },
  {
    id: "mycelian",
    emoji: "🍄",
    title: "THE MYCELIAN",
    quote: "They think in networks and grow in the dark.",
  },
  {
    id: "terraformer",
    emoji: "🏗️",
    title: "THE TERRAFORMER",
    quote: "They redesign the spaces we inhabit.",
  },
  {
    id: "developer",
    emoji: "💻",
    title: "THE DEVELOPER",
    quote: "They write the tools of sovereignty.",
  },
  {
    id: "artisan",
    emoji: "🎨",
    title: "THE ARTISAN",
    quote: "They make the future beautiful enough to want.",
  },
  {
    id: "chronicler",
    emoji: "📡",
    title: "THE CHRONICLER",
    quote: "They make sure the work gets seen.",
  },
  {
    id: "cultivar",
    emoji: "🌿",
    title: "THE CULTIVAR",
    quote: "They bridge the lab and the land.",
  },
  {
    id: "loomkeeper",
    emoji: "🔗",
    title: "THE LOOMKEEPER",
    quote: "They hold the network together.",
  },
  {
    id: "verdant",
    emoji: "📜",
    title: "THE VERDANT",
    quote: "They change the rules of the game.",
  },
]

function joinList(items: string[]) {
  if (items.length === 1) return items[0]
  if (items.length === 2) return `${items[0]} & ${items[1]}`
  return `${items.slice(0, -1).join(", ")} & ${items[items.length - 1]}`
}

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
      className="w-full resize-none overflow-hidden bg-transparent font-serif text-xl text-neutral-700 placeholder:text-neutral-300 focus:outline-none leading-relaxed border-b border-neutral-200 focus:border-accent-navbar transition-colors pb-1"
    />
  )
}

export default function OnboardPage() {
  const [name, setName] = useState("")
  const [nameDone, setNameDone] = useState(false)
  const [location, setLocation] = useState<string | null>(null)
  const [badges, setBadges] = useState<string[]>([])
  const [badgesDone, setBadgesDone] = useState(false)
  const [skillsDraft, setSkillsDraft] = useState("")
  const [skills, setSkills] = useState("")
  const [skillsDone, setSkillsDone] = useState(false)
  const [visionDraft, setVisionDraft] = useState("")
  const [vision, setVision] = useState("")
  const [visionDone, setVisionDone] = useState(false)
  const [whyDraft, setWhyDraft] = useState("")
  const [why, setWhy] = useState("")
  const [done, setDone] = useState(false)

  // Inline reveal state for badge question
  const [openBadges, setOpenBadges] = useState(false)
  const [tempBadges, setTempBadges] = useState<string[]>([])

  // Edit state for name/location
  const [editingNameLocation, setEditingNameLocation] = useState(false)
  const [tempName, setTempName] = useState("")
  const [tempLocation, setTempLocation] = useState<string | null>(null)

  // Expand-in-place state for text questions
  const [editingSkills, setEditingSkills] = useState(false)
  const [tempSkills, setTempSkills] = useState("")
  const [editingVision, setEditingVision] = useState(false)
  const [tempVision, setTempVision] = useState("")

  const endRef = useRef<HTMLDivElement>(null)

  function scrollDown() {
    setTimeout(() => endRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }), 120)
  }

  function submitName() {
    if (!name.trim() || !location) return
    setNameDone(true)
    scrollDown()
  }

  function saveNameLocation() {
    if (!tempName.trim() || !tempLocation) return
    setName(tempName.trim())
    setLocation(tempLocation)
    setEditingNameLocation(false)
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
    if (!skillsDraft.trim()) return
    setSkills(skillsDraft.trim())
    setSkillsDone(true)
    scrollDown()
  }

  function saveSkills() {
    if (!tempSkills.trim()) return
    setSkills(tempSkills.trim())
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

  function submitWhy() {
    if (!whyDraft.trim()) return
    setWhy(whyDraft.trim())
    setDone(true)
    scrollDown()
  }

  const displaySkills = skills.length > 300 ? skills.slice(0, 300).trimEnd() + "…" : skills
  const displayVision = vision.length > 300 ? vision.slice(0, 300).trimEnd() + "…" : vision
  const badgeLabels = badges
    .map(id => BADGES.find(b => b.id === id)?.title)
    .filter((title): title is string => Boolean(title))

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto bg-[linear-gradient(to_bottom_right,#00a6f3_0%,#00a6f3_35%,#cdeefc_62%,#f5fafc_82%,#fefefe_100%)]">
      <div className="flex justify-center px-5 pb-48 pt-14">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-xl bg-white rounded-2xl shadow-[0_24px_80px_rgba(0,0,0,0.14)] px-8 py-10 md:px-10 md:py-12"
        >
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent-navbar mb-3">
            The Hopamine Network
          </p>
          <h1 className="font-serif text-4xl tracking-[-0.05em] text-neutral-900 leading-[0.95] mb-10 md:text-5xl">
            We&apos;re building a hopeful future for all.
          </h1>

          <div className="space-y-8">
            {/* Q1 — Name */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <AnimatePresence mode="wait">
                {!nameDone ? (
                  <motion.div key="q1-ask" exit={{ opacity: 0, transition: { duration: 0.2 } }}>
                    <p className="font-serif text-xl text-neutral-900 mb-5">
                      What&apos;s your name?
                    </p>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name"
                      onKeyDown={(e) => e.key === "Enter" && submitName()}
                      className="w-full bg-transparent font-serif text-xl text-neutral-700 placeholder:text-neutral-300 focus:outline-none border-b border-neutral-200 focus:border-accent-navbar transition-colors pb-2 mb-4"
                    />
                    <p className="font-serif text-xl text-neutral-900 mb-5">
                      Where are you building from?
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {LOCATIONS.map((loc, i) => (
                        <motion.button
                          key={loc}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5 + i * 0.05 }}
                          onClick={() => setLocation(loc)}
                          className={`border px-4 py-2 font-mono text-sm transition-colors cursor-pointer ${location === loc ? "border-accent-navbar bg-accent-navbar text-white" : "border-neutral-200 text-neutral-600 hover:border-accent-navbar hover:text-accent-navbar"}`}
                        >
                          {loc}
                        </motion.button>
                      ))}
                    </div>
                    <button
                      onClick={submitName}
                      disabled={!name.trim() || !location}
                      className={`font-mono text-sm uppercase tracking-wide px-6 py-2.5 border-2 transition-colors cursor-pointer ${
                        name.trim() && location
                          ? "border-accent-navbar text-accent-navbar hover:bg-accent-navbar hover:text-white"
                          : "border-neutral-200 text-neutral-300 cursor-default"
                      }`}
                    >
                      Continue →
                    </button>
                  </motion.div>
                ) : editingNameLocation ? (
                  <motion.div key="q1-edit" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <p className="font-serif text-xl text-neutral-900 mb-5">
                      What's your name?
                    </p>
                    <input
                      type="text"
                      value={tempName}
                      onChange={(e) => setTempName(e.target.value)}
                      placeholder="Your name"
                      className="w-full bg-transparent font-serif text-xl text-neutral-700 placeholder:text-neutral-300 focus:outline-none border-b border-neutral-200 focus:border-accent-navbar transition-colors pb-2 mb-4"
                    />
                    <p className="font-serif text-xl text-neutral-900 mb-5">
                      Where are you building from?
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {LOCATIONS.map((loc) => (
                        <button
                          key={loc}
                          onClick={() => setTempLocation(loc)}
                          className={`border px-4 py-2 font-mono text-sm transition-colors cursor-pointer ${tempLocation === loc ? "border-accent-navbar bg-accent-navbar text-white" : "border-neutral-200 text-neutral-600 hover:border-accent-navbar hover:text-accent-navbar"}`}
                        >
                          {loc}
                        </button>
                      ))}
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={saveNameLocation}
                        disabled={!tempName.trim() || !tempLocation}
                        className={`font-mono text-sm uppercase tracking-wide px-5 py-2 border-2 transition-colors cursor-pointer ${tempName.trim() && tempLocation ? "border-accent-navbar text-accent-navbar hover:bg-accent-navbar hover:text-white" : "border-neutral-200 text-neutral-300 cursor-default"}`}
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingNameLocation(false)}
                        className="font-mono text-sm uppercase tracking-wide px-5 py-2 border border-neutral-200 text-neutral-400 hover:text-neutral-700 transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="q1-done"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    onClick={() => {
                      setTempName(name)
                      setTempLocation(location)
                      setEditingNameLocation(true)
                    }}
                    className="cursor-pointer hover:opacity-70 transition-opacity group"
                  >
                    <p className="font-serif text-3xl text-neutral-900 leading-snug">
                      <span className="text-accent-navbar">{name}</span>, building from{" "}
                      <span className="text-accent-navbar">{location}</span>.
                      <span className="ml-2 font-mono text-xs text-neutral-900 opacity-0 group-hover:opacity-100 transition-opacity align-middle">
                        edit
                      </span>
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Q2 — Badges */}
            <AnimatePresence>
              {nameDone && (
                <motion.div
                  key="q2"
                  initial={{ opacity: 0, y: 22 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.55, ease: "easeOut" }}
                >
                  <AnimatePresence mode="wait">
                    {!badgesDone ? (
                      <motion.div key="q2-ask" exit={{ opacity: 0, transition: { duration: 0.2 } }}>
                        <p className="font-serif text-xl text-neutral-900 mb-5">
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
                                "{badge.quote}"
                              </p>
                            </button>
                          ))}
                        </div>
                        <button
                          onClick={submitBadges}
                          disabled={badges.length === 0}
                          className={`font-mono text-sm uppercase tracking-wide px-6 py-2.5 border-2 transition-colors cursor-pointer ${
                            badges.length > 0
                              ? "border-accent-navbar text-accent-navbar hover:bg-accent-navbar hover:text-white"
                              : "border-neutral-200 text-neutral-300 cursor-default"
                          }`}
                        >
                          Continue →
                        </button>
                      </motion.div>
                    ) : (
                      <motion.div key="q2-done" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                        <p
                          onClick={() => setOpenBadges(!openBadges)}
                          className="font-serif text-3xl text-neutral-900 leading-snug cursor-pointer hover:opacity-70 transition-opacity group mb-3"
                        >
                          Archetypes: <span className="text-accent-navbar">{joinList(badgeLabels)}</span>
                          <span className="ml-2 font-mono text-xs text-neutral-900 opacity-0 group-hover:opacity-100 transition-opacity align-middle">
                            edit
                          </span>
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
                                className={`font-mono text-sm uppercase tracking-wide px-5 py-2 border-2 transition-colors cursor-pointer ${
                                  tempBadges.length > 0
                                    ? "border-accent-navbar text-accent-navbar hover:bg-accent-navbar hover:text-white"
                                    : "border-neutral-200 text-neutral-300 cursor-default"
                                }`}
                              >
                                Save
                              </button>
                              <button
                                onClick={() => setOpenBadges(false)}
                                className="font-mono text-sm uppercase tracking-wide px-5 py-2 border border-neutral-200 text-neutral-400 hover:text-neutral-700 transition-colors cursor-pointer"
                              >
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

            {/* Q3 — Skills */}
            <AnimatePresence>
              {badgesDone && (
                <motion.div
                  key="q3"
                  initial={{ opacity: 0, y: 22 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.55, ease: "easeOut" }}
                >
                  <AnimatePresence mode="wait">
                    {!skillsDone ? (
                      <motion.div key="q3-ask" exit={{ opacity: 0, transition: { duration: 0.2 } }}>
                        <p className="font-serif text-xl text-neutral-900 mb-5">
                          What are your core skills?
                        </p>
                        <AutoTextarea
                          value={skillsDraft}
                          onChange={setSkillsDraft}
                          placeholder="e.g., Software development, design, community organizing…"
                        />
                        <div className="mt-4 flex items-center gap-4">
                          <button
                            onClick={submitSkills}
                            disabled={!skillsDraft.trim()}
                            className={`font-mono text-sm uppercase tracking-wide px-6 py-2.5 border-2 transition-colors cursor-pointer ${
                              skillsDraft.trim()
                                ? "border-accent-navbar text-accent-navbar hover:bg-accent-navbar hover:text-white"
                                : "border-neutral-200 text-neutral-300 cursor-default"
                            }`}
                          >
                            Continue →
                          </button>
                          <span className="font-mono text-xs text-neutral-300">
                            {skillsDraft.trim().split(/\s+/).filter(Boolean).length} words
                          </span>
                        </div>
                      </motion.div>
                    ) : editingSkills ? (
                      <motion.div key="q3-edit" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <p className="font-serif text-xl text-neutral-900 mb-5">
                          What are your core skills?
                        </p>
                        <AutoTextarea
                          value={tempSkills}
                          onChange={setTempSkills}
                          placeholder="e.g., Software development, design, community organizing…"
                        />
                        <div className="mt-4 flex items-center gap-4">
                          <button
                            onClick={saveSkills}
                            disabled={!tempSkills.trim()}
                            className={`font-mono text-sm uppercase tracking-wide px-6 py-2.5 border-2 transition-colors cursor-pointer ${
                              tempSkills.trim()
                                ? "border-accent-navbar text-accent-navbar hover:bg-accent-navbar hover:text-white"
                                : "border-neutral-200 text-neutral-300 cursor-default"
                            }`}
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingSkills(false)}
                            className="font-mono text-sm uppercase tracking-wide px-5 py-2 border border-neutral-200 text-neutral-400 hover:text-neutral-700 transition-colors cursor-pointer"
                          >
                            Cancel
                          </button>
                          <span className="font-mono text-xs text-neutral-300 ml-auto">
                            {tempSkills.trim().split(/\s+/).filter(Boolean).length} words
                          </span>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="q3-done"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        onClick={() => {
                          setTempSkills(skills)
                          setEditingSkills(true)
                        }}
                        className="cursor-pointer hover:opacity-70 transition-opacity group"
                      >
                        <p className="font-serif text-3xl text-neutral-900 leading-snug mb-3">
                          Core skills:
                          <span className="ml-2 font-mono text-xs text-neutral-900 opacity-0 group-hover:opacity-100 transition-opacity align-middle">
                            edit
                          </span>
                        </p>
                        <p className="font-serif text-3xl text-accent-navbar leading-snug">
                          &ldquo;{displaySkills}&rdquo;
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Q4 — Vision */}
            <AnimatePresence>
              {skillsDone && (
                <motion.div
                  key="q4"
                  initial={{ opacity: 0, y: 22 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.55, ease: "easeOut" }}
                >
                  <AnimatePresence mode="wait">
                    {!visionDone ? (
                      <motion.div key="q4-ask" exit={{ opacity: 0, transition: { duration: 0.2 } }}>
                        <p className="font-serif text-xl text-neutral-900 mb-5">
                          What&apos;s your vision for the future?
                        </p>
                        <AutoTextarea
                          value={visionDraft}
                          onChange={setVisionDraft}
                          placeholder="Describe your vision…"
                        />
                        <div className="mt-4 flex items-center gap-4">
                          <button
                            onClick={submitVision}
                            disabled={!visionDraft.trim()}
                            className={`font-mono text-sm uppercase tracking-wide px-6 py-2.5 border-2 transition-colors cursor-pointer ${
                              visionDraft.trim()
                                ? "border-accent-navbar text-accent-navbar hover:bg-accent-navbar hover:text-white"
                                : "border-neutral-200 text-neutral-300 cursor-default"
                            }`}
                          >
                            Continue →
                          </button>
                          <span className="font-mono text-xs text-neutral-300">
                            {visionDraft.trim().split(/\s+/).filter(Boolean).length} words
                          </span>
                        </div>
                      </motion.div>
                    ) : editingVision ? (
                      <motion.div key="q4-edit" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <p className="font-serif text-xl text-neutral-900 mb-5">
                          What&apos;s your vision for the future?
                        </p>
                        <AutoTextarea
                          value={tempVision}
                          onChange={setTempVision}
                          placeholder="Describe your vision…"
                        />
                        <div className="mt-4 flex items-center gap-4">
                          <button
                            onClick={saveVision}
                            disabled={!tempVision.trim()}
                            className={`font-mono text-sm uppercase tracking-wide px-6 py-2.5 border-2 transition-colors cursor-pointer ${
                              tempVision.trim()
                                ? "border-accent-navbar text-accent-navbar hover:bg-accent-navbar hover:text-white"
                                : "border-neutral-200 text-neutral-300 cursor-default"
                            }`}
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingVision(false)}
                            className="font-mono text-sm uppercase tracking-wide px-5 py-2 border border-neutral-200 text-neutral-400 hover:text-neutral-700 transition-colors cursor-pointer"
                          >
                            Cancel
                          </button>
                          <span className="font-mono text-xs text-neutral-300 ml-auto">
                            {tempVision.trim().split(/\s+/).filter(Boolean).length} words
                          </span>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="q4-done"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        onClick={() => {
                          setTempVision(vision)
                          setEditingVision(true)
                        }}
                        className="cursor-pointer hover:opacity-70 transition-opacity group"
                      >
                        <p className="font-serif text-3xl text-neutral-900 leading-snug mb-3">
                          Your vision:
                          <span className="ml-2 font-mono text-xs text-neutral-900 opacity-0 group-hover:opacity-100 transition-opacity align-middle">
                            edit
                          </span>
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

            {/* Q5 — Why this movement */}
            <AnimatePresence>
              {visionDone && (
                <motion.div
                  key="q5"
                  initial={{ opacity: 0, y: 22 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.55, ease: "easeOut" }}
                >
                  <AnimatePresence mode="wait">
                    {!done ? (
                      <motion.div key="q5-ask" exit={{ opacity: 0, transition: { duration: 0.2 } }}>
                        <p className="font-serif text-xl text-neutral-900 mb-5">
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
                            className={`font-mono text-sm uppercase tracking-wide px-6 py-2.5 border-2 transition-colors cursor-pointer ${
                              whyDraft.trim()
                                ? "border-accent-navbar text-accent-navbar hover:bg-accent-navbar hover:text-white"
                                : "border-neutral-200 text-neutral-300 cursor-default"
                            }`}
                          >
                            Complete →
                          </button>
                          <span className="font-mono text-xs text-neutral-300">
                            {whyDraft.trim().split(/\s+/).filter(Boolean).length} words
                          </span>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="q5-done"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                      >
                        <p className="font-serif text-3xl text-accent-navbar leading-snug">
                          &ldquo;{why}&rdquo;
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Done */}
            <AnimatePresence>
              {done && (
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
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div ref={endRef} className="h-1" />
        </motion.div>
      </div>
    </div>
  )
}
