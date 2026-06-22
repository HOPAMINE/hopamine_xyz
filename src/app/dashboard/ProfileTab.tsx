"use client";

import { useEffect, useRef, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { HACKATHON_FIELDS } from "@/lib/hackathonDirectory";
import { formatProjectTitle } from "@/lib/formatProjectTitle";
import { getPublicProfileUrl } from "@/lib/profileUrls";
import { ClaimParticipationCard } from "../../../components/claim/ClaimParticipationCard";
import {
  PARTICIPATION_CARD_TOTAL_HEIGHT,
  PARTICIPATION_CARD_WIDTH,
} from "../../../components/claim/participationCardStyles";
import { sortsMillGoudy } from "../../../fonts";

// ─── Constants ────────────────────────────────────────────────────────────────

const AV_SIZE = 63;
const ACCENT = "#00a6f3";
// Placeholder data — swap for real content once the backend is wired up.
const TEMP_INTERESTS = ["TEMP", "TEMP", "TEMP", "TEMP"];

// The blue page gradient that the panels float on top of.
const PAGE_GRADIENT =
  "linear-gradient(to bottom right,#00a6f3 0%,#00a6f3 35%,#cdeefc 62%,#f5fafc 82%,#fefefe 100%)";

type ConvexUser = NonNullable<ReturnType<typeof useQuery<typeof api.users.getCurrentUser>>>;
type MyProject = NonNullable<ReturnType<typeof useQuery<typeof api.projects.listMine>>>[number];
type MyBadge = NonNullable<ReturnType<typeof useQuery<typeof api.badges.listMine>>>[number];

// ─── Small utilities ──────────────────────────────────────────────────────────

function formatMemberNames(members: MyProject["members"], fallbackName: string): string {
  if (members.length === 0) return fallbackName;
  return members.map((member) => member.name).join(", ");
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

// ─── Hover-float animations (preserved from the original profile) ──────────────

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
      ref.current.style.color = ACCENT;
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

// ─── Inline editing (preserved from the original profile) ──────────────────────

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
    if (draft === value) {
      setEditing(false);
      return;
    }
    try {
      await onSave(draft);
    } finally {
      setEditing(false);
    }
  }

  if (editing) {
    const cls =
      "w-full font-mono text-sm text-neutral-800 border border-[#00a6f3]/40 p-2 focus:outline-none focus:border-[#00a6f3] bg-white leading-relaxed resize-none overflow-hidden";
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
        onChange={(e) => {
          setDraft(e.target.value);
          autoSize(e.target);
        }}
        onBlur={handleBlur}
      />
    ) : (
      <input
        autoFocus
        type="text"
        className={`${cls} py-1.5`}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={handleBlur}
      />
    );
  }

  return (
    <div className="cursor-text" onClick={() => { setDraft(value); setEditing(true); }}>
      {displayContent ?? (value ? (
        <p className="font-mono text-[15px] text-neutral-700 leading-relaxed">{value}</p>
      ) : (
        <p className="font-mono text-[15px] text-neutral-300 italic leading-relaxed">{placeholder}</p>
      ))}
    </div>
  );
}

// ─── Skill / interest chips (little blue boxes) ────────────────────────────────

function BlueBoxes({ items }: { items: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item, i) => (
        <span
          key={`${item}-${i}`}
          className="font-mono text-[13px] uppercase tracking-wide text-white bg-[#00a6f3] px-3 py-1.5 rounded-[8px]"
        >
          {item}
        </span>
      ))}
    </div>
  );
}

// ─── Left panel: profile info ──────────────────────────────────────────────────

