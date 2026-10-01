import { readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { CATEGORIES } from "../industry/taxonomy.ts";
import { parsePortableJsonl, type PortableV1Item } from "./portable-v1-core.ts";

const CATEGORY_KEYS = new Set<string>(CATEGORIES.map((category) => category.key));
const DATED_ID = /^(\d{4}-\d{2}-\d{2})-/;

function assertHttpUrl(value: string, field: string, item: PortableV1Item): void {
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    throw new Error(`${item.id}: ${field} must be an absolute HTTP(S) URL`);
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new Error(`${item.id}: ${field} must use HTTP(S)`);
  }
}

export function validateSelectedContent(text: string): PortableV1Item[] {
  const items = parsePortableJsonl(text);

  for (const item of items) {
    if (!item.selected) {
      throw new Error(`${item.id}: canonical selected content must have selected=true`);
    }

    if (!item.category || !CATEGORY_KEYS.has(item.category)) {
      throw new Error(
        `${item.id}: category must be one of ${[...CATEGORY_KEYS].join(", ")}; got ${String(item.category)}`,
      );
    }

    if (item.score === null || !Number.isFinite(item.score) || item.score < 0 || item.score > 100) {
      throw new Error(`${item.id}: score must be a finite number in [0, 100]`);
    }

    assertHttpUrl(item.links.original, "links.original", item);
    assertHttpUrl(item.links.aihot, "links.aihot", item);

    const expectedPath = `/items/${encodeURIComponent(item.id)}/`;
    const local = new URL(item.links.aihot);
    if (!local.pathname.endsWith(expectedPath)) {
      throw new Error(`${item.id}: links.aihot path must end with ${expectedPath}`);
    }

    const dated = item.id.match(DATED_ID);
    if (dated && item.publishedAt && dated[1] !== item.publishedAt.slice(0, 10)) {
      throw new Error(
        `${item.id}: dated id prefix ${dated[1]} must match publishedAt date ${item.publishedAt.slice(0, 10)}`,
      );
    }

    if (item.publishedAt && Date.parse(item.discoveredAt) < Date.parse(item.publishedAt)) {
      throw new Error(`${item.id}: discoveredAt must not precede publishedAt`);
    }
  }

  return items;
}

function main(): void {
  const target = process.argv[2] ?? "portable/content/selected.jsonl";
  const items = validateSelectedContent(readFileSync(target, "utf8"));
  console.log(`selected-content integrity OK: ${items.length} items`);
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
  main();
}
