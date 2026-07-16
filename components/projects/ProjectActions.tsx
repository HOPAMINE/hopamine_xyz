"use client";

import { useEffect, useRef, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { robotoMono } from "../../fonts";

type ProjectActionsProps = {
  projectId: Id<"projects">;
  projectTitle: string;
  viewerRole: "owner" | "member" | null;
  hasPendingJoinRequest?: boolean;
  variant?: "dashboard" | "events" | "portal";
  /** Grey vertical dots above the card (dashboard project row). */
  trigger?: "default" | "minimal";
  /** White panel dropdown like navbar notifications. */
  menuVariant?: "themed" | "panel";
  /** Show "Hide project" to remove from dashboard without leaving. */
  allowHideFromDashboard?: boolean;
  onEdit?: () => void;
};

function DotsIcon({ className, vertical = false }: { className?: string; vertical?: boolean }) {
  if (vertical) {
    return (
      <svg
        className={className}
        width={16}
        height={16}
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden
      >
        <circle cx="12" cy="5" r="2" />
        <circle cx="12" cy="12" r="2" />
        <circle cx="12" cy="19" r="2" />
      </svg>
    );
  }

  return (
    <svg
      className={className}
      width={16}
      height={16}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <circle cx="5" cy="12" r="2" />
      <circle cx="12" cy="12" r="2" />
      <circle cx="19" cy="12" r="2" />
    </svg>
  );
}

const actionBase = `${robotoMono.className} inline-flex items-center justify-center rounded-full border p-2 transition-colors disabled:cursor-not-allowed disabled:opacity-40`;

function DeleteProjectModal({
  projectTitle,
  confirmDraft,
  acting,
  error,
  onConfirmDraftChange,
  onClose,
  onConfirm,
}: {
  projectTitle: string;
  confirmDraft: string;
  acting: boolean;
  error: string;
  onConfirmDraftChange: (value: string) => void;
  onClose: () => void;
  onConfirm: () => void;
}) {
  const canDelete = confirmDraft === projectTitle;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="w-full max-w-md rounded-[24px] bg-white p-6 shadow-xl"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-project-title"
      >
        <h3
          id="delete-project-title"
          className={`${robotoMono.className} text-sm font-semibold uppercase tracking-wide text-neutral-900`}
        >
          Delete project
        </h3>
        <p className={`${robotoMono.className} mt-3 text-sm leading-relaxed text-neutral-600`}>
          Are you sure you want to delete{" "}
          <span className="font-semibold text-neutral-900">{projectTitle}</span>? This cannot be
          undone.
        </p>
        <p className={`${robotoMono.className} mt-4 text-[11px] font-semibold uppercase tracking-wide text-neutral-500`}>
          Type the project name to confirm
        </p>
        <input
          type="text"
          value={confirmDraft}
          onChange={(event) => onConfirmDraftChange(event.target.value)}
          placeholder={projectTitle}
          autoFocus
          className={`${robotoMono.className} mt-2 w-full rounded-xl border border-neutral-200 px-3 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-300 focus:border-accent-events focus:outline-none focus:ring-2 focus:ring-accent-events/20`}
        />
        {error ? (
          <p className={`${robotoMono.className} mt-3 text-[11px] text-red-500`} role="alert">
            {error}
          </p>
        ) : null}
        <div className="mt-5 flex flex-wrap justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            disabled={acting}
            className={`${robotoMono.className} inline-flex items-center rounded-full border border-neutral-200 px-4 py-2 text-[11px] font-semibold uppercase tracking-wide text-neutral-700 transition-colors hover:bg-neutral-50 disabled:opacity-40`}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={!canDelete || acting}
            className={`${robotoMono.className} inline-flex items-center rounded-full border border-red-600 bg-red-600 px-4 py-2 text-[11px] font-semibold uppercase tracking-wide text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-40`}
          >
            {acting ? "Deleting…" : "Delete project"}
          </button>
        </div>
      </div>
    </div>
  );
}

