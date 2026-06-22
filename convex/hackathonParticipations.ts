import { v } from "convex/values";
import { mutation, query, type MutationCtx, type QueryCtx } from "./_generated/server";
import { createGreenHackathonBuilderBadge } from "./lib/badgeRecords";

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

    const participationCount = (await ctx.db.query("hackathonParticipations").collect()).length;
    const builderNumber = participationCount + 1;
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
