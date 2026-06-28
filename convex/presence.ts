import { v } from "convex/values";
import { Id } from "./_generated/dataModel";
import { MutationCtx, QueryCtx } from "./_generated/server";
import { mutation, query } from "./_generated/server";

async function findUserByIdentity(ctx: MutationCtx | QueryCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) return null;
  return ctx.db
    .query("users")
    .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
    .unique();
}

export const setOnline = mutation({
  args: {},
  handler: async (ctx) => {
    const user = await findUserByIdentity(ctx);
    if (!user) return;
    const existing = await ctx.db
      .query("presence")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .unique();
    if (existing) {
      await ctx.db.patch(existing._id, { isOnline: true, updatedAt: Date.now() });
    } else {
      await ctx.db.insert("presence", { userId: user._id, isOnline: true, updatedAt: Date.now() });
    }
  },
});

export const setOffline = mutation({
  args: {},
  handler: async (ctx) => {
    const user = await findUserByIdentity(ctx);
    if (!user) return;
    const existing = await ctx.db
      .query("presence")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .unique();
    if (existing) {
      await ctx.db.patch(existing._id, { isOnline: false, updatedAt: Date.now() });
    } else {
      await ctx.db.insert("presence", { userId: user._id, isOnline: false, updatedAt: Date.now() });
    }
  },
});

export const getForUsers = query({
  args: { userIds: v.array(v.id("users")) },
  returns: v.array(
    v.object({
      userId: v.id("users"),
      isOnline: v.boolean(),
      updatedAt: v.number(),
    }),
  ),
  handler: async (ctx, args) => {
    const result: { userId: Id<"users">; isOnline: boolean; updatedAt: number }[] = [];
    for (const userId of args.userIds) {
      const presence = await ctx.db
        .query("presence")
        .withIndex("by_user", (q) => q.eq("userId", userId))
        .unique();
      if (presence) {
        result.push({
          userId,
          isOnline: presence.isOnline,
          updatedAt: presence.updatedAt,
        });
      }
    }
    return result;
  },
});

export const getByUser = query({
  args: { userId: v.id("users") },
  returns: v.union(v.object({ isOnline: v.boolean() }), v.null()),
  handler: async (ctx, args) => {
    const presence = await ctx.db
      .query("presence")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .unique();
    if (!presence) return null;
    return { isOnline: presence.isOnline };
  },
});