export function ProjectActions({
  projectId,
  projectTitle,
  viewerRole,
  hasPendingJoinRequest = false,
  variant = "dashboard",
  trigger = "default",
  menuVariant = "themed",
  allowHideFromDashboard = false,
  onEdit,
}: ProjectActionsProps) {
  const leaveProject = useMutation(api.projects.leave);
  const removeProject = useMutation(api.projects.remove);
  const requestJoin = useMutation(api.projects.requestJoin);
  const hideFromDashboard = useMutation(api.projects.hideFromDashboard);

  const [menuOpen, setMenuOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteConfirmDraft, setDeleteConfirmDraft] = useState("");
  const [acting, setActing] = useState(false);
  const [error, setError] = useState("");
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [menuCoords, setMenuCoords] = useState<{ top: number; right: number } | null>(null);

  const isDashboard = variant === "dashboard";
  const isPortal = variant === "portal";
  const isOwner = viewerRole === "owner";
  const isMember = viewerRole === "member";
  const isOnProject = isOwner || isMember;
  const showRequest = viewerRole === null;

  const isMinimalTrigger = trigger === "minimal";
  const isPanelMenu = menuVariant === "panel";

  const triggerClass = isMinimalTrigger
    ? "inline-flex touch-manipulation items-center justify-center p-1 text-neutral-400 transition-colors hover:text-neutral-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-400"
    : isDashboard
      ? `${actionBase} border-accent-navbar/35 bg-white text-accent-navbar hover:bg-accent-navbar hover:text-white`
      : isPortal
        ? `${actionBase} border-white/35 bg-accent-navbar text-white hover:bg-white hover:text-accent-navbar`
        : `${actionBase} border-white/35 bg-accent-events text-white hover:bg-white hover:text-accent-events`;

  const menuClass = isPanelMenu
    ? "z-60 w-[min(14rem,calc(100vw-2.5rem))] overflow-hidden rounded-2xl border border-white/20 bg-white text-neutral-900 shadow-xl"
    : isDashboard
      ? "absolute right-0 top-[calc(100%+0.5rem)] z-20 min-w-[12rem] overflow-hidden rounded-2xl border border-accent-navbar/20 bg-white py-1 shadow-lg"
      : isPortal
        ? "absolute right-0 top-[calc(100%+0.5rem)] z-20 min-w-[12rem] overflow-hidden rounded-2xl border border-white/20 bg-accent-navbar py-1 shadow-lg"
        : "absolute right-0 top-[calc(100%+0.5rem)] z-20 min-w-[12rem] overflow-hidden rounded-2xl border border-white/20 bg-accent-events py-1 shadow-lg";

  const menuItemClass = isPanelMenu
    ? `${robotoMono.className} flex w-full items-center px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide text-neutral-700 transition-colors hover:bg-neutral-50 disabled:opacity-40`
    : isDashboard
      ? `${robotoMono.className} flex w-full items-center px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide text-accent-navbar transition-colors hover:bg-accent-navbar/10 disabled:opacity-40`
      : `${robotoMono.className} flex w-full items-center px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide text-white transition-colors hover:bg-white/10 disabled:opacity-40`;

  const dangerMenuItemClass = isPanelMenu
    ? `${robotoMono.className} flex w-full items-center px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide text-red-600 transition-colors hover:bg-red-50 disabled:opacity-40`
    : isDashboard
      ? `${robotoMono.className} flex w-full items-center px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide text-red-600 transition-colors hover:bg-red-50 disabled:opacity-40`
      : `${robotoMono.className} flex w-full items-center px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide text-red-200 transition-colors hover:bg-white/10 disabled:opacity-40`;

  useEffect(() => {
    if (!menuOpen) return;

    function handlePointerDown(event: MouseEvent) {
      if (!menuRef.current?.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen || !isPanelMenu) {
      setMenuCoords(null);
      return;
    }

    function updateMenuCoords() {
      const rect = triggerRef.current?.getBoundingClientRect();
      if (!rect) return;
      setMenuCoords({
        top: rect.bottom + 8,
        right: window.innerWidth - rect.right,
      });
    }

    updateMenuCoords();
    window.addEventListener("resize", updateMenuCoords);
    window.addEventListener("scroll", updateMenuCoords, true);
    return () => {
      window.removeEventListener("resize", updateMenuCoords);
      window.removeEventListener("scroll", updateMenuCoords, true);
    };
  }, [menuOpen, isPanelMenu]);

  function closeDeleteModal() {
    if (acting) return;
    setDeleteModalOpen(false);
    setDeleteConfirmDraft("");
    setError("");
  }

  function openDeleteModal() {
    setMenuOpen(false);
    setDeleteConfirmDraft("");
    setError("");
    setDeleteModalOpen(true);
  }

  async function handleLeave() {
    if (acting) return;
    if (!window.confirm("Leave this project? You can rejoin if invited again.")) return;

    setActing(true);
    setError("");
    try {
      await leaveProject({ projectId });
      setMenuOpen(false);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to leave project.");
    } finally {
      setActing(false);
    }
  }

  async function handleDelete() {
    if (acting || deleteConfirmDraft !== projectTitle) return;

    setActing(true);
    setError("");
    try {
      await removeProject({ projectId, confirmTitle: deleteConfirmDraft });
      closeDeleteModal();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to delete project.");
    } finally {
      setActing(false);
    }
  }

  async function handleRequestJoin() {
    if (acting || hasPendingJoinRequest) return;

    setActing(true);
    setError("");
    try {
      await requestJoin({ projectId });
      setMenuOpen(false);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to request to join.");
    } finally {
      setActing(false);
    }
  }

  async function handleHideFromDashboard() {
    if (acting) return;
    if (!window.confirm("Hide this project from your dashboard? You can show it again by re-entering the project code.")) {
      return;
    }

    setActing(true);
    setError("");
    try {
      await hideFromDashboard({ projectId });
      setMenuOpen(false);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to hide project.");
    } finally {
      setActing(false);
    }
  }

  if (!isOnProject && !showRequest) {
    return null;
  }

  const requestButtonClass = isDashboard
    ? `${robotoMono.className} inline-flex items-center justify-center rounded-full border border-accent-navbar/35 bg-white px-4 py-2 text-[11px] font-semibold uppercase tracking-wide text-accent-navbar transition-colors hover:bg-accent-navbar hover:text-white disabled:cursor-not-allowed disabled:opacity-40`
    : isPortal
      ? `${robotoMono.className} inline-flex items-center justify-center rounded-full border border-white/35 bg-accent-navbar px-4 py-2 text-[11px] font-semibold uppercase tracking-wide text-white transition-colors hover:bg-white hover:text-accent-navbar disabled:cursor-not-allowed disabled:opacity-40`
      : `${robotoMono.className} inline-flex items-center justify-center rounded-full border border-white/35 bg-accent-events px-4 py-2 text-[11px] font-semibold uppercase tracking-wide text-white transition-colors hover:bg-white hover:text-accent-events disabled:cursor-not-allowed disabled:opacity-40`;

  // Joinable projects: direct CTA instead of a overflow menu.
  if (showRequest) {
    return (
      <div className="flex flex-col gap-1">
        <button
          type="button"
          disabled={acting || hasPendingJoinRequest}
          onClick={() => void handleRequestJoin()}
          className={requestButtonClass}
        >
          {acting
            ? "Requesting…"
            : hasPendingJoinRequest
              ? "Request pending"
              : "Request to join"}
        </button>
        {error ? (
          <p className={`${robotoMono.className} text-[10px] text-red-500`} role="alert">
            {error}
          </p>
        ) : null}
      </div>
    );
  }

  return (
    <>
      <div className={`relative ${isMinimalTrigger ? "" : "flex flex-col gap-1"}`} ref={menuRef}>
        <button
          ref={triggerRef}
          type="button"
          aria-expanded={menuOpen}
          aria-haspopup="menu"
          aria-label="Project options"
          onClick={() => {
            setMenuOpen((open) => {
              const nextOpen = !open;
              if (nextOpen && isPanelMenu) {
                const rect = triggerRef.current?.getBoundingClientRect();
                if (rect) {
                  setMenuCoords({
                    top: rect.bottom + 8,
                    right: window.innerWidth - rect.right,
                  });
                }
              }
              return nextOpen;
            });
          }}
          className={triggerClass}
        >
          <DotsIcon vertical={isMinimalTrigger} />
        </button>

        {menuOpen ? (
          <div
            role="menu"
            className={`${menuClass} ${isPanelMenu ? "fixed" : "absolute top-[calc(100%+0.5rem)] right-0"}`}
            style={
              isPanelMenu && menuCoords
                ? { top: menuCoords.top, right: menuCoords.right }
                : undefined
            }
          >
            {isPanelMenu ? (
              <div className="border-b border-neutral-100 px-4 py-3">
                <p className={`${robotoMono.className} text-xs font-semibold uppercase tracking-wide text-neutral-500`}>
                  Project options
                </p>
              </div>
            ) : null}
            <div className={isPanelMenu ? "py-1" : ""}>
            {isOwner ? (
              <>
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setMenuOpen(false);
                    onEdit?.();
                  }}
                  className={menuItemClass}
                >
                  Edit project
                </button>
                <button
                  type="button"
                  role="menuitem"
                  onClick={openDeleteModal}
                  className={dangerMenuItemClass}
                >
                  Delete project
                </button>
              </>
            ) : null}
            {isOnProject && allowHideFromDashboard ? (
              <button
                type="button"
                role="menuitem"
                disabled={acting}
                onClick={() => void handleHideFromDashboard()}
                className={menuItemClass}
              >
                Hide project
              </button>
            ) : null}
            {isOnProject ? (
              <button
                type="button"
                role="menuitem"
                disabled={acting}
                onClick={() => void handleLeave()}
                className={dangerMenuItemClass}
              >
                Leave project
              </button>
            ) : null}
            </div>
          </div>
        ) : null}

        {error && !deleteModalOpen && !isMinimalTrigger ? (
          <p className={`${robotoMono.className} text-[10px] text-red-500`} role="alert">
            {error}
          </p>
        ) : null}
      </div>

      {deleteModalOpen ? (
        <DeleteProjectModal
          projectTitle={projectTitle}
          confirmDraft={deleteConfirmDraft}
          acting={acting}
          error={error}
          onConfirmDraftChange={setDeleteConfirmDraft}
          onClose={closeDeleteModal}
          onConfirm={() => void handleDelete()}
        />
      ) : null}
    </>
  );
}

