import { v } from "convex/values";
import {
  mutation,
  query,
  type MutationCtx,
  type QueryCtx,
} from "./_generated/server";
import { projectFieldValidator } from "./lib/projectFields";
import { Doc, Id } from "./_generated/dataModel";

const projectMemberSummaryValidator = v.object({
  userId: v.id("users"),
  name: v.string(),
  username: v.optional(v.string()),
  avatarUrl: v.string(),
  role: v.union(v.literal("owner"), v.literal("member")),
});

const projectWithMembersValidator = v.object({
  _id: v.id("projects"),
  _creationTime: v.number(),
  userId: v.id("users"),
  field: projectFieldValidator,
  title: v.string(),
  blurb: v.string(),
  createdAt: v.number(),
  updatedAt: v.number(),
  members: v.array(projectMemberSummaryValidator),
});

const collaboratorSearchResultValidator = v.object({
  _id: v.id("users"),
  name: v.string(),
  username: v.optional(v.string()),
  avatarUrl: v.string(),
});

const pendingInviteValidator = v.object({
  _id: v.id("projectInvites"),
  projectId: v.id("projects"),
  projectTitle: v.string(),
  projectBlurb: v.string(),
  field: projectFieldValidator,
  inviterName: v.string(),
  inviterAvatarUrl: v.string(),
  createdAt: v.number(),
});

function trimText(value: string): string {
  return value.trim();
}

async function getAuthenticatedUser(ctx: MutationCtx | QueryCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new Error("Not authenticated");
  }

  const user = await ctx.db
    .query("users")
    .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
    .unique();

  if (!user) {
    throw new Error("User not found");
  }

  return user;
}

async function getProjectMembers(ctx: QueryCtx | MutationCtx, projectId: Id<"projects">) {
  const rows = await ctx.db
    .query("projectMembers")
    .withIndex("by_project", (q) => q.eq("projectId", projectId))
    .collect();

  const members = await Promise.all(
    rows.map(async (row) => {
      const memberUser = await ctx.db.get("users", row.userId);
      if (!memberUser) return null;

      return {
        userId: memberUser._id,
        name: memberUser.name,
        username: memberUser.username,
        avatarUrl: memberUser.avatarUrl,
        role: row.role,
      };
    }),
  );

  return members
    .filter((member): member is NonNullable<typeof member> => member !== null)
    .sort((a, b) => {
      if (a.role === "owner" && b.role !== "owner") return -1;
      if (b.role === "owner" && a.role !== "owner") return 1;
      return a.name.localeCompare(b.name);
    });
}

async function attachMembersToProject(ctx: QueryCtx, project: Doc<"projects">) {
  return {
    ...project,
    members: await getProjectMembers(ctx, project._id),
  };
}

async function assertCanInviteUser(
  ctx: MutationCtx,
  projectId: Id<"projects">,
  invitedUserId: Id<"users">,
) {
  const existingMember = await ctx.db
    .query("projectMembers")
    .withIndex("by_project_and_user", (q) =>
      q.eq("projectId", projectId).eq("userId", invitedUserId),
    )
    .unique();

  if (existingMember) {
    throw new Error("This builder is already on the project");
  }

  const existingInvite = await ctx.db
    .query("projectInvites")
    .withIndex("by_project_and_invited_user", (q) =>
      q.eq("projectId", projectId).eq("invitedUserId", invitedUserId),
    )
    .unique();

  if (existingInvite?.status === "pending") {
    throw new Error("This builder already has a pending invite");
  }

  if (existingInvite?.status === "accepted") {
    throw new Error("This builder is already on the project");
  }
}

export const listMine = query({
  args: {},
  returns: v.array(projectWithMembersValidator),
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

    const memberships = await ctx.db
      .query("projectMembers")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    const projectIds = [...new Set(memberships.map((row) => row.projectId))];
    const projects = (
      await Promise.all(projectIds.map((projectId) => ctx.db.get("projects", projectId)))
    ).filter((project): project is NonNullable<typeof project> => project !== null);

    const enriched = await Promise.all(
      projects.map((project) => attachMembersToProject(ctx, project)),
    );

    return enriched.sort((a, b) => b.updatedAt - a.updatedAt);
  },
});

export const listPendingInvites = query({
  args: {},
  returns: v.array(pendingInviteValidator),
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

    const invites = await ctx.db
      .query("projectInvites")
      .withIndex("by_invited_user_and_status", (q) =>
        q.eq("invitedUserId", user._id).eq("status", "pending"),
      )
      .collect();

    const enriched = await Promise.all(
      invites.map(async (invite) => {
        const project = await ctx.db.get("projects", invite.projectId);
        const inviter = await ctx.db.get("users", invite.invitedByUserId);
        if (!project || !inviter) return null;

        return {
          _id: invite._id,
          projectId: invite.projectId,
          projectTitle: project.title,
          projectBlurb: project.blurb,
          field: project.field,
          inviterName: inviter.name,
          inviterAvatarUrl: inviter.avatarUrl,
          createdAt: invite.createdAt,
        };
      }),
    );

    return enriched
      .filter((invite): invite is NonNullable<typeof invite> => invite !== null)
      .sort((a, b) => b.createdAt - a.createdAt);
  },
});

