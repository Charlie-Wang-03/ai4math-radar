export interface PortableV1Item {
  id: string;
  title: string;
  originalTitle: string | null;
  summary: string | null;
  source: { name: string };
  links: { aihot: string; original: string };
  publishedAt: string | null;
  discoveredAt: string;
  category: string | null;
  score: number | null;
  selected: boolean;
  reason: string | null;
  attribution: { name: string; url: string };
}

function isIsoDate(value: unknown): value is string {
  return typeof value === "string" && !Number.isNaN(new Date(value).getTime());
}

export function validatePortableV1Item(value: unknown, line = 1): PortableV1Item {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error(`line ${line}: item must be an object`);
  }
  const v = value as Record<string, unknown>;
  const req = (key: string) => {
    const x = v[key];
    if (typeof x !== "string" || !x.trim()) throw new Error(`line ${line}: ${key} must be a non-empty string`);
    return x;
  };
  const nullableString = (key: string) => {
    const x = v[key];
    if (x === null) return null;
    if (typeof x !== "string") throw new Error(`line ${line}: ${key} must be a string or null`);
    return x;
  };
  const source = v.source;
  if (!source || typeof source !== "object" || Array.isArray(source) || typeof (source as { name?: unknown }).name !== "string") {
    throw new Error(`line ${line}: source.name must be a string`);
  }
  const links = v.links;
  if (!links || typeof links !== "object" || Array.isArray(links)) throw new Error(`line ${line}: links must be an object`);
  const aihot = (links as { aihot?: unknown }).aihot;
  const original = (links as { original?: unknown }).original;
  if (typeof aihot !== "string" || typeof original !== "string") throw new Error(`line ${line}: links.aihot and links.original must be strings`);

  const attribution = v.attribution;
  if (!attribution || typeof attribution !== "object" || Array.isArray(attribution)) throw new Error(`line ${line}: attribution must be an object`);
  const attributionName = (attribution as { name?: unknown }).name;
  const attributionUrl = (attribution as { url?: unknown }).url;
  if (typeof attributionName !== "string" || typeof attributionUrl !== "string") throw new Error(`line ${line}: attribution fields must be strings`);

  const publishedAt = v.publishedAt;
  if (publishedAt !== null && !isIsoDate(publishedAt)) throw new Error(`line ${line}: publishedAt must be an ISO date or null`);
  if (!isIsoDate(v.discoveredAt)) throw new Error(`line ${line}: discoveredAt must be an ISO date`);

  if (v.category !== null && typeof v.category !== "string") throw new Error(`line ${line}: category must be a string or null`);
  if (v.score !== null && typeof v.score !== "number") throw new Error(`line ${line}: score must be a number or null`);
  if (typeof v.selected !== "boolean") throw new Error(`line ${line}: selected must be a boolean`);

  return {
    id: req("id"),
    title: req("title"),
    originalTitle: nullableString("originalTitle"),
    summary: nullableString("summary"),
    source: { name: (source as { name: string }).name },
    links: { aihot, original },
    publishedAt: publishedAt as string | null,
    discoveredAt: v.discoveredAt as string,
    category: v.category as string | null,
    score: v.score as number | null,
    selected: v.selected,
    reason: nullableString("reason"),
    attribution: { name: attributionName, url: attributionUrl },
  };
}

export function parsePortableJsonl(text: string): PortableV1Item[] {
  const items: PortableV1Item[] = [];
  const ids = new Set<string>();
  for (const [index, raw] of text.split(/\r?\n/).entries()) {
    if (!raw.trim() || raw.trim().startsWith("//")) continue;
    let value: unknown;
    try {
      value = JSON.parse(raw);
    } catch (error) {
      throw new Error(`line ${index + 1}: invalid JSON: ${String(error)}`);
    }
    const item = validatePortableV1Item(value, index + 1);
    if (ids.has(item.id)) throw new Error(`line ${index + 1}: duplicate item id ${item.id}`);
    ids.add(item.id);
    items.push(item);
  }
  return items;
}