type ClaimedHackathonProjectActionsProps = {
  onEdit: () => void;
  trigger?: "default" | "minimal";
  menuVariant?: "themed" | "panel";
  allowHideFromDashboard?: boolean;
};

/** Three-dot menu for hackathon badge projects (not stored in `projects` table). */
export function ClaimedHackathonProjectActions({
  onEdit,
  trigger = "minimal",
  menuVariant = "panel",
  allowHideFromDashboard = false,
}: ClaimedHackathonProjectActionsProps) {
  const unclaimProject = useMutation(api.hackathonClaims.unclaimProject);
  const hideClaimedHackathonProject = useMutation(
    api.users.hideClaimedHackathonProjectFromDashboard,
  );

  const [menuOpen, setMenuOpen] = useState(false);
  const [acting, setActing] = useState(false);
  const [error, setError] = useState("");
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [menuCoords, setMenuCoords] = useState<{ top: number; right: number } | null>(null);

  const isMinimalTrigger = trigger === "minimal";
  const isPanelMenu = menuVariant === "panel";

  const triggerClass = isMinimalTrigger
    ? "inline-flex touch-manipulation items-center justify-center p-1 text-neutral-400 transition-colors hover:text-neutral-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-400"
    : `${actionBase} border-accent-navbar/35 bg-white text-accent-navbar hover:bg-accent-navbar hover:text-white`;

  const menuClass =
    "z-60 w-[min(14rem,calc(100vw-2.5rem))] overflow-hidden rounded-2xl border border-white/20 bg-white text-neutral-900 shadow-xl";

  const menuItemClass = `${robotoMono.className} flex w-full items-center px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide text-neutral-700 transition-colors hover:bg-neutral-50`;
  const dangerMenuItemClass = `${robotoMono.className} flex w-full items-center px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide text-red-600 transition-colors hover:bg-red-50 disabled:opacity-40`;

  useEffect(() => {
    if (!menuOpen) return;

    function handlePointerDown(event: MouseEvent) {
      if (!menuRef.current?.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen || !isPanelMenu) {
      setMenuCoords(null);
      return;
    }

    function updateMenuCoords() {
      const rect = triggerRef.current?.getBoundingClientRect();
      if (!rect) return;
      setMenuCoords({
        top: rect.bottom + 8,
        right: window.innerWidth - rect.right,
      });
    }

    updateMenuCoords();
    window.addEventListener("resize", updateMenuCoords);
    window.addEventListener("scroll", updateMenuCoords, true);
    return () => {
      window.removeEventListener("resize", updateMenuCoords);
      window.removeEventListener("scroll", updateMenuCoords, true);
    };
  }, [menuOpen, isPanelMenu]);

  async function handleLeave() {
    if (acting) return;
    if (
      !window.confirm(
        "Remove this project from your profile? You can claim it again later.",
      )
    ) {
      return;
    }

    setActing(true);
    setError("");
    try {
      await unclaimProject({});
      setMenuOpen(false);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to remove project.");
    } finally {
      setActing(false);
    }
  }

  async function handleHideFromDashboard() {
    if (acting) return;
    if (
      !window.confirm(
        "Hide this project from your dashboard? Visit /claim/project to show it again.",
      )
    ) {
      return;
    }

    setActing(true);
    setError("");
    try {
      await hideClaimedHackathonProject({});
      setMenuOpen(false);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to hide project.");
    } finally {
      setActing(false);
    }
  }

  return (
    <div className={`relative ${isMinimalTrigger ? "" : "flex flex-col gap-1"}`} ref={menuRef}>
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={menuOpen}
        aria-haspopup="menu"
        aria-label="Project options"
        onClick={() => {
          setMenuOpen((open) => {
            const nextOpen = !open;
            if (nextOpen && isPanelMenu) {
              const rect = triggerRef.current?.getBoundingClientRect();
              if (rect) {
                setMenuCoords({
                  top: rect.bottom + 8,
                  right: window.innerWidth - rect.right,
                });
              }
            }
            return nextOpen;
          });
        }}
        className={triggerClass}
      >
        <DotsIcon vertical={isMinimalTrigger} />
      </button>

      {menuOpen ? (
        <div
          role="menu"
          className={`${menuClass} fixed`}
          style={
            menuCoords ? { top: menuCoords.top, right: menuCoords.right } : undefined
          }
        >
          <div className="border-b border-neutral-100 px-4 py-3">
            <p
              className={`${robotoMono.className} text-xs font-semibold uppercase tracking-wide text-neutral-500`}
            >
              Project options
            </p>
          </div>
          <div className="py-1">
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                setMenuOpen(false);
                onEdit();
              }}
              className={menuItemClass}
            >
              Edit project
            </button>
            {allowHideFromDashboard ? (
              <button
                type="button"
                role="menuitem"
                disabled={acting}
                onClick={() => void handleHideFromDashboard()}
                className={menuItemClass}
              >
                Hide project
              </button>
            ) : null}
            <button
              type="button"
              role="menuitem"
              disabled={acting}
              onClick={() => void handleLeave()}
              className={dangerMenuItemClass}
            >
              Leave project
            </button>
          </div>
        </div>
      ) : null}

      {error ? (
        <p className={`${robotoMono.className} mt-1 text-[10px] text-red-500`} role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
