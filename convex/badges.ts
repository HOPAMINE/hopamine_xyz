import { v } from "convex/values";
import { internalMutation, mutation, query, type MutationCtx, type QueryCtx } from "./_generated/server";
import { Doc } from "./_generated/dataModel";
import { projectFieldValidator, type ProjectField } from "./lib/projectFields";
import {
  backfillGreenHackathonBadge,
  buildGreenHackathonBadgeFromParticipation,
  syncGreenHackathonBadgeForUser,
} from "./lib/badgeRecords";

const greenHackathonBadgeValidator = v.object({
  kind: v.literal("green-hackathon-builder"),
  id: v.string(),
  name: v.string(),
  builderNumber: v.number(),
  username: v.optional(v.string()),
  projectTitle: v.optional(v.string()),
  projectBlurb: v.optional(v.string()),
  projectField: v.optional(projectFieldValidator),
  projectIndex: v.optional(v.number()),
  hackathonId: v.optional(v.string()),
});

const badgeValidator = v.union(greenHackathonBadgeValidator);

type Badge = {
  kind: "green-hackathon-builder";
  id: string;
  name: string;
  builderNumber: number;
  username?: string;
  projectTitle?: string;
  projectBlurb?: string;
  projectField?: ProjectField;
  projectIndex?: number;
  hackathonId?: string;
};

async function badgeDocToApi(
  ctx: QueryCtx,
  badge: Doc<"badges">,
  user: Doc<"users">,
): Promise<Badge | null> {
  if (badge.kind !== "green-hackathon-builder") {
    return null;
  }

  const participation = badge.hackathonParticipationId
    ? await ctx.db.get("hackathonParticipations", badge.hackathonParticipationId)
    : null;
  const claim = badge.hackathonClaimId
    ? await ctx.db.get("hackathonClaims", badge.hackathonClaimId)
    : null;
  const project = badge.projectId ? await ctx.db.get("projects", badge.projectId) : null;

  return {
    kind: "green-hackathon-builder",
    id: badge._id,
    name: user.name,
    builderNumber: participation?.builderNumber ?? 0,
    username: user.username,
    projectTitle: claim?.projectTitle ?? project?.title,
    projectBlurb: claim?.blurb ?? project?.blurb,
    projectField: claim?.field ?? project?.field,
    projectIndex: claim?.projectIndex ?? project?.hackathonIndex,
    hackathonId: badge.hackathonId,
  };
}

async function listBadgesForUser(ctx: QueryCtx, user: Doc<"users">): Promise<Badge[]> {
  const badgeDocs = await ctx.db
    .query("badges")
    .withIndex("by_user", (q) => q.eq("userId", user._id))
    .collect();

  const badges: Badge[] = [];
  for (const badgeDoc of badgeDocs) {
    const badge = await badgeDocToApi(ctx, badgeDoc, user);
    if (badge) {
      badges.push(badge);
    }
  }

  const hasGreenHackathonBadge = badges.some((badge) => badge.kind === "green-hackathon-builder");
  if (!hasGreenHackathonBadge) {
    const fallback = await buildGreenHackathonBadgeFromParticipation(ctx, user);
    if (fallback) {
      badges.push(fallback);
    }
  }

  return badges;
}

async function getAuthenticatedUser(ctx: MutationCtx | QueryCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new Error("Not authenticated");
  }

  const user = await ctx.db
    .query("users")
    .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
    .unique();

  if (!user) {
    throw new Error("User not found");
  }

  return user;
}

export const listMine = query({
  args: {},
  returns: v.array(badgeValidator),
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!user) {
      return [];
    }

    return await listBadgesForUser(ctx, user);
  },
});

export const listForUser = query({
  args: { userId: v.id("users") },
  returns: v.array(badgeValidator),
  handler: async (ctx, args) => {
    const user = await ctx.db.get("users", args.userId);
    if (!user) {
      return [];
    }

    return await listBadgesForUser(ctx, user);
  },
});

/** Syncs the signed-in user's hackathon badge row from their participation claim. */
export const ensureMine = mutation({
  args: {},
  returns: v.union(
    v.literal("created"),
    v.literal("updated"),
    v.literal("skipped"),
    v.literal("none"),
  ),
  handler: async (ctx) => {
    const user = await getAuthenticatedUser(ctx);
    return await syncGreenHackathonBadgeForUser(ctx, user._id);
  },
});

/** One-time backfill for participations claimed before the badges table existed. */
export const backfillFromHackathonParticipations = internalMutation({
  args: {},
  returns: v.object({
    created: v.number(),
    updated: v.number(),
    skipped: v.number(),
  }),
  handler: async (ctx) => {
    const participations = await ctx.db.query("hackathonParticipations").collect();
    let created = 0;
    let updated = 0;
    let skipped = 0;

    for (const participation of participations) {
      const result = await backfillGreenHackathonBadge(ctx, participation);
      if (result === "created") created++;
      else if (result === "updated") updated++;
      else skipped++;
    }

    return { created, updated, skipped };
  },
});
