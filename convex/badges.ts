import { v } from "convex/values";
import { query, type QueryCtx } from "./_generated/server";
import { Doc } from "./_generated/dataModel";
import { projectFieldValidator, type ProjectField } from "./lib/projectFields";

// Each badge is a discriminated union member keyed by `kind`. Add a new member
// per badge type; the frontend selects a card component off `kind`. `id` is a
// stable React key (today it equals `kind`, but stays distinct in case a future
// badge type can be earned more than once).
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
};

/**
 * Computes the badges a user has earned from their activity.
 *
 * Badges are derived, not stored — each source below inspects existing data and
 * contributes a badge when its criteria are met. Add new badge sources here as
 * the product grows; both the auth-scoped and any future public (by-username)
 * query should funnel through this single helper.
 */
async function computeBadgesForUser(ctx: QueryCtx, user: Doc<"users">): Promise<Badge[]> {
  const badges: Badge[] = [];

  // Green Hackathon builder badge — earned by claiming hackathon participation.
  // Project details (if the user also claimed a project) enrich the card.
  const participation = await ctx.db
    .query("hackathonParticipations")
    .withIndex("by_user", (q) => q.eq("userId", user._id))
    .unique();

  if (participation) {
    const projectClaim = await ctx.db
      .query("hackathonClaims")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .unique();

    badges.push({
      kind: "green-hackathon-builder",
      id: "green-hackathon-builder",
      name: user.name,
      builderNumber: participation.builderNumber,
      username: user.username,
      projectTitle: projectClaim?.projectTitle,
      projectBlurb: projectClaim?.blurb,
      projectField: projectClaim?.field,
      projectIndex: projectClaim?.projectIndex,
    });
  }

  return badges;
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

    return await computeBadgesForUser(ctx, user);
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

    return await computeBadgesForUser(ctx, user);
  },
});
