import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { projectFieldValidator } from "./lib/projectFields";

const availabilitySlot = v.object({
  day: v.number(),
  period: v.number(),
});

const projectMemberRoleValidator = v.union(v.literal("owner"), v.literal("member"));

export default defineSchema({
  users: defineTable({
    clerkId: v.string(),
    email: v.string(),
    name: v.string(),
    username: v.optional(v.string()),
    avatarUrl: v.string(),
    avatarStorageId: v.optional(v.union(v.id("_storage"), v.null())),
    bio: v.optional(v.string()),
    website: v.optional(v.string()),
    buttonColor: v.optional(v.string()),
    stripeCustomerId: v.optional(v.string()),
    location: v.optional(v.string()),
    timezone: v.optional(v.string()),
    archetypes: v.optional(v.array(v.string())),
    skills: v.optional(v.array(v.string())),
    vision: v.optional(v.string()),
    why: v.optional(v.string()),
    availability: v.optional(v.array(availabilitySlot)),
    nowPlaying: v.optional(v.string()),
    lastSeenAt: v.optional(v.number()),
    onboardingCompletedAt: v.optional(v.number()),
    socialLinks: v.optional(v.record(v.string(), v.string())),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_clerk_id", ["clerkId"])
    .index("by_email", ["email"])
    .index("by_username", ["username"]),

  projects: defineTable({
    userId: v.id("users"),
    field: projectFieldValidator,
    title: v.string(),
    blurb: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_user", ["userId"]),

  projectMembers: defineTable({
    projectId: v.id("projects"),
    userId: v.id("users"),
    role: projectMemberRoleValidator,
    addedAt: v.number(),
  })
    .index("by_project", ["projectId"])
    .index("by_user", ["userId"])
    .index("by_project_and_user", ["projectId", "userId"]),

  projectInvites: defineTable({
    projectId: v.id("projects"),
    invitedUserId: v.id("users"),
    invitedByUserId: v.id("users"),
    status: v.union(
      v.literal("pending"),
      v.literal("accepted"),
      v.literal("declined"),
    ),
    createdAt: v.number(),
    respondedAt: v.optional(v.number()),
  })
    .index("by_invited_user_and_status", ["invitedUserId", "status"])
    .index("by_project", ["projectId"])
    .index("by_project_and_invited_user", ["projectId", "invitedUserId"]),

  hackathonClaims: defineTable({
    userId: v.id("users"),
    projectIndex: v.number(),
    projectTitle: v.string(),
    builderName: v.string(),
    field: projectFieldValidator,
    blurb: v.string(),
    claimedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_project_index", ["projectIndex"])
    .index("by_user_and_project_index", ["userId", "projectIndex"]),

  hackathonParticipations: defineTable({
    userId: v.id("users"),
    builderNumber: v.number(),
    claimedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_builder_number", ["builderNumber"]),
});
