import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import {
  CATEGORIES,
  CATEGORY_TAGS,
  ENTITY_TAGS,
  ITEM_TYPES,
  TOPIC_TAGS,
  ENTITIES,
} from "@aihot/industry/taxonomy";

test("AI4Math domain model keeps the intended stable surface", () => {
  assert.deepEqual(
    CATEGORIES.map((c) => c.key),
    ["math-reasoning", "theorem-proving", "formal-math", "math-discovery", "evaluation", "ecosystem"],
  );
  assert.deepEqual(
    ITEM_TYPES,
    ["model_release", "product_launch", "tool_or_prompt", "research_paper", "industry_event", "opinion_analysis", "tutorial_explainer"],
  );
  assert.ok(CATEGORY_TAGS.includes("论文/研究"));
  assert.ok(TOPIC_TAGS.includes("自动定理证明"));
  assert.ok(TOPIC_TAGS.includes("自动形式化"));
  assert.ok(ENTITY_TAGS.includes("Lean"));
  assert.ok(ENTITY_TAGS.includes("Mathlib"));
});

test("every AI4Math topic reference resolves and every tag belongs to the vocabulary", () => {
  const data = JSON.parse(readFileSync(new URL("../industry/topics.json", import.meta.url), "utf8")) as {
    groups: Array<{ key: string }>;
    topics: Array<{ slug: string; group: string; tags: string[]; related?: string[] }>;
  };
  const groups = new Set(data.groups.map((g) => g.key));
  const slugs = new Set(data.topics.map((t) => t.slug));
  const allowed = new Set<string>([...CATEGORY_TAGS, ...TOPIC_TAGS, ...ENTITY_TAGS]);

  assert.equal(slugs.size, data.topics.length, "topic slugs are unique");
  for (const topic of data.topics) {
    assert.ok(groups.has(topic.group), `unknown topic group: ${topic.group}`);
    for (const related of topic.related ?? []) assert.ok(slugs.has(related), `missing related topic: ${topic.slug} -> ${related}`);
    for (const tag of topic.tags) {
      if (tag.startsWith("entity:")) continue;
      assert.ok(allowed.has(tag), `unknown topic tag: ${topic.slug} -> ${tag}`);
    }
  }
});


test("AI4Math V1 source pack stays small, unique, and compatible with the domain vocabulary", () => {
  const data = JSON.parse(readFileSync(new URL("../industry/sources.json", import.meta.url), "utf8")) as {
    sources: Array<{
      id: string;
      kind: string;
      tier: string;
      owner_entity_id: string | null;
      participation_mode: string;
      config: { feedUrl?: string };
    }>;
  };
  assert.equal(data.sources.length, 9, "V1 source pack is intentionally small");
  assert.equal(new Set(data.sources.map((s) => s.id)).size, data.sources.length, "source ids are unique");
  for (const source of data.sources) {
    assert.equal(source.kind, "rss", `${source.id} should remain a dependency-free feed in V1`);
    assert.equal(source.participation_mode, "editorial");
    assert.ok(["T1", "T1_5", "T2"].includes(source.tier), `unexpected tier: ${source.id}`);
    assert.ok(source.config.feedUrl?.startsWith("https://"), `feed URL must be HTTPS: ${source.id}`);
    if (source.owner_entity_id) assert.ok(source.owner_entity_id in ENTITIES, `unknown owner entity: ${source.id}`);
  }
});


test("public legal pages contain no template placeholders", () => {
  for (const file of ["terms.md", "privacy.md"]) {
    const text = readFileSync(new URL(`../industry/pages/${file}`, import.meta.url), "utf8");
    assert.doesNotMatch(text, /请填写|0\.1（模板）|开源框架自带的模板/);
    assert.match(text, /AI4Math Radar/);
    assert.match(text, /2026-09-30/);
  }
});
