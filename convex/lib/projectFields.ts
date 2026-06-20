import { v } from "convex/values";

export const PROJECT_FIELD_KEYS = [
  "Circular",
  "Civic",
  "Learning",
  "Food",
  "Coordination",
  "DeepTech",
  "Maps",
  "Other",
] as const;

export type ProjectField = (typeof PROJECT_FIELD_KEYS)[number];

export const projectFieldValidator = v.union(
  v.literal("Circular"),
  v.literal("Civic"),
  v.literal("Learning"),
  v.literal("Food"),
  v.literal("Coordination"),
  v.literal("DeepTech"),
  v.literal("Maps"),
  v.literal("Other"),
);
