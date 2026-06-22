import { MutationCtx } from "../_generated/server";
import { Id } from "../_generated/dataModel";
import { HACKATHON_PROJECTS } from "../../shared/hackathonProjects";
import { normalizeOptionalProjectUrl } from "./projectUrls";

export const HACKATHON_DIRECTORY_SYSTEM_CLERK_ID = "system|hackathon-directory";
export const HACKATHON_DIRECTORY_SYSTEM_EMAIL = "hackathon-directory@hopamine.internal";

export function isHackathonDirectoryProject(project: { hackathonIndex?: number }): boolean {
  return project.hackathonIndex !== undefined;
}

function normalizeSeedUrl(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  if (!trimmed) {
    return undefined;
  }

  try {
    return normalizeOptionalProjectUrl(trimmed);
  } catch {
    const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
    return withProtocol;
  }
}

export async function getOrCreateHackathonDirectorySystemUser(
  ctx: MutationCtx,
): Promise<Id<"users">> {
  const existing = await ctx.db
    .query("users")
    .withIndex("by_clerk_id", (q) => q.eq("clerkId", HACKATHON_DIRECTORY_SYSTEM_CLERK_ID))
    .unique();

  if (existing) {
    return existing._id;
  }

  const now = Date.now();
  return await ctx.db.insert("users", {
    clerkId: HACKATHON_DIRECTORY_SYSTEM_CLERK_ID,
    email: HACKATHON_DIRECTORY_SYSTEM_EMAIL,
    name: "Green Hackathon Directory",
    avatarUrl: "",
    createdAt: now,
    updatedAt: now,
  });
}

export async function seedHackathonDirectoryProjects(ctx: MutationCtx): Promise<{
  inserted: number;
  updated: number;
  total: number;
}> {
  const systemUserId = await getOrCreateHackathonDirectorySystemUser(ctx);
  const now = Date.now();
  let inserted = 0;
  let updated = 0;

  for (let index = 0; index < HACKATHON_PROJECTS.length; index++) {
    const project = HACKATHON_PROJECTS[index]!;
    const existing = await ctx.db
      .query("projects")
      .withIndex("by_hackathon_index", (q) => q.eq("hackathonIndex", index))
      .unique();

    const payload = {
      userId: systemUserId,
      field: project.field,
      title: project.title.trim(),
      blurb: project.blurb.trim(),
      builderName: project.builder.trim(),
      builderDiscord: project.discord?.trim() || undefined,
      liveUrl: normalizeSeedUrl(project.liveUrl),
      demoUrl: normalizeSeedUrl(project.demoUrl),
      repoUrl: normalizeSeedUrl(project.repoUrl),
      hackathonIndex: index,
      updatedAt: now,
    };

    if (existing) {
      await ctx.db.patch(existing._id, payload);
      updated++;
      continue;
    }

    await ctx.db.insert("projects", {
      ...payload,
      createdAt: now,
    });
    inserted++;
  }

  return {
    inserted,
    updated,
    total: HACKATHON_PROJECTS.length,
  };
}
