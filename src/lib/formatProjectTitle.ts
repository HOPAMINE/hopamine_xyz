export function formatProjectTitle(title: string): string {
  return title.replace(/\b[A-Z]{2,}[A-Z0-9]*\b/g, (word) => {
    if (word.length <= 1) return word;
    return word.charAt(0) + word.slice(1).toLowerCase();
  });
}
