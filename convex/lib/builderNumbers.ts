import type { MutationCtx, QueryCtx } from "../_generated/server";

/** Next builder number is max(existing) + 1 so deleted rows cannot cause duplicates. */
export async function allocateNextBuilderNumber(
  ctx: MutationCtx | QueryCtx,
): Promise<number> {
  const participations = await ctx.db.query("hackathonParticipations").collect();
  const maxNumber = participations.reduce(
    (max, participation) => Math.max(max, participation.builderNumber),
    0,
  );
  return maxNumber + 1;
}
