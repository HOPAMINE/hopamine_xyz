/** Matches `--accent-events` / `bg-accent-events` on the projects page. */
export const PARTICIPATION_CARD_GREEN = "#126709";

/** Builder label accent on the card footer. */
export const PARTICIPATION_CARD_GOLD = "#E5C76B";

/**
 * Locked card artwork — do not change path or dimensions without design approval.
 * File: `public/Group 181.svg` (391×322).
 */
export const PARTICIPATION_CARD_HERO_IMAGE = "/Group%20181.svg";
export const PARTICIPATION_CARD_HERO_WIDTH = 391;
export const PARTICIPATION_CARD_HERO_HEIGHT = 322;

/** Display width for the card (matches hero artboard). */
export const PARTICIPATION_CARD_WIDTH = PARTICIPATION_CARD_HERO_WIDTH;

/** Extra footer area below the fixed hero image. */
export const PARTICIPATION_CARD_FOOTER_MIN_HEIGHT = 260;

/** QR code render size in the card footer. */
export const PARTICIPATION_CARD_QR_SIZE = 120;

/** Name size on the card footer — full size at 6 chars, scales down for longer names. */
export const PARTICIPATION_CARD_NAME_FONT_SIZE_BASE = "3.24rem";

export function getParticipationCardNameFontSize(name: string): string {
  const length = name.trim().length;
  if (length <= 6) return PARTICIPATION_CARD_NAME_FONT_SIZE_BASE;
  if (length <= 8) return "2.85rem";
  if (length <= 10) return "2.45rem";
  if (length <= 12) return "2.1rem";
  if (length <= 14) return "1.8rem";
  return "1.55rem";
}

/** Matches card `rounded-[1.875rem]`. */
export const PARTICIPATION_CARD_BORDER_RADIUS = 30;

export const PARTICIPATION_CARD_TOTAL_HEIGHT =
  PARTICIPATION_CARD_HERO_HEIGHT + PARTICIPATION_CARD_FOOTER_MIN_HEIGHT;
