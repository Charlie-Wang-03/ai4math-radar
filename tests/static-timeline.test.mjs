import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";

const root = path.resolve(fileURLToPath(new URL("..", import.meta.url)));
const script = readFileSync(path.join(root, "static/aihot.js"), "utf8");

test("static pages never invent 08:00 for legacy date-only publication data", () => {
  const dir = mkdtempSync(path.join(tmpdir(), "ai4math-static-"));
  try {
    const build = spawnSync(process.execPath, ["scripts/build-static-chatgpt.ts"], {
      cwd: root,
      env: { ...process.env, STATIC_OUT_DIR: dir },
      encoding: "utf8",
      timeout: 120000,
    });
    assert.equal(build.status, 0, `static build failed: ${build.stdout}\n${build.stderr}`);
    const html = readFileSync(path.join(dir, "index.html"), "utf8");
    const items = readFileSync(path.join(root, "portable/content/selected.jsonl"), "utf8")
      .split(/\r?\n/).filter(Boolean).map((line) => JSON.parse(line));
    const dayOnly = items.filter((item) => item.publishedAtPrecision === "day"
      || (!item.publishedAtPrecision && /^\d{4}-\d{2}-\d{2}T00:00:00(?:\.0+)?Z$/.test(item.publishedAt ?? "")));
    assert.equal((html.match(/class="time precision-day"/g) ?? []).length, dayOnly.length);
    assert.equal((html.match(/data-feed-item-shell/g) ?? []).length, items.length);

    // The Oct 15 production screenshot is a regression target, but curation may add
    // entries or verify midnight timestamps later. Compute expected counts from source.
    const isDayOnly = (item) => item.publishedAtPrecision === "day"
      || (!item.publishedAtPrecision && /^\d{4}-\d{2}-\d{2}T00:00:00(?:\.0+)?Z$/.test(item.publishedAt ?? ""));
    const displayedDay = (item) => isDayOnly(item)
      ? item.publishedAt.slice(0, 10)
      : new Date(Date.parse(item.publishedAt ?? item.discoveredAt) + 8 * 3600_000).toISOString().slice(0, 10);
    const oct15Items = items.filter((item) => displayedDay(item) === "2026-10-15");
    const oct15 = [...html.matchAll(/<section class="day" data-day>([\s\S]*?)<\/section>/g)]
      .map((match) => match[1]).find((section) => section.includes("10月15日"));
    assert.equal(Boolean(oct15), oct15Items.length > 0);
    if (oct15) {
      assert.equal((oct15.match(/data-feed-item-shell/g) ?? []).length, oct15Items.length);
      assert.equal((oct15.match(/class="time precision-day"/g) ?? []).length, oct15Items.filter(isDayOnly).length);
      for (const item of oct15Items) {
        if (isDayOnly(item)) {
          assert.ok(oct15.includes('datetime="' + item.publishedAt.slice(0, 10) + '" class="time precision-day"'));
        } else if (item.publishedAt) {
          const beijingClock = new Date(Date.parse(item.publishedAt) + 8 * 3600_000).toISOString().slice(11, 16);
          assert.ok(oct15.includes('datetime="' + item.publishedAt + '" class="time" title="北京时间">' + beijingClock + '</time>'));
        }
      }
    }
    assert.match(html, /data-filter-empty/);
    assert.match(html, /data-day-count/);
    assert.match(html, /时间为北京时间/);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

class FakeClassList {
  constructor(initial = []) { this.classes = new Set(initial); }
  add(value) { this.classes.add(value); }
  remove(value) { this.classes.delete(value); }
  contains(value) { return this.classes.has(value); }
  toggle(value, force) {
    const active = force === undefined ? !this.contains(value) : Boolean(force);
    if (active) this.add(value); else this.remove(value);
    return active;
  }
}

class FakeElement {
  constructor({ classes = [], dataset = {}, attrs = {}, tagName = "DIV", textContent = "" } = {}) {
    this.classList = new FakeClassList(classes);
    this.dataset = dataset;
    this.attrs = { ...attrs };
    this.tagName = tagName;
    this.textContent = textContent;
    this.children = [];
    this.parent = null;
    this.listeners = new Map();
    this.value = "";
  }
  append(child) { child.parent = this; this.children.push(child); return child; }
  setAttribute(k, v) { this.attrs[k] = v; }
  addEventListener(k, fn) { this.listeners.set(k, fn); }
  focus() {}
  descendants() { return this.children.flatMap((child) => [child, ...child.descendants()]); }
  matches(selector) {
    if (selector === "[data-day]") return "day" in this.attrs;
    if (selector === "[data-feed-item-shell]") return "feedItemShell" in this.attrs;
    if (selector === "[data-feed-item]") return "feedItem" in this.attrs;
    if (selector === "[data-day-count]") return "dayCount" in this.attrs;
    if (selector === "[data-filter-empty]") return "filterEmpty" in this.attrs;
    if (selector === "[data-search]") return "search" in this.attrs;
    if (selector === "[data-star-id]") return "starId" in this.dataset;
    if (selector === "[data-theme-choice]") return "themeChoice" in this.dataset;
    if (selector === ".tabs .tab[data-category]") {
      return this.classList.contains("tab") && "category" in this.dataset
        && this.ancestors().some((a) => a.classList.contains("tabs"));
    }
    throw Error("unexpected selector: " + selector);
  }
  ancestors() {
    const result = [];
    for (let node = this.parent; node; node = node.parent) result.push(node);
    return result;
  }
  closest(selector) {
    for (let node = this; node; node = node.parent) if (node.matches(selector)) return node;
    return null;
  }
  querySelectorAll(selector) { return this.descendants().filter((node) => node.matches(selector)); }
  querySelector(selector) { return this.querySelectorAll(selector)[0] ?? null; }
}

function makeBrowser({ categoryFromUrl = "all", starred = false } = {}) {
  const documentElement = new FakeElement();
  const body = new FakeElement({ dataset: { view: starred ? "starred" : "home" } });
  const tabs = body.append(new FakeElement({ classes: ["tabs"] }));
  const allTab = tabs.append(new FakeElement({ classes: ["tab", "active"], dataset: { category: "all" }, tagName: "BUTTON" }));
  const evaluationTab = tabs.append(new FakeElement({ classes: ["tab"], dataset: { category: "evaluation" }, tagName: "BUTTON" }));
  const ecosystemTab = tabs.append(new FakeElement({ classes: ["tab"], dataset: { category: "ecosystem" }, tagName: "BUTTON" }));
  const search = body.append(new FakeElement({ attrs: { search: true }, tagName: "INPUT" }));
  const groups = [];
  const entries = [];

  function day(spec) {
    const root = body.append(new FakeElement({ attrs: { day: true } }));
    const counter = root.append(new FakeElement({ attrs: { dayCount: true }, textContent: String(spec.length) }));
    for (const [id, category, searchText] of spec) {
      const slot = root.append(new FakeElement({ classes: ["slot"], attrs: { feedItemShell: true } }));
      const time = slot.append(new FakeElement({ classes: ["time"] }));
      const rail = slot.append(new FakeElement({ classes: ["rail"] }));
      const card = slot.append(new FakeElement({ classes: ["feed-card"], dataset: { category, search: searchText }, attrs: { feedItem: true } }));
      const star = card.append(new FakeElement({ dataset: { starId: id }, tagName: "BUTTON" }));
      entries.push({ id, slot, time, rail, card, star });
    }
    groups.push({ root, counter });
  }
  day([["eval-1", "evaluation", "lean verification"], ["eco-1", "ecosystem", "institution"], ["formal-1", "formal-math", "math"]]);
  day([["eco-2", "ecosystem", "announcement"]]);
  const empty = body.append(new FakeElement({ classes: ["hidden"], attrs: { filterEmpty: true } }));
  const location = { href: "https://example.org/ai4math-radar/" + (categoryFromUrl === "all" ? "" : "?category=" + categoryFromUrl) };
  const storage = new Map();
  const handlers = new Map();
  const document = {
    documentElement, body, activeElement: null,
    querySelector: (selector) => body.querySelector(selector),
    querySelectorAll: (selector) => body.querySelectorAll(selector),
    addEventListener: (event, fn) => handlers.set("document:" + event, fn),
  };
  const window = { addEventListener: (event, fn) => handlers.set("window:" + event, fn) };
  const localStorage = {
    getItem: (key) => storage.get(key) ?? null,
    setItem: (key, val) => storage.set(key, val),
  };
  const history = { replaceState: (_state, _title, href) => { location.href = String(href); } };
  const matchMedia = () => ({ matches: true, addEventListener() {} });
  vm.runInNewContext(script, { document, window, localStorage, history, location, matchMedia, URL, Element: FakeElement,
    addEventListener: (event, fn) => handlers.set("global:" + event, fn) }, { timeout: 3000 });
  function click(target) {
    handlers.get("document:click")({ target, preventDefault() {} });
  }
  return { entries, groups, empty, search, click, allTab, evaluationTab, ecosystemTab, location, handlers, storage };
}

test("category filtering hides full time/rail slots, updates day counts, and leaves no ghost nodes", () => {
  const b = makeBrowser();
  b.click(b.evaluationTab);
  assert.equal(b.entries.filter((e) => !e.slot.classList.contains("hidden")).length, 1);
  assert.equal(b.entries[0].slot.classList.contains("is-last-visible"), true);
  assert.equal(b.groups[0].counter.textContent, "1");
  assert.equal(b.groups[1].root.classList.contains("hidden"), true);
  assert.equal(b.empty.classList.contains("hidden"), true);
  assert.equal(new URL(b.location.href).searchParams.get("category"), "evaluation");
  b.click(b.entries[1].card);
  assert.equal(new URL(b.location.href).searchParams.get("category"), "evaluation", "clicking an article must not change the filter");
  b.search.value = "no-such-article";
  b.search.listeners.get("input")();
  assert.equal(b.entries.every((e) => e.slot.classList.contains("hidden")), true);
  assert.equal(b.empty.classList.contains("hidden"), false);
  b.search.value = "";
  b.click(b.allTab);
  assert.equal(b.entries.every((e) => !e.slot.classList.contains("hidden")), true);
  assert.equal(b.groups[0].counter.textContent, "3");
});

test("category query loads on initial page, and starred filter has no empty time markers", () => {
  const filtered = makeBrowser({ categoryFromUrl: "evaluation" });
  assert.equal(filtered.entries[0].slot.classList.contains("hidden"), false);
  assert.equal(filtered.entries[1].slot.classList.contains("hidden"), true);
  const starred = makeBrowser({ starred: true });
  assert.equal(starred.entries.every((e) => e.slot.classList.contains("hidden")), true);
  assert.equal(starred.empty.classList.contains("hidden"), false);
  starred.click(starred.entries[0].star);
  assert.equal(starred.entries[0].slot.classList.contains("hidden"), false);
  assert.equal(starred.entries.slice(1).every((e) => e.slot.classList.contains("hidden")), true);
  assert.equal(starred.groups[0].counter.textContent, "1");
});


test("portable precision contract permits verified midnight and rejects unsupported metadata", async () => {
  const { validatePortableV1Item } = await import("../scripts/portable-v1-core.ts");
  const fixture = {
    id: "2026-10-15-verified-midnight", title: "Verified midnight release", originalTitle: null,
    summary: null, source: { name: "Evidence" },
    links: { aihot: "https://example.org/items/verified/", original: "https://example.org/release" },
    publishedAt: "2026-10-15T00:00:00.000Z", discoveredAt: "2026-10-15T01:00:00.000Z",
    category: "evaluation", score: 92, selected: true, reason: null,
    attribution: { name: "Evidence", url: "https://example.org/release" },
    publishedAtPrecision: "minute",
  };
  assert.equal(validatePortableV1Item(fixture).publishedAtPrecision, "minute");
  assert.equal(validatePortableV1Item({ ...fixture, publishedAtPrecision: "day" }).publishedAtPrecision, "day");
  assert.throws(() => validatePortableV1Item({ ...fixture, publishedAtPrecision: "hour" }), /publishedAtPrecision/);
  assert.throws(() => validatePortableV1Item({ ...fixture, publishedAt: null }), /publishedAtPrecision requires publishedAt/);
});


test("static item detail has two evidence-labelled times without changing timeline sort", () => {
  const dir = mkdtempSync(path.join(tmpdir(), "ai4math-chronology-"));
  try {
    const built = spawnSync(process.execPath, ["scripts/build-static-chatgpt.ts"], {
      cwd: root, env: { ...process.env, STATIC_OUT_DIR: dir },
      encoding: "utf8", timeout: 120000,
    });
    assert.equal(built.status, 0, built.stderr || built.stdout);
    const getItem = (id) => readFileSync(path.join(dir, "items", id, "index.html"), "utf8");
    const wormald = getItem("2026-10-22-wormald-tournament-hamilton-lean");
    assert.match(wormald, /data-chronology-earliest/);
    assert.match(wormald, /首次已核实公开记录/);
    assert.match(wormald, /本次报道里程碑/);
    assert.match(wormald, /2026-10-14 17:27:13/); // GitHub release UTC+8
    const reference = JSON.parse(readFileSync(path.join(root, "portable/content/selected.jsonl"), "utf8")
      .split(/\r?\n/).find(line => line.includes('"id":"2026-10-22-wormald-tournament-hamilton-lean"')));
    const milestone = reference.chronology.milestone;
    if (milestone.precision === "day") {
      assert.ok(wormald.includes("仅核实日期（UTC）"));
    } else {
      const bj = new Date(Date.parse(milestone.at) + 8 * 3600_000).toISOString().replace("T", " ").slice(0, 19);
      assert.ok(wormald.includes(bj), "exact-time milestone should render in Beijing time");
      assert.ok(wormald.includes('datetime="' + milestone.at + '"'));
    }
    assert.match(wormald, /releases\/tag\/v1\.0\.0/);
    assert.match(wormald, /2610\.00460v1/);
    assert.doesNotMatch(wormald, /未注明<\/time>/);

    const unknown = getItem("2026-10-20-tao-tenth-discriminant-ai-challenge");
    assert.match(unknown, /data-chronology-earliest/);
    assert.match(unknown, /尚无独立核验的更早公开记录/);
    assert.match(unknown, /2026-10-20（历史归档日期）/);
    assert.doesNotMatch(unknown, /chronology-evidence/);
    assert.doesNotMatch(unknown, /08:00/);

    const home = readFileSync(path.join(dir,"index.html"),"utf8");
    assert.match(home, /class="time precision-day"/);
    assert.equal((home.match(/data-feed-item-shell/g)??[]).length,
      readFileSync(path.join(root,"portable/content/selected.jsonl"),"utf8").split(/\r?\n/).filter(Boolean).length);
  } finally {
    rmSync(dir,{recursive:true,force:true});
  }
});
