import { v } from "convex/values";
import { internalMutation, mutation } from "./_generated/server";
import { seedHackathonDirectoryProjects } from "./lib/seedHackathonDirectory";

const seedResultValidator = v.object({
  inserted: v.number(),
  updated: v.number(),
  total: v.number(),
});

/** Idempotent seed for all Green Hackathon directory projects. */
export const seedHackathonProjects = internalMutation({
  args: {},
  returns: seedResultValidator,
  handler: async (ctx) => {
    return await seedHackathonDirectoryProjects(ctx);
  },
});

/** One-time / dev seed — run via `npx convex run seedHackathonProjects:run`. */
export const run = mutation({
  args: {},
  returns: seedResultValidator,
  handler: async (ctx) => {
    return await seedHackathonDirectoryProjects(ctx);
  },
});
