// Export the complete selected-set snapshot from any running AI4Math Radar / AIHOT-compatible v1 API.
// This intentionally depends only on the long-term public API contract, not on direct database access.
//
// Usage:
//   node scripts/export-portable-v1.ts --base https://example.com --out .data/portable/selected.jsonl
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { parseArgs } from "node:util";
import { parsePortableJsonl, validatePortableV1Item } from "./portable-v1-core.ts";

const { values } = parseArgs({
  options: {
    base: { type: "string" },
    out: { type: "string", default: ".data/portable/selected.jsonl" },
    limit: { type: "string", default: "500" },
  },
});

if (!values.base) throw new Error("--base is required");
const base = values.base.replace(/\/$/, "");
const limit = Number(values.limit);
if (!Number.isInteger(limit) || limit < 1 || limit > 1000) throw new Error("--limit must be an integer from 1 to 1000");

const items: unknown[] = [];
let page: string | null = null;
let asOf: string | null = null;
let fields: string | null = null;

for (;;) {
  const url = new URL("/api/v1/selected/snapshot", base);
  url.searchParams.set("limit", String(limit));
  if (page) url.searchParams.set("page", page);

  const res = await fetch(url, {
    headers: {
      "User-Agent": "AI4Math-Radar-Portable-Exporter/1.0",
      Accept: "application/json",
    },
  });
  if (!res.ok) throw new Error(`snapshot request failed: ${res.status} ${res.statusText}`);

  const body = await res.json() as {
    schemaVersion?: unknown;
    asOf?: unknown;
    fields?: unknown;
    count?: unknown;
    hasMore?: unknown;
    nextPage?: unknown;
    items?: unknown;
  };
  if (body.schemaVersion !== 1) throw new Error("unsupported snapshot schemaVersion");
  if (!Array.isArray(body.items)) throw new Error("snapshot items must be an array");
  if (typeof body.asOf !== "string") throw new Error("snapshot asOf must be a string");
  if (typeof body.fields !== "string") throw new Error("snapshot fields must be a string");
  if (body.fields !== "default") throw new Error("portable export requires default fields");
  if (typeof body.hasMore !== "boolean") throw new Error("snapshot hasMore must be a boolean");

  asOf ??= body.asOf;
  fields ??= body.fields;
  if (body.asOf !== asOf) throw new Error("snapshot pagination changed asOf unexpectedly");

  for (const value of body.items) items.push(validatePortableV1Item(value, items.length + 1));

  if (!body.hasMore) break;
  if (typeof body.nextPage !== "string" || !body.nextPage) throw new Error("snapshot hasMore=true without nextPage");
  page = body.nextPage;
}

const jsonl = items.map((item) => JSON.stringify(item)).join("\n") + (items.length ? "\n" : "");
parsePortableJsonl(jsonl); // final duplicate-id and schema check before writing

const out = path.resolve(values.out!);
mkdirSync(path.dirname(out), { recursive: true });
writeFileSync(out, jsonl);

const manifest = {
  schemaVersion: 1,
  contract: "public-api-v1",
  sourceBase: base,
  exportedAt: new Date().toISOString(),
  snapshotAsOf: asOf,
  fields,
  itemCount: items.length,
  dataFile: path.basename(out),
};
writeFileSync(path.join(path.dirname(out), "manifest.json"), JSON.stringify(manifest, null, 2) + "\n");

console.log(JSON.stringify({ out, manifest: path.join(path.dirname(out), "manifest.json"), itemCount: items.length, snapshotAsOf: asOf }, null, 2));