function LeftProfilePanel({ user }: { user: ConvexUser }) {
  const updateProfile = useMutation(api.users.updateProfile);
  const initials = getInitials(user.name);

  return (
    <aside className="bg-white rounded-[40px] px-[18px] py-[24px] shadow-[0_4px_20px_rgba(0,0,0,0.08)] w-[387px] shrink-0 flex flex-col gap-7 overflow-hidden">
      {/* Identity row: avatar + name + location */}
      <div className="flex items-end gap-[15px]">
        <div className="relative shrink-0" style={{ width: AV_SIZE, height: AV_SIZE }}>
          <div className="w-full h-full rounded-full overflow-hidden bg-[#0090d4] border-2 border-white flex items-center justify-center">
            {user.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={user.avatarUrl} alt="" className="w-full h-full object-cover" />
            ) : (
              <span className="font-serif text-xl font-semibold text-white">{initials}</span>
            )}
          </div>
          {/* Presence dot — online/offline indicator */}
          <span
            className="absolute rounded-full bg-[#00a6f3] border-2 border-white"
            style={{ width: 14, height: 14, right: 1, bottom: 3 }}
            aria-label="Online"
          />
        </div>
        <div className="min-w-0">
          <h1 className="font-serif text-[36px] leading-[1.05] tracking-[-0.01em] text-neutral-900">
            <FloatingName name={user.name} />
          </h1>
          {user.location && (
            <p className="font-mono font-light text-[16px] uppercase tracking-wide text-neutral-500 truncate">
              {user.location}
            </p>
          )}
        </div>
      </div>

      {/* Why I Work */}
      <section>
        <h2 className="font-serif text-[28px] font-medium mb-2">
          <FloatingHeader>Why I Work</FloatingHeader>
        </h2>
        <InlineEdit
          value={user.why ?? ""}
          onSave={(v) => updateProfile({ why: v || undefined })}
          placeholder="What drives you…"
        />
      </section>

      {/* Vision */}
      <section>
        <h2 className="font-serif text-[28px] font-medium mb-2">
          <FloatingHeader>Vision</FloatingHeader>
        </h2>
        <InlineEdit
          value={user.vision ?? ""}
          onSave={(v) => updateProfile({ vision: v || undefined })}
          placeholder="Your north star…"
        />
      </section>

      {/* Learning */}
      <section>
        <h2 className="font-serif text-[28px] font-medium mb-2">
          <FloatingHeader>Learning</FloatingHeader>
        </h2>
        <InlineEdit
          value={user.learning ?? ""}
          onSave={(v) => updateProfile({ learning: v || undefined })}
          placeholder="What you're exploring right now…"
        />
      </section>

      {/* Skills */}
      <section>
        <h2 className="font-serif text-[28px] font-medium mb-2">
          <FloatingHeader>Skills</FloatingHeader>
        </h2>
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
              <BlueBoxes items={user.skills} />
            ) : undefined
          }
        />
      </section>

      {/* Interests — placeholder TEMP data */}
      <section>
        <h2 className="font-serif text-[28px] font-medium mb-2">
          <FloatingHeader>Interests</FloatingHeader>
        </h2>
        <BlueBoxes items={TEMP_INTERESTS} />
      </section>

      {/* Intentional empty space below — reserved for future content */}
    </aside>
  );
}

// ─── Placeholder cards ─────────────────────────────────────────────────────────

function ProjectCard({ project, builderName }: { project: MyProject; builderName: string }) {
  return (
    <div className="bg-[#00a6f3] border border-white/20 rounded-[24px] p-[20px] w-[280px] h-[194px] shrink-0 flex flex-col justify-between overflow-hidden shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
      <div className="flex items-start justify-between gap-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/icon.svg" alt="" className="h-[34px] w-auto object-contain" />
        <p className="font-mono text-[11px] font-medium uppercase tracking-[0.3px] text-right text-white">
          {HACKATHON_FIELDS[project.field]}
        </p>
      </div>
      <div className="flex flex-col gap-1.5 pt-4">
        <p className="font-mono text-[11px] font-medium uppercase tracking-[0.3px] text-white/80 truncate">
          {formatMemberNames(project.members, builderName)}
        </p>
        <p className={`${sortsMillGoudy.className} text-[29px] normal-case leading-[1.02] tracking-[-0.06em] text-white line-clamp-1`}>
          {formatProjectTitle(project.title)}
        </p>
        <p className="font-mono text-[11px] font-medium uppercase tracking-[0.3px] leading-[1.4] text-white line-clamp-2">
          {project.blurb}
        </p>
      </div>
    </div>
  );
}

function ProjectsEmptyCard() {
  return (
    <div className="border border-dashed border-[#00a6f3]/40 rounded-[24px] p-[20px] w-[280px] h-[194px] shrink-0 flex items-center justify-center text-center">
      <p className="font-mono text-[12px] leading-[1.5] text-neutral-500">
        No projects yet. Create one from the Projects tab to see it here.
      </p>
    </div>
  );
}

// The real badge cards are designed at ~391px wide; in the grid we render them
// as smaller thumbnails by scaling the whole card down (preserves proportions).
const BADGE_SCALE = 0.5;
const BADGE_THUMB_WIDTH = PARTICIPATION_CARD_WIDTH * BADGE_SCALE;
const BADGE_THUMB_HEIGHT = PARTICIPATION_CARD_TOTAL_HEIGHT * BADGE_SCALE;

// Scales a full-size badge card down to a thumbnail. A CSS transform doesn't
// affect layout box size, so we measure the card's real (untransformed) height
// and size the clipping box from it — otherwise a too-short estimate crops the
// bottom of the card.
function ScaledBadgeThumb({ children }: { children: React.ReactNode }) {
  const innerRef = useRef<HTMLDivElement>(null);
  const [naturalHeight, setNaturalHeight] = useState(PARTICIPATION_CARD_TOTAL_HEIGHT);

  useEffect(() => {
    if (innerRef.current) {
      setNaturalHeight(innerRef.current.offsetHeight);
    }
  }, [children]);

  return (
    <div
      className="shrink-0 overflow-hidden"
      style={{ width: BADGE_THUMB_WIDTH, height: naturalHeight * BADGE_SCALE }}
    >
      <div
        ref={innerRef}
        style={{
          width: PARTICIPATION_CARD_WIDTH,
          transform: `scale(${BADGE_SCALE})`,
          transformOrigin: "top left",
        }}
      >
        {children}
      </div>
    </div>
  );
}

