export function trimProfileText(value: unknown): string {
  if (typeof value === "string") return value.trim();
  if (Array.isArray(value)) return value.map(String).join(", ").trim();
  if (value == null) return "";
  return String(value).trim();
}

export function skillsToFormText(value: unknown): string {
  if (Array.isArray(value)) {
    return value.map((item) => trimProfileText(item)).filter(Boolean).join(", ");
  }
  return trimProfileText(value);
}

export function parseSkillsInput(input: string): string[] {
  return input
    .split(/[,;\n]/)
    .map((part) => part.trim())
    .filter(Boolean);
}

export function normalizeSkills(value: unknown): string[] | undefined {
  if (value === undefined) return undefined;
  if (Array.isArray(value)) {
    const items = value.map((item) => trimProfileText(item)).filter(Boolean);
    return items.length > 0 ? items : undefined;
  }
  const parsed = parseSkillsInput(trimProfileText(value));
  return parsed.length > 0 ? parsed : undefined;
}
