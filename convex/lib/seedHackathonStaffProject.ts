import { MutationCtx } from "../_generated/server";
import { Id } from "../_generated/dataModel";
import {
  HACKATHON_PROJECTS,
  HOPAMINE_HACKATHON_STAFF_TITLE,
} from "../../shared/hackathonProjects";
import { generateUniqueJoinCode } from "./projectJoinCode";

export const HOPAMINE_HACKATHON_STAFF_OWNER_ID =
  "j577smhdgf9a537k3kryx4scgx87npx5" as Id<"users">;

export const HOPAMINE_HACKATHON_STAFF_INDEX = HACKATHON_PROJECTS.findIndex(
  (project) => project.title === HOPAMINE_HACKATHON_STAFF_TITLE,
);

export async function ensureStaffProjectOwnerMembership(
  ctx: MutationCtx,
  projectId: Id<"projects">,
  addedAt: number,
) {
  const membership = await ctx.db
    .query("projectMembers")
    .withIndex("by_project_and_user", (q) =>
      q.eq("projectId", projectId).eq("userId", HOPAMINE_HACKATHON_STAFF_OWNER_ID),
    )
    .unique();

  if (!membership) {
    await ctx.db.insert("projectMembers", {
      projectId,
      userId: HOPAMINE_HACKATHON_STAFF_OWNER_ID,
      role: "owner",
      addedAt,
    });
    return;
  }

  if (membership.role !== "owner") {
    await ctx.db.patch(membership._id, { role: "owner" });
  }
}

export async function seedHopamineHackathonStaffProject(ctx: MutationCtx): Promise<{
  projectId: Id<"projects">;
  created: boolean;
  updated: boolean;
}> {
  if (HOPAMINE_HACKATHON_STAFF_INDEX < 0) {
    throw new Error("Hopamine Hackathon Staff is missing from the hackathon directory");
  }

  const owner = await ctx.db.get("users", HOPAMINE_HACKATHON_STAFF_OWNER_ID);
  if (!owner) {
    throw new Error("Hopamine Hackathon Staff owner user not found");
  }

  const staffProject = HACKATHON_PROJECTS[HOPAMINE_HACKATHON_STAFF_INDEX]!;
  const now = Date.now();

  const existingByIndex = await ctx.db
    .query("projects")
    .withIndex("by_hackathon_index", (q) =>
      q.eq("hackathonIndex", HOPAMINE_HACKATHON_STAFF_INDEX),
    )
    .unique();

  const ownedProjects = await ctx.db
    .query("projects")
    .withIndex("by_user", (q) => q.eq("userId", HOPAMINE_HACKATHON_STAFF_OWNER_ID))
    .collect();

  const legacyDuplicate = ownedProjects.find(
    (project) =>
      project.title === HOPAMINE_HACKATHON_STAFF_TITLE &&
      project.hackathonIndex === undefined &&
      project._id !== existingByIndex?._id,
  );

  if (legacyDuplicate) {
    await ctx.db.delete(legacyDuplicate._id);
  }

  const payload = {
    userId: HOPAMINE_HACKATHON_STAFF_OWNER_ID,
    field: staffProject.field,
    title: HOPAMINE_HACKATHON_STAFF_TITLE,
    blurb: staffProject.blurb.trim(),
    builderName: owner.name,
    hackathonIndex: HOPAMINE_HACKATHON_STAFF_INDEX,
    updatedAt: now,
  };

  if (existingByIndex) {
    await ctx.db.patch(existingByIndex._id, payload);
    await ensureStaffProjectOwnerMembership(ctx, existingByIndex._id, now);

    if (!existingByIndex.joinCode) {
      const joinCode = await generateUniqueJoinCode(ctx);
      await ctx.db.patch(existingByIndex._id, { joinCode });
    }

    return { projectId: existingByIndex._id, created: false, updated: true };
  }

  const joinCode = await generateUniqueJoinCode(ctx);
  const projectId = await ctx.db.insert("projects", {
    ...payload,
    joinCode,
    createdAt: now,
  });

  await ensureStaffProjectOwnerMembership(ctx, projectId, now);

  return { projectId, created: true, updated: false };
}
