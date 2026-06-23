import type { Id } from "../_generated/dataModel";
import type { MutationCtx, QueryCtx } from "../_generated/server";

const USERNAME_PATTERN = /^[a-z0-9_]{3,30}$/;
const USERNAME_PREFIX_MAX_LENGTH = 26;
const USERNAME_SUFFIX_LENGTH = 4;

export function normalizeUsernameInput(raw: string): string {
  return raw.trim().toLowerCase().replace(/^@/, "");
}

export function slugifyUsernameBase(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/^@/, "")
    .replace(/[^a-z0-9]+/g, "")
    .slice(0, USERNAME_PREFIX_MAX_LENGTH);
}

export function isValidUsername(username: string): boolean {
  return USERNAME_PATTERN.test(username);
}

function fourDigitSuffix(userId: Id<"users">, attempt: number): string {
  let hash = 0;
  const seed = `${userId}:${attempt}`;
  for (let index = 0; index < seed.length; index += 1) {
    hash = (hash * 31 + seed.charCodeAt(index)) >>> 0;
  }
  return String(hash % 10_000).padStart(USERNAME_SUFFIX_LENGTH, "0");
}

function usernamePrefixFromName(name: string): string {
  const slug = slugifyUsernameBase(name);
  if (slug.length >= 1) {
    return slug.slice(0, USERNAME_PREFIX_MAX_LENGTH);
  }
  return "builder";
}

async function isUsernameAvailable(
  ctx: MutationCtx | QueryCtx,
  username: string,
  exceptUserId?: Id<"users">,
): Promise<boolean> {
  const existing = await ctx.db
    .query("users")
    .withIndex("by_username", (q) => q.eq("username", username))
    .unique();

  return !existing || existing._id === exceptUserId;
}

export async function generateUniqueUsername(
  ctx: MutationCtx | QueryCtx,
  args: {
    name: string;
    email?: string;
    userId: Id<"users">;
  },
): Promise<string> {
  const prefix = usernamePrefixFromName(args.name);

  for (let attempt = 0; attempt < 100; attempt += 1) {
    const candidate = `${prefix}${fourDigitSuffix(args.userId, attempt)}`;
    if (isValidUsername(candidate) && (await isUsernameAvailable(ctx, candidate, args.userId))) {
      return candidate;
    }
  }

  return `${prefix.slice(0, USERNAME_PREFIX_MAX_LENGTH - USERNAME_SUFFIX_LENGTH)}${fourDigitSuffix(args.userId, 999)}`;
}

export async function resolveUsernameForUser(
  ctx: MutationCtx,
  user: { _id: Id<"users">; name: string; email: string; username?: string },
  preferred?: string,
): Promise<string> {
  const existing = user.username?.trim().toLowerCase();
  if (existing) {
    return existing;
  }

  const normalizedPreferred = preferred ? normalizeUsernameInput(preferred) : "";
  if (normalizedPreferred) {
    if (!isValidUsername(normalizedPreferred)) {
      throw new Error(
        "Username must be 3–30 characters: lowercase letters, numbers, and underscores only.",
      );
    }
    if (!(await isUsernameAvailable(ctx, normalizedPreferred, user._id))) {
      throw new Error("Username already taken");
    }
    return normalizedPreferred;
  }

  return await generateUniqueUsername(ctx, {
    name: user.name,
    email: user.email,
    userId: user._id,
  });
}
