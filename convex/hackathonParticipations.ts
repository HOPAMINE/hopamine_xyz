import { v } from "convex/values";
import {
  internalMutation,
  mutation,
  query,
  type MutationCtx,
  type QueryCtx,
} from "./_generated/server";
import { createGreenHackathonBuilderBadge } from "./lib/badgeRecords";
import { allocateNextBuilderNumber } from "./lib/builderNumbers";

const participationValidator = v.object({
  _id: v.id("hackathonParticipations"),
  _creationTime: v.number(),
  userId: v.id("users"),
  builderNumber: v.number(),
  claimedAt: v.number(),
});

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

export const getMine = query({
  args: {},
  returns: v.union(participationValidator, v.null()),
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!user) {
      return null;
    }

    return await ctx.db
      .query("hackathonParticipations")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .unique();
  },
});

export const claim = mutation({
  args: {},
  returns: v.id("hackathonParticipations"),
  handler: async (ctx) => {
    const user = await getAuthenticatedUser(ctx);

    const existing = await ctx.db
      .query("hackathonParticipations")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .unique();

    if (existing) {
      throw new Error("You have already claimed your hackathon participation");
    }

    const builderNumber = await allocateNextBuilderNumber(ctx);
    const claimedAt = Date.now();

    const participationId = await ctx.db.insert("hackathonParticipations", {
      userId: user._id,
      builderNumber,
      claimedAt,
    });

    await createGreenHackathonBuilderBadge(ctx, {
      userId: user._id,
      participationId,
      earnedAt: claimedAt,
    });

    return participationId;
  },
});

/** Reassigns duplicate builder numbers so each participation keeps a unique slot. */
export const dedupeBuilderNumbers = internalMutation({
  args: {},
  returns: v.object({
    reassigned: v.number(),
    details: v.array(
      v.object({
        participationId: v.id("hackathonParticipations"),
        userId: v.id("users"),
        from: v.number(),
        to: v.number(),
      }),
    ),
  }),
  handler: async (ctx) => {
    const participations = await ctx.db.query("hackathonParticipations").collect();
    participations.sort((a, b) => a.claimedAt - b.claimedAt);

    const seen = new Set<number>();
    let nextNumber =
      participations.reduce((max, participation) => Math.max(max, participation.builderNumber), 0) +
      1;
    const details: Array<{
      participationId: (typeof participations)[number]["_id"];
      userId: (typeof participations)[number]["userId"];
      from: number;
      to: number;
    }> = [];

    for (const participation of participations) {
      if (!seen.has(participation.builderNumber)) {
        seen.add(participation.builderNumber);
        continue;
      }

      await ctx.db.patch(participation._id, { builderNumber: nextNumber });
      details.push({
        participationId: participation._id,
        userId: participation.userId,
        from: participation.builderNumber,
        to: nextNumber,
      });
      seen.add(nextNumber);
      nextNumber += 1;
    }

    return { reassigned: details.length, details };
  },
});