// Each badge type renders its own designed card, selected off `badge.kind`.
function BadgeCard({ badge, siteOrigin }: { badge: MyBadge; siteOrigin: string }) {
  switch (badge.kind) {
    case "green-hackathon-builder": {
      const profileUrl =
        siteOrigin && badge.username
          ? getPublicProfileUrl(siteOrigin, badge.username)
          : undefined;
      return (
        <ClaimParticipationCard
          name={badge.name}
          builderNumber={badge.builderNumber}
          userSeed={badge.username}
          projectTitle={badge.projectTitle}
          projectBlurb={badge.projectBlurb}
          profileUrl={profileUrl}
          claimed
          hideClaimedBadge
        />
      );
    }
    default:
      return null;
  }
}

// Shown when a user has no badges — same footprint as a badge thumbnail.
function BadgesEmptyCard() {
  return (
    <div
      className="bg-[#00a6f3] border border-white/20 rounded-[1rem] shrink-0 flex items-center justify-center text-center p-5"
      style={{ width: BADGE_THUMB_WIDTH, height: BADGE_THUMB_HEIGHT }}
    >
      <p className="font-mono text-[11px] leading-[1.6] uppercase tracking-[0.3px] text-white/80">
        No badges yet.
        <br />
        Claim your Green
        <br />
        Hackathon badge.
      </p>
    </div>
  );
}

// ─── Right panel: projects + badges ────────────────────────────────────────────

function RightPanel({ builderName }: { builderName: string }) {
  const projects = useQuery(api.projects.listMine);
  const badges = useQuery(api.badges.listMine);
  const [siteOrigin, setSiteOrigin] = useState("");

  useEffect(() => {
    setSiteOrigin(window.location.origin);
  }, []);

  return (
    <section className="bg-white rounded-[40px] px-0 py-[24px] shadow-[0_4px_20px_rgba(0,0,0,0.08)] flex-1 min-w-0 flex flex-col gap-7 overflow-y-auto">
      {/* Projects */}
      <div>
        <h2 className="font-serif text-[32px] leading-none text-neutral-900 pl-[40px]">
          <FloatingHeader>Projects</FloatingHeader>
        </h2>
        <div className="flex items-stretch gap-5 overflow-x-auto pt-5 pb-2 pl-[40px]">
          {projects === undefined ? (
            <p className="font-mono text-[12px] text-neutral-500 py-6">Loading projects…</p>
          ) : projects.length === 0 ? (
            <ProjectsEmptyCard />
          ) : (
            projects.map((project) => (
              <ProjectCard key={project._id} project={project} builderName={builderName} />
            ))
          )}
        </div>
      </div>

      {/* Badges */}
      <div>
        <h2 className="font-serif text-[32px] leading-none text-neutral-900 pl-[40px]">
          <FloatingHeader>Badges</FloatingHeader>
        </h2>
        <div className="flex items-stretch gap-5 overflow-x-auto pt-5 pb-2 pl-[40px]">
          {badges === undefined ? (
            <p className="font-mono text-[12px] text-neutral-500 py-6">Loading badges…</p>
          ) : badges.length === 0 ? (
            <BadgesEmptyCard />
          ) : (
            badges.map((badge) => (
              <ScaledBadgeThumb key={badge.id}>
                <BadgeCard badge={badge} siteOrigin={siteOrigin} />
              </ScaledBadgeThumb>
            ))
          )}
        </div>
      </div>
    </section>
  );
}

// ─── Main Export ──────────────────────────────────────────────────────────────

/**
 * The two-panel profile layout, without any page-level gradient/sizing chrome.
 * Embed this where a host already provides the blue background (e.g. /dashboard);
 * use {@link ProfileTab} when you need the standalone full-page version.
 */
export function ProfileTabContent({ user }: { user: ConvexUser }) {
  return (
    <div className="flex w-full items-stretch gap-2.5">
      <LeftProfilePanel user={user} />
      <RightPanel builderName={user.name} />
    </div>
  );
}

/** Standalone full-page profile (its own blue gradient). Used by /dashboard/original. */
export function ProfileTab() {
  const user = useQuery(api.users.getCurrentUser, {});

  return (
    <div className="min-h-dvh w-full p-4 md:p-6" style={{ background: PAGE_GRADIENT }}>
      {user === undefined ? (
        <p className="font-mono text-sm text-white/80">Loading…</p>
      ) : user === null ? (
        <p className="font-mono text-sm text-white/80">Profile not found.</p>
      ) : (
        <div className="mx-auto w-full max-w-[1600px]">
          <ProfileTabContent user={user} />
        </div>
      )}
    </div>
  );
}
