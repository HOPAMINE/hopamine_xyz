"use client";

import { useEffect, useRef, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";
import { buildHexMosaic, TRI_STYLE, type TriDatum, VH, VW } from "../builders/hexMosaic";

// ─── Constants ────────────────────────────────────────────────────────────────

const TRIANGLES: TriDatum[] = buildHexMosaic(20, 15);
const ROT = 12;
const AV_SIZE = 68;
const BANNER_H = 100;

// ─── Small utilities ──────────────────────────────────────────────────────────


function getInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function EditPencil({ className = "w-3 h-3" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
    >
      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
}

function MosaicBanner() {
  return (
    <div className="w-full overflow-hidden" style={{ height: BANNER_H }}>
      <svg
        viewBox={`0 0 ${VW} ${VH}`}
        preserveAspectRatio="xMidYMid slice"
        aria-hidden
        className="h-full w-full"
      >
        <style>{TRI_STYLE}</style>
        <rect width={VW} height={VH} fill="#00a6f3" />
        <g transform={`rotate(${ROT} ${VW / 2} ${VH / 2})`}>
          {TRIANGLES.map(({ id, pts, shade }) => (
            <polygon key={id} className={`tri tri-${shade}`} points={pts} />
          ))}
        </g>
      </svg>
    </div>
  );
}

function AvatarCircle({
  avatarUrl,
  initials,
  top,
}: {
  avatarUrl?: string;
  initials: string;
  top: number;
}) {
  return (
    <div
      className="absolute left-4 flex items-center justify-center rounded-full border-[3px] border-white bg-[#0090d4] overflow-hidden"
      style={{ width: AV_SIZE, height: AV_SIZE, top }}
    >
      {avatarUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={avatarUrl} alt="" className="w-full h-full object-cover" />
      ) : (
        <span className="font-serif text-lg font-semibold text-white">{initials}</span>
      )}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  multiline = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  multiline?: boolean;
}) {
  const cls =
    "w-full font-mono text-xs text-neutral-900 border border-neutral-200 px-2.5 py-1.5 focus:outline-none focus:border-[#00a6f3] bg-white resize-none";
  return (
    <div>
      <p className="font-mono text-[10px] uppercase tracking-widest text-neutral-400 mb-1">
        {label}
      </p>
      {multiline ? (
        <textarea
          className={cls}
          rows={3}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
      ) : (
        <input
          type="text"
          className={cls}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
      )}
    </div>
  );
}

function SaveCancelRow({
  onSave,
  onCancel,
  saving,
}: {
  onSave: () => void;
  onCancel: () => void;
  saving: boolean;
}) {
  return (
    <div className="flex gap-2 pt-1">
      <button
        onClick={onSave}
        disabled={saving}
        className="bg-[#00a6f3] px-4 py-1.5 font-mono text-[11px] font-semibold uppercase tracking-widest text-white hover:bg-[#0090d4] transition-colors disabled:opacity-40"
      >
        {saving ? "Saving…" : "Save"}
      </button>
      <button
        onClick={onCancel}
        disabled={saving}
        className="px-4 py-1.5 font-mono text-[11px] uppercase tracking-widest text-neutral-500 border border-neutral-200 hover:bg-neutral-50 transition-colors disabled:opacity-40"
      >
        Cancel
      </button>
    </div>
  );
}

// ─── Profile Card Panel ───────────────────────────────────────────────────────

type ConvexUser = NonNullable<ReturnType<typeof useQuery<typeof api.users.getCurrentUser>>>;

function ProfileCardPanel({ user }: { user: ConvexUser }) {
  const updateProfile = useMutation(api.users.updateProfile);
  const generateUploadUrl = useMutation(api.users.generateUploadUrl);
  const fileRef = useRef<HTMLInputElement>(null);

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [draft, setDraft] = useState({ name: "", username: "", location: "", website: "", discord: "" });
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);

  function startEdit() {
    setDraft({
      name: user.name,
      username: user.username ?? "",
      location: user.location ?? "",
      website: user.website ?? "",
      discord: user.socialLinks?.discord ?? "",
    });
    setAvatarPreview(null);
    setPendingFile(null);
    setError(null);
    setEditing(true);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPendingFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  }

  async function handleSave() {
    setSaving(true);
    setError(null);
    try {
      let storageId: Id<"_storage"> | undefined;
      if (pendingFile) {
        const uploadUrl = await generateUploadUrl();
        const resp = await fetch(uploadUrl, {
          method: "POST",
          headers: { "Content-Type": pendingFile.type },
          body: pendingFile,
        });
        if (!resp.ok) throw new Error("Avatar upload failed");
        const { storageId: sid } = await resp.json();
        storageId = sid as Id<"_storage">;
      }
      const discordVal = draft.discord.trim().replace(/^@/, "");
      if (discordVal && !/^[a-zA-Z0-9_.]{2,32}(#\d{4})?$/.test(discordVal)) {
        throw new Error("Invalid Discord username");
      }
      await updateProfile({
        name: draft.name.trim() || undefined,
        username: draft.username.trim() || undefined,
        location: draft.location.trim() || undefined,
        website: draft.website.trim() || undefined,
        discord: discordVal || undefined,
        ...(storageId ? { storageId } : {}),
      });
      setEditing(false);
      if (avatarPreview) URL.revokeObjectURL(avatarPreview);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  const initials = getInitials(user.name);
  const displayAvatar = editing ? (avatarPreview ?? user.avatarUrl) : user.avatarUrl;

  return (
    <article className="relative flex flex-col border-2 border-[#00a6f3] bg-white shadow-[0_4px_20px_rgba(0,0,0,0.12)]">
      <MosaicBanner />

      <AvatarCircle avatarUrl={displayAvatar} initials={initials} top={BANNER_H - AV_SIZE / 2} />
      {/* Presence dot — always online when viewing your own dashboard */}
      <div
        className="absolute w-3 h-3 rounded-full bg-[#00a6f3] border-2 border-white"
        style={{ left: 16 + AV_SIZE - 10, top: BANNER_H - AV_SIZE / 2 + AV_SIZE - 10 }}
      />

      {!editing && (
        <button
          onClick={startEdit}
          className="absolute top-2.5 right-2.5 bg-white/80 backdrop-blur-sm text-[#00a6f3] p-1.5 rounded hover:bg-white transition-colors"
          aria-label="Edit profile card"
        >
          <EditPencil />
        </button>
      )}

      <div
        className="flex flex-grow flex-col gap-3 px-4 pb-5"
        style={{ paddingTop: AV_SIZE / 2 + 14 }}
      >
        {editing ? (
          <>
            <div className="space-y-2.5">
              <Field
                label="Name"
                value={draft.name}
                onChange={(v) => setDraft((d) => ({ ...d, name: v }))}
              />
              <Field
                label="Username"
                value={draft.username}
                onChange={(v) => setDraft((d) => ({ ...d, username: v }))}
                placeholder="yourhandle"
              />
              <Field
                label="Location"
                value={draft.location}
                onChange={(v) => setDraft((d) => ({ ...d, location: v }))}
                placeholder="City, Country"
              />
              <Field
                label="Website"
                value={draft.website}
                onChange={(v) => setDraft((d) => ({ ...d, website: v }))}
                placeholder="yourdomain.com"
              />
              <Field
                label="Discord"
                value={draft.discord}
                onChange={(v) => setDraft((d) => ({ ...d, discord: v }))}
                placeholder="yourname"
              />
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-neutral-400 mb-1">
                  Avatar
                </p>
                <button
                  onClick={() => fileRef.current?.click()}
                  className="font-mono text-[10px] text-[#00a6f3] hover:underline"
                >
                  {pendingFile ? pendingFile.name : "Upload photo…"}
                </button>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>
            </div>
            {error && <p className="font-mono text-[10px] text-red-500">{error}</p>}
            <SaveCancelRow onSave={handleSave} onCancel={() => setEditing(false)} saving={saving} />
          </>
        ) : (
          <>
            <div>
              <h3 className="font-serif text-[1.375rem] leading-snug tracking-[-0.02em] text-neutral-900">
                {user.name}
              </h3>
              {user.username && (
                <p className="font-mono text-[14px] text-neutral-400">@{user.username}</p>
              )}
            </div>
            <div className="space-y-1.5">
              {user.archetypes && user.archetypes.length > 0 && (
                <p className="font-mono text-[13px] uppercase tracking-wide text-neutral-600">
                  {user.archetypes.join(" · ")}
                </p>
              )}
              {user.location && (
                <p className="font-mono text-[13px] text-neutral-400">
                  {user.location.split(",").at(-1)?.trim()}
                </p>
              )}
            </div>
            <div className="mt-auto flex items-center justify-between pt-2 border-t border-neutral-100">
              {user.socialLinks?.discord ? (
                <button
                  onClick={() => {
                    void navigator.clipboard.writeText(user.socialLinks!.discord!);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  className="bg-[#00a6f3] px-4 py-1.5 font-mono text-[14px] font-semibold uppercase tracking-widest text-white hover:bg-[#0090d4] transition-colors"
                >
                  {copied ? "Copied!" : "Connect"}
                </button>
              ) : (
                <button className="bg-[#00a6f3] px-4 py-1.5 font-mono text-[14px] font-semibold uppercase tracking-widest text-white hover:bg-[#0090d4] transition-colors opacity-50 cursor-default">
                  Connect
                </button>
              )}
              {user.website && (
                <span className="font-mono text-[13px] text-neutral-300 truncate max-w-[110px]">
                  {user.website.replace(/^https?:\/\//, "")}
                </span>
              )}
            </div>
          </>
        )}
      </div>
    </article>
  );
}

// ─── Core Profile Panel ───────────────────────────────────────────────────────

function FuturisticDivider() {
  return (
    <div className="self-stretch flex-shrink-0 flex items-center justify-center" style={{ width: 28 }}>
      <style>{`
        @keyframes bar-pulse {
          0%   { top: 110%; opacity: 0; }
          10%  { opacity: 1; }
          85%  { opacity: 1; }
          100% { top: -50%; opacity: 0; }
        }
      `}</style>
      <div
        style={{
          position: "relative",
          width: 5,
          height: "88%",
          borderRadius: "9999px",
          background:
            "linear-gradient(to bottom, transparent 0%, #00a6f3 18%, #00a6f3 82%, transparent 100%)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: "110%",
            height: "40%",
            borderRadius: "9999px",
            background: "linear-gradient(to bottom, transparent, rgba(255,255,255,0.88) 50%, transparent)",
            animation: "bar-pulse 2.4s ease-in-out infinite",
          }}
        />
      </div>
    </div>
  );
}

function InlineEdit({
  value,
  onSave,
  placeholder,
  multiline = true,
  displayContent,
}: {
  value: string;
  onSave: (v: string) => Promise<unknown>;
  placeholder: string;
  multiline?: boolean;
  displayContent?: React.ReactNode;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");

  async function handleBlur() {
    if (draft === value) { setEditing(false); return; }
    try { await onSave(draft); } finally { setEditing(false); }
  }

  if (editing) {
    const cls = "w-full font-mono text-sm text-neutral-800 border border-[#00a6f3]/40 p-2 focus:outline-none focus:border-[#00a6f3] bg-white leading-relaxed resize-none overflow-hidden";
    function autoSize(el: HTMLTextAreaElement | null) {
      if (!el) return;
      el.style.height = "auto";
      el.style.height = el.scrollHeight + "px";
    }
    return multiline ? (
      <textarea
        autoFocus
        className={cls}
        value={draft}
        ref={autoSize}
        onChange={(e) => { setDraft(e.target.value); autoSize(e.target); }}
        onBlur={handleBlur}
      />
    ) : (
      <input autoFocus type="text" className={`${cls} py-1.5`} value={draft} onChange={(e) => setDraft(e.target.value)} onBlur={handleBlur} />
    );
  }

  return (
    <div className="cursor-text" onClick={() => { setDraft(value); setEditing(true); }}>
      {displayContent ?? (value ? (
        <p className="font-mono text-sm text-neutral-700 leading-relaxed">{value}</p>
      ) : (
        <p className="font-mono text-sm text-neutral-300 italic leading-relaxed">{placeholder}</p>
      ))}
    </div>
  );
}

const FLOAT_UP = 15;
const FLOAT_DOWN = 4;
const FLOAT_AMPLITUDE = (FLOAT_UP + FLOAT_DOWN) / 2;
const FLOAT_MID = FLOAT_DOWN - FLOAT_AMPLITUDE;
const FLOAT_PERIOD = 2800;
// Phase offset so the animation starts at y=0 moving upward
const FLOAT_PHASE = Math.PI - Math.asin(-FLOAT_MID / FLOAT_AMPLITUDE);

function FloatingName({ name }: { name: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const rafRef = useRef<number>(0);

  function startFloat() {
    cancelAnimationFrame(rafRef.current);
    if (ref.current) ref.current.style.transition = "none";
    const startTime = performance.now();

    function tick(now: number) {
      if (ref.current) {
        const t = ((now - startTime) / FLOAT_PERIOD) * (2 * Math.PI) + FLOAT_PHASE;
        ref.current.style.transform = `translateY(${FLOAT_MID + FLOAT_AMPLITUDE * Math.sin(t)}px)`;
      }
      rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);
  }

  function stopFloat() {
    cancelAnimationFrame(rafRef.current);
    if (ref.current) {
      ref.current.style.transition = "transform 0.5s ease-out";
      ref.current.style.transform = "translateY(0)";
    }
  }

  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

  return (
    <span
      ref={ref}
      className="text-[#00a6f3] inline-block"
      onMouseEnter={startFloat}
      onMouseLeave={stopFloat}
    >
      {name}
    </span>
  );
}

const HDR_UP = 7;
const HDR_DOWN = 2;
const HDR_AMPLITUDE = (HDR_UP + HDR_DOWN) / 2;
const HDR_MID = HDR_DOWN - HDR_AMPLITUDE;
const HDR_PERIOD = 2800;
const HDR_PHASE = Math.PI - Math.asin(-HDR_MID / HDR_AMPLITUDE);

function FloatingHeader({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLSpanElement>(null);
  const rafRef = useRef<number>(0);

  function startFloat() {
    cancelAnimationFrame(rafRef.current);
    if (ref.current) {
      ref.current.style.transition = "color 0.3s ease";
      ref.current.style.color = "#00a6f3";
    }
    const startTime = performance.now();
    function tick(now: number) {
      if (ref.current) {
        const t = ((now - startTime) / HDR_PERIOD) * (2 * Math.PI) + HDR_PHASE;
        ref.current.style.transform = `translateY(${HDR_MID + HDR_AMPLITUDE * Math.sin(t)}px)`;
      }
      rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);
  }

  function stopFloat() {
    cancelAnimationFrame(rafRef.current);
    if (ref.current) {
      ref.current.style.transition = "transform 0.5s ease-out, color 0.5s ease";
      ref.current.style.transform = "translateY(0)";
      ref.current.style.color = "";
    }
  }

  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

  return (
    <span
      ref={ref}
      className="inline-block cursor-default text-neutral-900"
      onMouseEnter={startFloat}
      onMouseLeave={stopFloat}
    >
      {children}
    </span>
  );
}

function CoreProfilePanel({ user }: { user: ConvexUser }) {
  const updateProfile = useMutation(api.users.updateProfile);

  const [bioEditing, setBioEditing] = useState(false);
  const [bioValue, setBioValue] = useState("");
  const [bioSaving, setBioSaving] = useState(false);

  function startBioEdit() {
    setBioValue(user.bio ?? "");
    setBioEditing(true);
  }

  async function saveBio() {
    if (bioValue === (user.bio ?? "")) { setBioEditing(false); return; }
    setBioSaving(true);
    try { await updateProfile({ bio: bioValue.trim() || undefined }); }
    finally { setBioSaving(false); setBioEditing(false); }
  }

  return (
    <div className="bg-white border border-neutral-200 shadow-sm flex flex-col h-full">
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        <div className="px-6 pt-6 pb-4 shrink-0">
          <h2 className="font-serif text-5xl tracking-[-0.03em] text-neutral-900 leading-snug">
            {user.name.length > 12 ? "Hello I'm " : "Welcome, my name is "}
            <FloatingName name={user.name} />
          </h2>
        </div>

        <div className="flex flex-1 min-h-0 pb-6">
          <div className="flex-1 px-6 flex flex-col gap-6 overflow-y-auto min-w-0">
            <div>
              <h3 className="font-serif text-2xl font-medium mb-2"><FloatingHeader>Why I Work</FloatingHeader></h3>
              <InlineEdit
                value={user.why ?? ""}
                onSave={(v) => updateProfile({ why: v || undefined })}
                placeholder="What drives you…"
              />
            </div>

            <div>
              <h3 className="font-serif text-2xl font-medium mb-2"><FloatingHeader>My Vision for the Future</FloatingHeader></h3>
              <InlineEdit
                value={user.vision ?? ""}
                onSave={(v) => updateProfile({ vision: v || undefined })}
                placeholder="Your north star…"
              />
            </div>

            <div>
              <h3 className="font-serif text-2xl font-medium mb-2"><FloatingHeader>My Skills / Archetype</FloatingHeader></h3>
              <InlineEdit
                value={(user.archetypes ?? []).join(", ")}
                onSave={async (v) => {
                  const archetypes = v.split(",").map((a) => a.trim()).filter(Boolean);
                  await updateProfile({ archetypes });
                }}
                placeholder="Builder, Designer, Hustler…"
                multiline={false}
                displayContent={
                  user.archetypes && user.archetypes.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {user.archetypes.map((a, i) => (
                        <span key={i} className="font-mono text-sm text-[#00a6f3] border border-[#00a6f3]/30 px-2.5 py-0.5 rounded-full">{a}</span>
                      ))}
                    </div>
                  ) : undefined
                }
              />
              <div className="mt-2">
                <InlineEdit
                  value={(user.skills ?? []).join(", ")}
                  onSave={async (v) => {
                    const skills = v.split(",").map((s) => s.trim()).filter(Boolean);
                    await updateProfile({ skills: skills.length > 0 ? skills : undefined });
                  }}
                  placeholder="React, TypeScript, Product design…"
                  multiline={false}
                  displayContent={
                    user.skills && user.skills.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {user.skills.map((s, i) => (
                          <span key={i} className="font-mono text-sm text-[#00a6f3] border border-[#00a6f3]/30 px-2.5 py-0.5 rounded-full">{s}</span>
                        ))}
                      </div>
                    ) : undefined
                  }
                />
              </div>
            </div>
          </div>

          <FuturisticDivider />

          <div className="flex-1 px-6 flex flex-col min-w-0">
            <h3 className="font-serif text-2xl font-medium mb-3 shrink-0"><FloatingHeader>Bio</FloatingHeader></h3>
            <div className="flex-1 relative">
              {bioEditing ? (
                <textarea
                  autoFocus
                  className="absolute inset-0 w-full h-full font-mono text-sm text-neutral-800 resize-none border border-[#00a6f3]/40 p-2.5 focus:outline-none focus:border-[#00a6f3] bg-white leading-relaxed"
                  value={bioValue}
                  onChange={(e) => setBioValue(e.target.value)}
                  onBlur={saveBio}
                />
              ) : (
                <div className="absolute inset-0 cursor-text overflow-y-auto" onClick={startBioEdit}>
                  {user.bio ? (
                    <p className="font-mono text-sm text-neutral-700 leading-relaxed whitespace-pre-wrap">{user.bio}</p>
                  ) : (
                    <p className="font-mono text-sm text-neutral-300 italic leading-relaxed">Fill this out however you want!</p>
                  )}
                </div>
              )}
            </div>
            {bioSaving && <p className="font-mono text-sm text-neutral-400 shrink-0 mt-1">Saving…</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Status Panel ─────────────────────────────────────────────────────────────

const DAYS = ["M", "T", "W", "T", "F", "S", "S"];
const PERIODS = ["AM", "PM", "EVE"];

function StatusPanel({ user }: { user: ConvexUser }) {
  const updateAvailability = useMutation(api.users.updateAvailability);
  const updateNowPlaying = useMutation(api.users.updateNowPlaying);

  type View = "empty" | "schedule" | "music";
  const [view, setView] = useState<View>(
    user.availability && user.availability.length > 0 ? "schedule" : "empty",
  );
  const [localAvailability, setLocalAvailability] = useState<{ day: number; period: number }[]>(
    user.availability ?? [],
  );
  const [nowPlayingDraft, setNowPlayingDraft] = useState(user.nowPlaying ?? "");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function isSelected(day: number, period: number) {
    return localAvailability.some((s) => s.day === day && s.period === period);
  }

  function toggleCell(day: number, period: number) {
    const next = isSelected(day, period)
      ? localAvailability.filter((s) => !(s.day === day && s.period === period))
      : [...localAvailability, { day, period }];
    setLocalAvailability(next);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      void updateAvailability({
        availability: next,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      });
    }, 600);
  }

  const tz = user.timezone ?? Intl.DateTimeFormat().resolvedOptions().timeZone;

  if (view === "empty") {
    return (
      <div className="bg-white border border-neutral-200 shadow-sm">
        <div className="px-4 py-3 border-b border-neutral-100">
          <p className="font-mono text-[10px] uppercase tracking-widest text-[#00a6f3]">
            Availability
          </p>
        </div>
        <div className="flex flex-col items-center justify-center gap-3 p-6 text-center">
          <div className="w-10 h-10 rounded-full border-2 border-dashed border-neutral-200 flex items-center justify-center">
            <svg className="w-5 h-5 text-neutral-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          </div>
          <div>
            <p className="font-mono text-[11px] text-neutral-600 uppercase tracking-wide">
              Set your availability
            </p>
            <p className="font-mono text-[10px] text-neutral-400 mt-0.5 leading-relaxed">
              so others know when to connect
            </p>
          </div>
          <button
            onClick={() => setView("schedule")}
            className="bg-[#00a6f3] px-4 py-1.5 font-mono text-[10px] font-semibold uppercase tracking-widest text-white hover:bg-[#0090d4] transition-colors"
          >
            Set Schedule
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-neutral-200 shadow-sm overflow-hidden">
      <div
        className="flex transition-transform duration-300 ease-in-out"
        style={{
          width: "200%",
          transform: view === "music" ? "translateX(-50%)" : "translateX(0)",
        }}
      >
        {/* Schedule panel */}
        <div className="flex flex-col" style={{ width: "50%" }}>
          <div className="px-4 py-3 border-b border-neutral-100 flex items-center justify-between">
            <p className="font-mono text-[10px] uppercase tracking-widest text-[#00a6f3]">
              Availability
            </p>
            <button
              onClick={() => setView("music")}
              className="text-neutral-400 hover:text-[#00a6f3] transition-colors"
              aria-label="Now playing"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
          <div className="p-4">
            <p className="font-mono text-[9px] text-neutral-300 mb-2 truncate">{tz}</p>
            <div className="space-y-1">
              <div className="grid grid-cols-8 gap-1 mb-1">
                <div />
                {DAYS.map((d, i) => (
                  <div key={i} className="text-center font-mono text-[10px] text-neutral-400">
                    {d}
                  </div>
                ))}
              </div>
              {PERIODS.map((period, pi) => (
                <div key={period} className="grid grid-cols-8 gap-1">
                  <div className="text-right pr-1 font-mono text-[10px] leading-5 text-neutral-400">
                    {period}
                  </div>
                  {DAYS.map((_, di) => (
                    <button
                      key={di}
                      onClick={() => toggleCell(di, pi)}
                      className={`h-5 rounded-sm transition-colors ${
                        isSelected(di, pi) ? "bg-[#00a6f3]" : "bg-neutral-100 hover:bg-neutral-200"
                      }`}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Music panel */}
        <div className="flex flex-col" style={{ width: "50%" }}>
          <div className="px-4 py-3 border-b border-neutral-100 flex items-center gap-2">
            <button
              onClick={() => setView("schedule")}
              className="text-neutral-400 hover:text-[#00a6f3] transition-colors"
              aria-label="Back to schedule"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <p className="font-mono text-[10px] uppercase tracking-widest text-[#00a6f3]">
              Now Playing
            </p>
          </div>
          <div className="p-4">
            <div className="relative">
              <input
                type="text"
                className="w-full font-mono text-xs text-neutral-900 border border-neutral-200 px-2.5 py-1.5 pr-7 focus:outline-none focus:border-[#00a6f3] bg-white"
                maxLength={100}
                placeholder="Tame Impala – Let It Happen"
                value={nowPlayingDraft}
                onChange={(e) => setNowPlayingDraft(e.target.value)}
                onBlur={() => void updateNowPlaying({ nowPlaying: nowPlayingDraft.trim() || undefined })}
              />
              {nowPlayingDraft && (
                <button
                  onClick={() => {
                    setNowPlayingDraft("");
                    void updateNowPlaying({ nowPlaying: undefined });
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors"
                  aria-label="Clear now playing"
                >
                  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Logo Sun Header ──────────────────────────────────────────────────────────

function LogoSun() {
  return (
    <div className="flex items-center justify-center" style={{ width: 100, height: 100 }}>
      <style>{`
        @keyframes sun-pulse {
          0%   { transform: scale(1); }
          50%  { transform: scale(1.18); }
          100% { transform: scale(1); }
        }
      `}</style>
      {/* Entire disc + fade + icon pulses as one unit */}
      <div
        className="flex items-center justify-center rounded-full"
        style={{
          width: 90,
          height: 90,
          background: "radial-gradient(circle, #00a6f3 40%, rgba(0,166,243,0.3) 62%, white 78%)",
          animation: "sun-pulse 2s ease-in-out infinite",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/icon.svg" alt="" style={{ width: 22, height: 22, objectFit: "contain" }} />
      </div>
    </div>
  );
}

// ─── Passport Stamps Panel ────────────────────────────────────────────────────

function PassportStampsPanel() {
  return (
    <div className="bg-white border border-neutral-200 shadow-sm flex flex-col items-center justify-center h-full min-h-[180px] gap-3">
      <LogoSun />
      <p className="font-serif text-base text-[#00a6f3] leading-snug">No Stamps Yet</p>
    </div>
  );
}

// ─── Projects Panel ───────────────────────────────────────────────────────────

function ProjectsPanel() {
  return (
    <div className="bg-white border border-neutral-200 shadow-sm flex-1 flex flex-col items-center justify-center gap-3">
      <LogoSun />
      <p className="font-serif text-base text-[#00a6f3] leading-snug">No Projects Yet</p>
    </div>
  );
}

// ─── Main Export ──────────────────────────────────────────────────────────────

export function ProfileTab() {
  const user = useQuery(api.users.getCurrentUser, {});

  if (user === undefined) {
    return <p className="font-mono text-sm text-neutral-400">Loading…</p>;
  }

  if (user === null) {
    return <p className="font-mono text-sm text-neutral-500">Profile not found.</p>;
  }

  return (
    <div
      className="grid gap-3"
      style={{
        gridTemplateColumns: "260px minmax(0,1fr) 240px",
        gridTemplateRows: "auto 1fr",
        minHeight: 580,
      }}
    >
      <div style={{ gridColumn: 1, gridRow: 1 }}>
        <ProfileCardPanel user={user} />
      </div>
      <div
        style={{ gridColumn: 2, gridRow: "1 / 3", display: "flex", flexDirection: "column" }}
      >
        <CoreProfilePanel user={user} />
      </div>
      <div style={{ gridColumn: 3, gridRow: "1 / 3", display: "flex", flexDirection: "column", gap: 12 }}>
        <StatusPanel user={user} />
        <ProjectsPanel />
      </div>
      <div style={{ gridColumn: 1, gridRow: 2, display: "flex", flexDirection: "column" }}>
        <PassportStampsPanel />
      </div>
    </div>
  );
}
