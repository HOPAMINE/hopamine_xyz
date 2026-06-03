import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getOrCreate = mutation({
  args: {
    clerkId: v.string(),
    email: v.string(),
    name: v.string(),
    avatarUrl: v.string(),
    username: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity || identity.subject !== args.clerkId) {
      throw new Error("Unauthorized");
    }

    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .unique();

    if (existingUser) {
      return existingUser._id;
    }

    let finalUsername = args.username?.trim().toLowerCase() || undefined;
    if (finalUsername) {
      const existingUsername = await ctx.db
        .query("users")
        .withIndex("by_username", (q) => q.eq("username", finalUsername))
        .unique();

      if (existingUsername) {
        finalUsername = undefined;
      }
    }

    const userId = await ctx.db.insert("users", {
      clerkId: args.clerkId,
      email: args.email,
      name: args.name,
      avatarUrl: args.avatarUrl,
      username: finalUsername,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return userId;
  },
});

export const getByClerkId = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .unique();
  },
});

export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    return await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();
  },
});

export const updateProfile = mutation({
  args: {
    name: v.optional(v.string()),
    bio: v.optional(v.string()),
    username: v.optional(v.string()),
    website: v.optional(v.string()),
    buttonColor: v.optional(v.string()),
    storageId: v.optional(v.id("_storage")),
    location: v.optional(v.string()),
    archetypes: v.optional(v.array(v.string())),
    skills: v.optional(v.array(v.string())),
    vision: v.optional(v.string()),
    why: v.optional(v.string()),
    discord: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!user) {
      throw new Error("User not found");
    }

    let normalizedUsername: string | undefined;
    if (args.username !== undefined && args.username.trim() !== "") {
      normalizedUsername = args.username.trim().toLowerCase();
      const currentUsernameLower = (user.username ?? "").toLowerCase();

      if (normalizedUsername !== currentUsernameLower) {
        const existingUser = await ctx.db
          .query("users")
          .withIndex("by_username", (q) => q.eq("username", normalizedUsername))
          .unique();

        if (existingUser && existingUser._id !== user._id) {
          throw new Error("Username already taken");
        }
      }
    }

    const updates: Record<string, unknown> = {
      updatedAt: Date.now(),
    };

    if (args.name !== undefined) {
      updates.name = args.name;
    }

    if (args.bio !== undefined) {
      updates.bio = args.bio;
    }

    if (args.username !== undefined) {
      updates.username = normalizedUsername ?? (args.username.trim() || undefined);
    }

    if (args.website !== undefined) {
      let website = args.website.trim() || undefined;
      if (website && !website.startsWith("http://") && !website.startsWith("https://")) {
        website = "https://" + website;
      }
      updates.website = website;
    }

    if (args.buttonColor !== undefined) {
      const color = args.buttonColor.trim();
      if (color === "" || /^#[0-9A-Fa-f]{6}$/.test(color)) {
        updates.buttonColor = color || undefined;
      } else {
        throw new Error("Invalid color format. Use hex format (e.g., #FF1A00)");
      }
    }

    if (args.storageId !== undefined) {
      const imageUrl = await ctx.storage.getUrl(args.storageId);
      updates.avatarUrl = imageUrl || "";
      updates.avatarStorageId = args.storageId;
    }

    if (args.location !== undefined) {
      updates.location = args.location.trim() || undefined;
    }
    if (args.archetypes !== undefined) {
      updates.archetypes = args.archetypes;
    }
    if (args.skills !== undefined) {
      const filtered = args.skills.map((s) => s.trim()).filter(Boolean);
      updates.skills = filtered.length > 0 ? filtered : undefined;
    }
    if (args.vision !== undefined) {
      updates.vision = args.vision.trim() || undefined;
    }
    if (args.why !== undefined) {
      updates.why = args.why.trim() || undefined;
    }
    if (args.discord !== undefined) {
      const discord = args.discord.trim().replace(/^@/, "");
      if (discord && !/^[a-zA-Z0-9_.]{2,32}(#\d{4})?$/.test(discord)) {
        throw new Error("Invalid Discord username");
      }
      const existing = user.socialLinks ?? {};
      updates.socialLinks = discord ? { ...existing, discord } : (() => {
        const { discord: _removed, ...rest } = existing;
        return Object.keys(rest).length > 0 ? rest : undefined;
      })();
    }

    await ctx.db.patch(user._id, updates);

    return { success: true };
  },
});

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    return await ctx.storage.generateUploadUrl();
  },
});

export const updateProfilePicture = mutation({
  args: {
    storageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!user) {
      throw new Error("User not found");
    }

    const imageUrl = await ctx.storage.getUrl(args.storageId);

    await ctx.db.patch(user._id, {
      avatarUrl: imageUrl || "",
      avatarStorageId: args.storageId,
      updatedAt: Date.now(),
    });

    return { success: true, imageUrl };
  },
});

export const completeOnboarding = mutation({
  args: {
    name: v.string(),
    location: v.string(),
    archetypes: v.array(v.string()),
    skills: v.array(v.string()),
    vision: v.string(),
    why: v.string(),
    discord: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!user) throw new Error("User not found");

    // Idempotent — don't overwrite answers if already completed
    if (user.onboardingCompletedAt) return { success: true, alreadyCompleted: true };

    const discord = (args.discord?.trim() ?? "").replace(/^@/, "");
    if (discord && !/^[a-zA-Z0-9_.]{2,32}(#\d{4})?$/.test(discord)) {
      throw new Error("Invalid Discord username");
    }
    const socialLinks = discord ? { discord } : undefined;

    await ctx.db.patch(user._id, {
      name: args.name.trim(),
      location: args.location.trim(),
      archetypes: args.archetypes,
      skills: args.skills.map((s) => s.trim()).filter(Boolean),
      vision: args.vision.trim(),
      why: args.why.trim(),
      ...(socialLinks !== undefined ? { socialLinks } : {}),
      onboardingCompletedAt: Date.now(),
      updatedAt: Date.now(),
    });

    return { success: true, alreadyCompleted: false };
  },
});

export const deleteAccount = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!user) throw new Error("User not found");

    if (user.avatarStorageId) {
      await ctx.storage.delete(user.avatarStorageId);
    }

    await ctx.db.delete(user._id);

    return { success: true };
  },
});

export const generateImageUrl = query({
  args: { storageId: v.id("_storage") },
  handler: async (ctx, args) => {
    return await ctx.storage.getUrl(args.storageId);
  },
});

// One-time migration: convert legacy string skills to string[].
// Run once via the Convex dashboard or `npx convex run users:migrateSkillsToArray`.
export const migrateSkillsToArray = mutation({
  args: {},
  handler: async (ctx) => {
    const users = await ctx.db.query("users").collect();
    let migrated = 0;
    for (const user of users) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (typeof (user.skills as any) === "string") {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const skills = (user.skills as any as string)
          .split(",")
          .map((s: string) => s.trim())
          .filter(Boolean);
        await ctx.db.patch(user._id, { skills });
        migrated++;
      }
    }
    return { migrated };
  },
});
