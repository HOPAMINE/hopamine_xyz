function hashString(seed: string): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = Math.imul(31, hash) + seed.charCodeAt(i);
    hash >>>= 0;
  }
  return hash;
}

/** Stable preview builder number for a user before they claim participation. */
export function derivePreviewBuilderNumber(userSeed: string): number {
  return (hashString(userSeed) % 999) + 1;
}

/** Stable 8-digit reference id for a user. */
export function deriveReferenceId(userSeed: string): string {
  const digits = 10_000_000 + (hashString(`${userSeed}:reference`) % 90_000_000);
  return `REFERENCE ID: #${digits}`;
}

export function formatBuilderLabel(builderNumber: number): string {
  return `BUILDER #${builderNumber}`;
}
