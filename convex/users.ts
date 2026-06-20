import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

function trimText(value: unknown): string {
  if (typeof value === "string") return value.trim();
  if (Array.isArray(value)) return value.map(String).join(", ").trim();
  if (value == null) return "";
  return String(value).trim();
}

function normalizeSkills(value: unknown): string[] | undefined {
  if (value === undefined) return undefined;
  if (Array.isArray(value)) {
    const items = value.map((item) => trimText(item)).filter(Boolean);
    return items.length > 0 ? items : undefined;
  }
  const text = trimText(value);
  if (!text) return undefined;
  return text
    .split(/[,;\n]/)
    .map((part) => part.trim())
    .filter(Boolean);
}

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
    skills: v.optional(v.union(v.string(), v.array(v.string()))),
    vision: v.optional(v.string()),
    why: v.optional(v.string()),
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
    if (args.username !== undefined && trimText(args.username) !== "") {
      normalizedUsername = trimText(args.username).toLowerCase();
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
      updates.bio = trimText(args.bio) || undefined;
    }

    if (args.username !== undefined) {
      updates.username = normalizedUsername ?? (trimText(args.username) || undefined);
    }

    if (args.website !== undefined) {
      let website = trimText(args.website) || undefined;
      if (website && !website.startsWith("http://") && !website.startsWith("https://")) {
        website = "https://" + website;
      }
      updates.website = website;
    }

    if (args.buttonColor !== undefined) {
      const color = trimText(args.buttonColor);
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
      updates.location = trimText(args.location) || undefined;
    }

    if (args.archetypes !== undefined) {
      updates.archetypes = args.archetypes;
    }

    if (args.skills !== undefined) {
      updates.skills = normalizeSkills(args.skills);
    }

    if (args.vision !== undefined) {
      updates.vision = trimText(args.vision) || undefined;
    }

    if (args.why !== undefined) {
      updates.why = trimText(args.why) || undefined;
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

    if (user.avatarStorageId) {
      await ctx.storage.delete(user.avatarStorageId);
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
    skills: v.string(),
    vision: v.string(),
    why: v.string(),
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

    await ctx.db.patch(user._id, {
      name: args.name.trim(),
      location: args.location.trim(),
      archetypes: args.archetypes,
      skills: normalizeSkills(args.skills),
      vision: args.vision.trim(),
      why: args.why.trim(),
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

const publicBadgeValidator = v.object({
  name: v.string(),
  username: v.string(),
  builderNumber: v.optional(v.number()),
  projectTitle: v.optional(v.string()),
  projectBlurb: v.optional(v.string()),
});

export const getPublicBadgeByUsername = query({
  args: { username: v.string() },
  returns: v.union(publicBadgeValidator, v.null()),
  handler: async (ctx, args) => {
    const username = args.username.trim().toLowerCase();
    if (!username) {
      return null;
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_username", (q) => q.eq("username", username))
      .unique();

    if (!user?.username) {
      return null;
    }

    const participation = await ctx.db
      .query("hackathonParticipations")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .unique();

    const projectClaim = await ctx.db
      .query("hackathonClaims")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .unique();

    return {
      name: user.name,
      username: user.username,
      builderNumber: participation?.builderNumber,
      projectTitle: projectClaim?.projectTitle,
      projectBlurb: projectClaim?.blurb,
    };
  },
});
