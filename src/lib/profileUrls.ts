export function normalizeUsername(username: string): string {
  return username.trim().toLowerCase();
}

export function getPublicProfileUrl(origin: string, username: string): string {
  return `${origin}/profile/${encodeURIComponent(normalizeUsername(username))}`;
}
