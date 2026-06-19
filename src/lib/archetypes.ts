export const ARCHETYPE_BADGES = [
  { id: "seedcaster", emoji: "🌱", title: "THE SEEDCASTER", quote: "They plant what others haven't imagined yet." },
  { id: "fabricant", emoji: "⚙️", title: "THE FABRICANT", quote: "If it doesn't exist, they build it." },
  { id: "mycelian", emoji: "🍄", title: "THE MYCELIAN", quote: "They think in networks and grow in the dark." },
  { id: "terraformer", emoji: "🏗️", title: "THE TERRAFORMER", quote: "They redesign the spaces we inhabit." },
  { id: "developer", emoji: "💻", title: "THE DEVELOPER", quote: "They write the tools of sovereignty." },
  { id: "artisan", emoji: "🎨", title: "THE ARTISAN", quote: "They make the future beautiful enough to want." },
  { id: "chronicler", emoji: "📡", title: "THE CHRONICLER", quote: "They make sure the work gets seen." },
  { id: "cultivar", emoji: "🌿", title: "THE CULTIVAR", quote: "They bridge the lab and the land." },
  { id: "loomkeeper", emoji: "🔗", title: "THE LOOMKEEPER", quote: "They hold the network together." },
  { id: "verdant", emoji: "📜", title: "THE VERDANT", quote: "They change the rules of the game." },
] as const;

export type ArchetypeId = (typeof ARCHETYPE_BADGES)[number]["id"];

export function joinArchetypeList(items: string[]) {
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} & ${items[1]}`;
  return `${items.slice(0, -1).join(", ")} & ${items[items.length - 1]}`;
}
