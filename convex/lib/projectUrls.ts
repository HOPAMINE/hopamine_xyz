export function normalizeOptionalProjectUrl(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  if (!trimmed) {
    return undefined;
  }

  const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;

  try {
    const parsed = new URL(withProtocol);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      throw new Error("Invalid URL");
    }
    return parsed.toString();
  } catch {
    throw new Error("Enter a valid website URL");
  }
}

export function primaryProjectLink(
  project: {
    liveUrl?: string;
    demoUrl?: string;
    repoUrl?: string;
  },
): string | undefined {
  return project.liveUrl ?? project.demoUrl ?? project.repoUrl;
}