export const searchCollaborators = query({
  args: { query: v.string() },
  returns: v.array(collaboratorSearchResultValidator),
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);
    const search = trimText(args.query).toLowerCase();

    if (search.length < 2) {
      return [];
    }

    const users = await ctx.db.query("users").collect();

    return users
      .filter((candidate) => candidate._id !== user._id)
      .filter((candidate) => {
        const name = candidate.name.toLowerCase();
        const username = candidate.username?.toLowerCase() ?? "";
        return name.includes(search) || username.includes(search);
      })
      .slice(0, 8)
      .map((candidate) => ({
        _id: candidate._id,
        name: candidate.name,
        username: candidate.username,
        avatarUrl: candidate.avatarUrl,
      }));
  },
});

export const getUsersByIds = query({
  args: { userIds: v.array(v.id("users")) },
  returns: v.array(collaboratorSearchResultValidator),
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }

    const users = await Promise.all(
      args.userIds.map((userId) => ctx.db.get("users", userId)),
    );

    return users
      .filter((user): user is NonNullable<typeof user> => user !== null)
      .map((user) => ({
        _id: user._id,
        name: user.name,
        username: user.username,
        avatarUrl: user.avatarUrl,
      }));
  },
});

export const create = mutation({
  args: {
    field: projectFieldValidator,
    title: v.string(),
    blurb: v.string(),
    inviteUserIds: v.array(v.id("users")),
  },
  returns: v.id("projects"),
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);

    const title = trimText(args.title);
    const blurb = trimText(args.blurb);

    if (!title) {
      throw new Error("Project title is required");
    }

    if (title.length > 120) {
      throw new Error("Project title must be 120 characters or fewer");
    }

    if (!blurb) {
      throw new Error("Project description is required");
    }

    if (blurb.length > 500) {
      throw new Error("Project description must be 500 characters or fewer");
    }

    const uniqueInviteIds = [...new Set(args.inviteUserIds)].filter(
      (inviteUserId) => inviteUserId !== user._id,
    );

    if (uniqueInviteIds.length > 12) {
      throw new Error("You can invite up to 12 builders");
    }

    for (const inviteUserId of uniqueInviteIds) {
      const invitee = await ctx.db.get("users", inviteUserId);
      if (!invitee) {
        throw new Error("One or more selected builders could not be found");
      }
    }

    const now = Date.now();

    const projectId = await ctx.db.insert("projects", {
      userId: user._id,
      field: args.field,
      title,
      blurb,
      createdAt: now,
      updatedAt: now,
    });

    await ctx.db.insert("projectMembers", {
      projectId,
      userId: user._id,
      role: "owner",
      addedAt: now,
    });

    for (const inviteUserId of uniqueInviteIds) {
      await assertCanInviteUser(ctx, projectId, inviteUserId);

      const existingInvite = await ctx.db
        .query("projectInvites")
        .withIndex("by_project_and_invited_user", (q) =>
          q.eq("projectId", projectId).eq("invitedUserId", inviteUserId),
        )
        .unique();

      if (existingInvite?.status === "declined") {
        await ctx.db.patch(existingInvite._id, {
          invitedByUserId: user._id,
          status: "pending",
          createdAt: now,
          respondedAt: undefined,
        });
        continue;
      }

      await ctx.db.insert("projectInvites", {
        projectId,
        invitedUserId: inviteUserId,
        invitedByUserId: user._id,
        status: "pending",
        createdAt: now,
      });
    }

    return projectId;
  },
});

export const acceptInvite = mutation({
  args: { inviteId: v.id("projectInvites") },
  returns: v.null(),
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);
    const invite = await ctx.db.get("projectInvites", args.inviteId);

    if (!invite) {
      throw new Error("Invite not found");
    }

    if (invite.invitedUserId !== user._id) {
      throw new Error("Unauthorized");
    }

    if (invite.status !== "pending") {
      throw new Error("This invite is no longer pending");
    }

    const project = await ctx.db.get("projects", invite.projectId);
    if (!project) {
      throw new Error("Project not found");
    }

    const existingMember = await ctx.db
      .query("projectMembers")
      .withIndex("by_project_and_user", (q) =>
        q.eq("projectId", invite.projectId).eq("userId", user._id),
      )
      .unique();

    const now = Date.now();

    if (!existingMember) {
      await ctx.db.insert("projectMembers", {
        projectId: invite.projectId,
        userId: user._id,
        role: "member",
        addedAt: now,
      });
    }

    await ctx.db.patch(invite._id, {
      status: "accepted",
      respondedAt: now,
    });

    await ctx.db.patch(invite.projectId, {
      updatedAt: now,
    });

    return null;
  },
});

export const declineInvite = mutation({
  args: { inviteId: v.id("projectInvites") },
  returns: v.null(),
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);
    const invite = await ctx.db.get("projectInvites", args.inviteId);

    if (!invite) {
      throw new Error("Invite not found");
    }

    if (invite.invitedUserId !== user._id) {
      throw new Error("Unauthorized");
    }

    if (invite.status !== "pending") {
      throw new Error("This invite is no longer pending");
    }

    await ctx.db.patch(invite._id, {
      status: "declined",
      respondedAt: Date.now(),
    });

    return null;
  },
});
