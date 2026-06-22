import { v } from "convex/values";
import { internal } from "./_generated/api";
import { internalAction } from "./_generated/server";

export const log = internalAction({
  args: {},
  returns: v.null(),
  handler: async (ctx) => {
    const counts = await ctx.runQuery(internal.lib.tableCounts.countAll, {});
    const sparse = await ctx.runQuery(internal.lib.tableCounts.listSparseDirectoryProjects, {});
    console.log(JSON.stringify({ counts, sparse }, null, 2));
    return null;
  },
});
