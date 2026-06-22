import { internalQuery } from "../_generated/server";
import { v } from "convex/values";
import { isHackathonDirectoryProject } from "./seedHackathonDirectory";

const TABLE_NAMES = [
  "users",
  "projects",
  "projectMembers",
  "projectInvites",
  "projectJoinRequests",
  "hackathonClaims",
  "hackathonParticipations",
  "badges",
] as const;

export const countAll = internalQuery({
  args: {},
  returns: v.record(v.string(), v.number()),
  handler: async (ctx) => {
    const counts: Record<string, number> = {};
    for (const table of TABLE_NAMES) {
      const rows = await ctx.db.query(table).collect();
      counts[table] = rows.length;
    }
    return counts;
  },
});

export const listSparseDirectoryProjects = internalQuery({
  args: {},
  returns: v.array(
    v.object({
      _id: v.id("projects"),
      hackathonIndex: v.number(),
      title: v.string(),
      hasLive: v.boolean(),
      hasDemo: v.boolean(),
      hasRepo: v.boolean(),
      hasDiscord: v.boolean(),
    }),
  ),
  handler: async (ctx) => {
    const projects = await ctx.db.query("projects").collect();
    return projects
      .filter(isHackathonDirectoryProject)
      .map((project) => ({
        _id: project._id,
        hackathonIndex: project.hackathonIndex!,
        title: project.title,
        hasLive: Boolean(project.liveUrl),
        hasDemo: Boolean(project.demoUrl),
        hasRepo: Boolean(project.repoUrl),
        hasDiscord: Boolean(project.builderDiscord),
      }))
      .filter((p) => !p.hasLive && !p.hasDemo && !p.hasRepo);
  },
});
