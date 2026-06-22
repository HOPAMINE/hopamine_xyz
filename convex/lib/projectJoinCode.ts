import type { MutationCtx } from "../_generated/server";

const JOIN_CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const JOIN_CODE_LENGTH = 6;

export function normalizeJoinCode(code: string): string {
  return code.trim().toUpperCase().replace(/[\s-]/g, "");
}

function randomJoinCode(): string {
  let code = "";
  for (let i = 0; i < JOIN_CODE_LENGTH; i++) {
    code += JOIN_CODE_ALPHABET[Math.floor(Math.random() * JOIN_CODE_ALPHABET.length)];
  }
  return code;
}

export async function generateUniqueJoinCode(ctx: MutationCtx): Promise<string> {
  for (let attempt = 0; attempt < 12; attempt++) {
    const joinCode = randomJoinCode();
    const existing = await ctx.db
      .query("projects")
      .withIndex("by_join_code", (q) => q.eq("joinCode", joinCode))
      .unique();

    if (!existing) {
      return joinCode;
    }
  }

  throw new Error("Could not generate a unique project code. Please try again.");
}
