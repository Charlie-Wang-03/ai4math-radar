import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { parsePortableJsonl, validatePortableV1Item } from "../scripts/portable-v1-core.ts";

test("committed portable example satisfies the public-v1 interchange contract", () => {
  const text = readFileSync(new URL("../portable/example/selected.jsonl", import.meta.url), "utf8");
  const items = parsePortableJsonl(text);
  assert.equal(items.length, 1);
  assert.equal(items[0]!.selected, true);
  assert.equal(items[0]!.category, "theorem-proving");
});

test("portable parser rejects duplicate ids and malformed public-v1 fields", () => {
  const valid = {
    id: "x",
    title: "Title",
    originalTitle: null,
    summary: null,
    source: { name: "Source" },
    links: { aihot: "https://example.invalid/items/x", original: "https://example.invalid/source/x" },
    publishedAt: null,
    discoveredAt: "2026-09-30T00:00:00Z",
    category: null,
    score: null,
    selected: false,
    reason: null,
    attribution: { name: "AI4Math Radar", url: "https://example.invalid/items/x" },
  };
  assert.equal(validatePortableV1Item(valid).id, "x");
  assert.throws(() => parsePortableJsonl([JSON.stringify(valid), JSON.stringify(valid)].join("\n")), /duplicate item id/);
  assert.throws(() => validatePortableV1Item({ ...valid, discoveredAt: "not-a-date" }), /discoveredAt/);
  assert.throws(() => validatePortableV1Item({ ...valid, source: {} }), /source\.name/);
});

test("deployment profiles remain explicit and ordered from lightest to native", () => {
  const data = JSON.parse(readFileSync(new URL("../deployment/profiles.json", import.meta.url), "utf8")) as {
    schemaVersion: number;
    interchangeContract: string;
    profiles: Array<{ id: string; canonicalStore: string; persistentServer: boolean }>;
  };
  assert.equal(data.schemaVersion, 1);
  assert.equal(data.interchangeContract, "public-api-v1");
  assert.deepEqual(data.profiles.map((p) => p.id), ["static-chatgpt", "github-automation", "native-aihot"]);
  assert.equal(data.profiles[0]!.canonicalStore, "git");
  assert.equal(data.profiles[0]!.persistentServer, false);
  assert.equal(data.profiles[2]!.canonicalStore, "postgres");
  assert.equal(data.profiles[2]!.persistentServer, true);
});


test("static-chatgpt is the explicit active deployment profile", () => {
  const active = JSON.parse(readFileSync(new URL("../deployment/active.json", import.meta.url), "utf8")) as {
    schemaVersion: number;
    activeProfile: string;
    canonicalContent: string;
  };
  assert.equal(active.schemaVersion, 1);
  assert.equal(active.activeProfile, "static-chatgpt");
  assert.equal(active.canonicalContent, "portable/content/selected.jsonl");

  const canonical = readFileSync(new URL("../portable/content/selected.jsonl", import.meta.url), "utf8");
  assert.deepEqual(parsePortableJsonl(canonical), []);
});
