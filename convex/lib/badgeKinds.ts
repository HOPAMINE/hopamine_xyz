import { v } from "convex/values";

export const GREEN_HACKATHON_ID = "green-hackathon";

export const badgeKindValidator = v.union(v.literal("green-hackathon-builder"));

export type BadgeKind = "green-hackathon-builder";
