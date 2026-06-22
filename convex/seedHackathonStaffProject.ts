import { v } from "convex/values";
import { internalMutation, mutation } from "./_generated/server";
import { seedHopamineHackathonStaffProject } from "./lib/seedHackathonStaffProject";

const seedResultValidator = v.object({
  projectId: v.id("projects"),
  created: v.boolean(),
  updated: v.boolean(),
});

/** Idempotent seed for the Hopamine Hackathon Staff project. */
export const seedStaffProject = internalMutation({
  args: {},
  returns: seedResultValidator,
  handler: async (ctx) => {
    return await seedHopamineHackathonStaffProject(ctx);
  },
});

/** Run via `npx convex run seedHackathonStaffProject:run`. */
export const run = mutation({
  args: {},
  returns: seedResultValidator,
  handler: async (ctx) => {
    return await seedHopamineHackathonStaffProject(ctx);
  },
});
