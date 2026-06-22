export function normalizeUsername(username: string): string {
  return username.trim().toLowerCase();
}

export function getPublicProfilePath(user: { username?: string; _id: string }): string {
  const username = user.username?.trim();
  if (username) {
    return `/profile/${encodeURIComponent(normalizeUsername(username))}`;
  }
  return `/profile/id/${user._id}`;
}

export function getPublicProfileUrl(origin: string, username: string): string {
  return `${origin}/profile/${encodeURIComponent(normalizeUsername(username))}`;
}
