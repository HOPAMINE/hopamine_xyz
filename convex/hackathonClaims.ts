import { v } from "convex/values";
import { mutation, query, type MutationCtx, type QueryCtx } from "./_generated/server";
import { projectFieldValidator } from "./lib/projectFields";
import { HACKATHON_PROJECT_COUNT } from "./lib/hackathonProjectCount";
import {
  linkGreenHackathonBadgeToProjectClaim,
  unlinkGreenHackathonBadgeFromProjectClaim,
} from "./lib/badgeRecords";

const hackathonClaimValidator = v.object({
  _id: v.id("hackathonClaims"),
  _creationTime: v.number(),
  userId: v.id("users"),
  projectIndex: v.number(),
  projectTitle: v.string(),
  builderName: v.string(),
  field: projectFieldValidator,
  blurb: v.string(),
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

export const getMyProject = query({
  args: {},
  returns: v.union(hackathonClaimValidator, v.null()),
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
      .query("hackathonClaims")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .unique();
  },
});

export const claimProject = mutation({
  args: {
    projectIndex: v.number(),
    projectTitle: v.string(),
    builderName: v.string(),
    field: projectFieldValidator,
    blurb: v.string(),
  },
  returns: v.id("hackathonClaims"),
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);

    if (
      !Number.isInteger(args.projectIndex) ||
      args.projectIndex < 0 ||
      args.projectIndex >= HACKATHON_PROJECT_COUNT
    ) {
      throw new Error("Invalid project selection");
    }

    const title = args.projectTitle.trim();
    const builderName = args.builderName.trim();
    const blurb = args.blurb.trim();

    if (!title || !builderName || !blurb) {
      throw new Error("Invalid project details");
    }

    const existingUserClaim = await ctx.db
      .query("hackathonClaims")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .unique();

    if (existingUserClaim) {
      throw new Error("You have already claimed a hackathon project");
    }

    const existingUserProjectClaim = await ctx.db
      .query("hackathonClaims")
      .withIndex("by_user_and_project_index", (q) =>
        q.eq("userId", user._id).eq("projectIndex", args.projectIndex),
      )
      .unique();

    if (existingUserProjectClaim) {
      throw new Error("You have already claimed this project");
    }

    const claimId = await ctx.db.insert("hackathonClaims", {
      userId: user._id,
      projectIndex: args.projectIndex,
      projectTitle: title,
      builderName,
      field: args.field,
      blurb,
      claimedAt: Date.now(),
    });

    await linkGreenHackathonBadgeToProjectClaim(ctx, {
      userId: user._id,
      claimId,
      projectIndex: args.projectIndex,
    });

    return claimId;
  },
});

export const unclaimProject = mutation({
  args: {},
  returns: v.null(),
  handler: async (ctx) => {
    const user = await getAuthenticatedUser(ctx);

    const claim = await ctx.db
      .query("hackathonClaims")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .unique();

    if (!claim) {
      throw new Error("No hackathon project to remove");
    }

    await ctx.db.delete(claim._id);
    await unlinkGreenHackathonBadgeFromProjectClaim(ctx, user._id);
    return null;
  },
});
