import { MutationCtx, QueryCtx } from "../_generated/server";
import { Doc, Id } from "../_generated/dataModel";
import { GREEN_HACKATHON_ID } from "./badgeKinds";
import type { ProjectField } from "./projectFields";

export type GreenHackathonBadgeDisplay = {
  kind: "green-hackathon-builder";
  id: string;
  name: string;
  builderNumber: number;
  username?: string;
  projectTitle?: string;
  projectBlurb?: string;
  projectField?: ProjectField;
  projectIndex?: number;
  hackathonId?: string;
};

async function findProjectByHackathonIndex(
  ctx: MutationCtx | QueryCtx,
  projectIndex: number,
) {
  return await ctx.db
    .query("projects")
    .withIndex("by_hackathon_index", (q) => q.eq("hackathonIndex", projectIndex))
    .unique();
}

export async function getGreenHackathonBadgeForUser(
  ctx: MutationCtx | QueryCtx,
  userId: Id<"users">,
) {
  return await ctx.db
    .query("badges")
    .withIndex("by_user_and_kind", (q) =>
      q.eq("userId", userId).eq("kind", "green-hackathon-builder"),
    )
    .unique();
}

export async function createGreenHackathonBuilderBadge(
  ctx: MutationCtx,
  args: {
    userId: Id<"users">;
    participationId: Id<"hackathonParticipations">;
    earnedAt: number;
  },
): Promise<Id<"badges">> {
  const existing = await getGreenHackathonBadgeForUser(ctx, args.userId);
  if (existing) {
    return existing._id;
  }

  return await ctx.db.insert("badges", {
    userId: args.userId,
    kind: "green-hackathon-builder",
    earnedAt: args.earnedAt,
    hackathonId: GREEN_HACKATHON_ID,
    hackathonParticipationId: args.participationId,
  });
}

export async function linkGreenHackathonBadgeToProjectClaim(
  ctx: MutationCtx,
  args: {
    userId: Id<"users">;
    claimId: Id<"hackathonClaims">;
    projectIndex: number;
  },
): Promise<void> {
  let badge = await getGreenHackathonBadgeForUser(ctx, args.userId);
  if (!badge) {
    const participation = await ctx.db
      .query("hackathonParticipations")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .unique();
    if (!participation) {
      return;
    }
    const badgeId = await createGreenHackathonBuilderBadge(ctx, {
      userId: args.userId,
      participationId: participation._id,
      earnedAt: participation.claimedAt,
    });
    badge = await ctx.db.get("badges", badgeId);
    if (!badge) {
      return;
    }
  }

  const project = await findProjectByHackathonIndex(ctx, args.projectIndex);

  await ctx.db.patch(badge._id, {
    hackathonClaimId: args.claimId,
    projectId: project?._id,
  });
}

export async function unlinkGreenHackathonBadgeFromProjectClaim(
  ctx: MutationCtx,
  userId: Id<"users">,
): Promise<void> {
  const badge = await getGreenHackathonBadgeForUser(ctx, userId);
  if (!badge) {
    return;
  }

  await ctx.db.patch(badge._id, {
    hackathonClaimId: undefined,
    projectId: undefined,
  });
}

export async function backfillGreenHackathonBadge(
  ctx: MutationCtx,
  participation: Doc<"hackathonParticipations">,
): Promise<"created" | "updated" | "skipped"> {
  const claim = await ctx.db
    .query("hackathonClaims")
    .withIndex("by_user", (q) => q.eq("userId", participation.userId))
    .unique();

  const existing = await getGreenHackathonBadgeForUser(ctx, participation.userId);
  const project = claim
    ? await findProjectByHackathonIndex(ctx, claim.projectIndex)
    : null;

  if (existing) {
    const needsUpdate =
      existing.hackathonParticipationId !== participation._id ||
      existing.hackathonClaimId !== claim?._id ||
      existing.projectId !== project?._id;

    if (needsUpdate) {
      await ctx.db.patch(existing._id, {
        hackathonParticipationId: participation._id,
        hackathonClaimId: claim?._id,
        projectId: project?._id,
        hackathonId: GREEN_HACKATHON_ID,
      });
      return "updated";
    }

    return "skipped";
  }

  await ctx.db.insert("badges", {
    userId: participation.userId,
    kind: "green-hackathon-builder",
    earnedAt: participation.claimedAt,
    hackathonId: GREEN_HACKATHON_ID,
    hackathonParticipationId: participation._id,
    hackathonClaimId: claim?._id,
    projectId: project?._id,
  });

  return "created";
}

export async function buildGreenHackathonBadgeFromParticipation(
  ctx: QueryCtx,
  user: Doc<"users">,
): Promise<GreenHackathonBadgeDisplay | null> {
  const participation = await ctx.db
    .query("hackathonParticipations")
    .withIndex("by_user", (q) => q.eq("userId", user._id))
    .unique();

  if (!participation) {
    return null;
  }

  const claim = await ctx.db
    .query("hackathonClaims")
    .withIndex("by_user", (q) => q.eq("userId", user._id))
    .unique();

  const project = claim
    ? await findProjectByHackathonIndex(ctx, claim.projectIndex)
    : null;

  return {
    kind: "green-hackathon-builder",
    id: `green-hackathon-builder-${participation._id}`,
    name: user.name,
    builderNumber: participation.builderNumber,
    username: user.username,
    projectTitle: claim?.projectTitle ?? project?.title,
    projectBlurb: claim?.blurb ?? project?.blurb,
    projectField: claim?.field ?? project?.field,
    projectIndex: claim?.projectIndex ?? project?.hackathonIndex,
    hackathonId: GREEN_HACKATHON_ID,
  };
}

export async function syncGreenHackathonBadgeForUser(
  ctx: MutationCtx,
  userId: Id<"users">,
): Promise<"created" | "updated" | "skipped" | "none"> {
  const participation = await ctx.db
    .query("hackathonParticipations")
    .withIndex("by_user", (q) => q.eq("userId", userId))
    .unique();

  if (!participation) {
    return "none";
  }

  return await backfillGreenHackathonBadge(ctx, participation);
}
