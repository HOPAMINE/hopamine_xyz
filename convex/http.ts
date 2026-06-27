import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { api } from "./_generated/api";

const http = httpRouter();

http.route({
  path: "/presence/offline",
  method: "POST",
  handler: httpAction(async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return new Response("Unauthorized", { status: 401 });
    }
    await ctx.runMutation(api.presence.setOffline, {});
    return new Response(null, { status: 204 });
  }),
});

export default http;
