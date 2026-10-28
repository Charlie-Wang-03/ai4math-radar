// Optional chronology evidence separates a news milestone from an earlier public appearance.
// UTC calendar-day precision is explicit; never infer a clock from a day-only record.
export type ChronologyPrecision = "day" | "minute" | "second";
export type ChronologyEvidenceKind =
  | "hexagon-v1" | "github-release" | "arxiv-announcement"
  | "wordpress-original" | "institution-announcement" | "proof-registry"
  | "original-research-page" | "other";
export type ChronologyEventKind =
  | "research-result" | "paper-release" | "proof-artifact-release"
  | "registry-release" | "institution-announcement" | "other";

export interface ChronologyMoment {
  date: string; // UTC calendar day of the observed public milestone
  precision: ChronologyPrecision;
  at?: string; // canonical UTC timestamp, supported only at minute/second precision
  evidenceUrl: string;
  evidenceKind: ChronologyEvidenceKind;
}
export interface ChronologyRecord {
  eventKind: ChronologyEventKind;
  milestone: ChronologyMoment;
  /** Earliest independently inspectable public evidence, not absolute first discovery. */
  earliestVerifiedPublic?: ChronologyMoment;
}

export interface PortableV1Item {
  id: string;
  title: string;
  originalTitle: string | null;
  summary: string | null;
  source: { name: string };
  links: { aihot: string; original: string };
  publishedAt: string | null;
  /** Optional evidence-backed publication precision. Legacy UTC-midnight timestamps default to date-only in the static view. */
  publishedAtPrecision?: "day" | "minute" | "second";
  /** Optional evidence-rich chronology extension. IDs and legacy publishedAt remain stable. */
  chronology?: ChronologyRecord;
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
  const precision = v.publishedAtPrecision;
  if (precision !== undefined && precision !== "day" && precision !== "minute" && precision !== "second") {
    throw new Error(`line ${line}: publishedAtPrecision must be day, minute, or second`);
  }
  if (publishedAt === null && precision !== undefined) throw new Error(`line ${line}: publishedAtPrecision requires publishedAt`);

  const chronology = v.chronology;
  const eventKinds = new Set<ChronologyEventKind>(["research-result", "paper-release", "proof-artifact-release", "registry-release", "institution-announcement", "other"]);
  const evidenceKinds = new Set<ChronologyEvidenceKind>(["hexagon-v1", "github-release", "arxiv-announcement", "wordpress-original", "institution-announcement", "proof-registry", "original-research-page", "other"]);
  const parseMoment = (value: unknown, field: string): ChronologyMoment => {
    if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error(`line ${line}: ${field} must be an object`);
    const obj = value as Record<string, unknown>;
    if (typeof obj.date !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(obj.date) || Number.isNaN(Date.parse(obj.date+"T00:00:00Z"))) {
      throw new Error(`line ${line}: ${field}.date must be YYYY-MM-DD`);
    }
    if (obj.precision !== "day" && obj.precision !== "minute" && obj.precision !== "second") {
      throw new Error(`line ${line}: ${field}.precision invalid`);
    }
    if (typeof obj.evidenceUrl !== "string" || !/^https?:\/\//.test(obj.evidenceUrl)) {
      throw new Error(`line ${line}: ${field}.evidenceUrl must be HTTP(S)`);
    }
    if (!evidenceKinds.has(obj.evidenceKind as ChronologyEvidenceKind)) throw new Error(`line ${line}: ${field}.evidenceKind invalid`);
    if (obj.precision === "day") {
      if (obj.at !== undefined) throw new Error(`line ${line}: ${field} day-precision cannot assert .at`);
    } else if (typeof obj.at !== "string" || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/.test(obj.at)
      || !Number.isFinite(Date.parse(obj.at)) || obj.at.slice(0, 10) !== obj.date) {
      throw new Error(`line ${line}: ${field}.at must be a valid UTC instant on the stated calendar date`);
    }
    return {
      date: obj.date, precision: obj.precision,
      ...(typeof obj.at === "string" ? {at:obj.at}:{}),
      evidenceUrl: obj.evidenceUrl, evidenceKind: obj.evidenceKind as ChronologyEvidenceKind
    };
  };
  let parsedChronology: ChronologyRecord | undefined;
  if (chronology !== undefined) {
    if (!chronology || typeof chronology !== "object" || Array.isArray(chronology)) throw new Error(`line ${line}: chronology must be an object`);
    const o = chronology as Record<string, unknown>;
    if (!eventKinds.has(o.eventKind as ChronologyEventKind)) throw new Error(`line ${line}: chronology.eventKind invalid`);
    const milestone = parseMoment(o.milestone, "chronology.milestone");
    const earliestVerifiedPublic = o.earliestVerifiedPublic === undefined ? undefined : parseMoment(o.earliestVerifiedPublic, "chronology.earliestVerifiedPublic");
    if (earliestVerifiedPublic && earliestVerifiedPublic.date > milestone.date) {
      throw new Error(`line ${line}: earliest public evidence cannot be later than the reported milestone`);
    }
    parsedChronology = {
      eventKind: o.eventKind as ChronologyEventKind, milestone,
      ...(earliestVerifiedPublic ? { earliestVerifiedPublic } : {}),
    };
  }

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
    ...(precision !== undefined ? { publishedAtPrecision: precision as "day" | "minute" | "second" } : {}),
    ...(parsedChronology ? { chronology: parsedChronology } : {}),
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
