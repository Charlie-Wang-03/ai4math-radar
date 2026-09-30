import { mkdirSync, readFileSync, writeFileSync, copyFileSync } from "node:fs";
import path from "node:path";
import { parsePortableJsonl, type PortableV1Item } from "./portable-v1-core.ts";
import { SITE } from "../industry/site.ts";

const ROOT = path.resolve(".");
const OUT = path.resolve(process.env.STATIC_OUT_DIR ?? "static-dist");
const BASE = new URL(process.env.STATIC_BASE_URL ?? "https://charlie-wang-03.github.io/ai4math-radar/");
const BASE_PATH = BASE.pathname.endsWith("/") ? BASE.pathname : BASE.pathname + "/";

function esc(value: unknown): string {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function href(route = ""): string {
  const clean = route.replace(/^\/+/, "");
  return BASE_PATH + clean;
}

function absolute(route = ""): string {
  return new URL(href(route), BASE.origin).toString();
}

function page(title: string, body: string, description = SITE.description): string {
  return `<!doctype html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${esc(absolute(""))}">
<style>
:root{font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI","PingFang SC","Microsoft YaHei",sans-serif;color:#171717;background:#fafafa}
*{box-sizing:border-box} body{margin:0} a{color:inherit}.wrap{max-width:920px;margin:0 auto;padding:24px}.nav{display:flex;gap:16px;align-items:center;padding:18px 0;border-bottom:1px solid #e5e5e5}.brand{font-weight:800;text-decoration:none}.muted{color:#666}.hero{padding:64px 0 32px}.hero h1{font-size:clamp(34px,7vw,64px);line-height:1;margin:0 0 16px}.hero p{font-size:19px;line-height:1.7;max-width:760px}.card{background:#fff;border:1px solid #e7e7e7;border-radius:14px;padding:22px;margin:16px 0}.card h2{margin:0 0 10px;font-size:22px}.meta{font-size:13px;color:#777;display:flex;gap:10px;flex-wrap:wrap}.summary{line-height:1.75}.tag{display:inline-block;background:#f1f1f1;border-radius:999px;padding:3px 9px;margin:4px 5px 0 0;font-size:12px}.score{font-weight:700}.empty{padding:40px;border:1px dashed #bbb;border-radius:14px;background:#fff}.footer{margin-top:64px;padding:24px 0;border-top:1px solid #e5e5e5;color:#666;font-size:14px}.legal{white-space:pre-wrap;line-height:1.75;background:#fff;border:1px solid #e7e7e7;border-radius:14px;padding:24px;overflow-wrap:anywhere}.cta{display:inline-block;margin-right:12px;margin-top:8px;padding:9px 12px;border:1px solid #222;border-radius:9px;text-decoration:none}.small{font-size:13px}
</style>
</head>
<body>
<div class="wrap">
<nav class="nav"><a class="brand" href="${href("")}">${esc(SITE.name)}</a><a href="${href("data/selected.json")}">JSON</a><a href="${href("feed.xml")}">RSS</a><a href="${href("llms.txt")}">llms.txt</a></nav>
${body}
<footer class="footer">AI4Math Radar · static-chatgpt profile · <a href="${href("terms/")}">使用规则</a> · <a href="${href("privacy/")}">隐私说明</a> · <a href="https://github.com/Charlie-Wang-03/ai4math-radar">GitHub</a></footer>
</div>
</body>
</html>`;
}

function itemCard(item: PortableV1Item): string {
  const published = item.publishedAt ? new Date(item.publishedAt).toLocaleDateString("zh-CN") : null;
  return `<article class="card">
<div class="meta"><span>${esc(item.source.name)}</span>${published ? `<span>${esc(published)}</span>` : ""}${item.category ? `<span>${esc(item.category)}</span>` : ""}${item.score !== null ? `<span class="score">Score ${item.score}</span>` : ""}</div>
<h2><a href="${href("items/" + encodeURIComponent(item.id) + "/")}">${esc(item.title)}</a></h2>
${item.summary ? `<p class="summary">${esc(item.summary)}</p>` : ""}
${item.reason ? `<p class="muted small">${esc(item.reason)}</p>` : ""}
<a class="cta" href="${esc(item.links.original)}" rel="noopener noreferrer">原始来源 ↗</a>
</article>`;
}

function write(rel: string, content: string) {
  const target = path.join(OUT, rel);
  mkdirSync(path.dirname(target), { recursive: true });
  writeFileSync(target, content);
}

function xml(value: unknown): string {
  return esc(value);
}

function legalPage(file: string, title: string): string {
  const raw = readFileSync(path.join(ROOT, "industry/pages", file), "utf8");
  return page(`${title} · ${SITE.name}`, `<main><div class="hero"><h1>${esc(title)}</h1></div><div class="legal">${esc(raw)}</div></main>`);
}

const canonicalPath = path.join(ROOT, "portable/content/selected.jsonl");
const items = parsePortableJsonl(readFileSync(canonicalPath, "utf8"))
  .filter((item) => item.selected)
  .sort((a, b) => Date.parse(b.publishedAt ?? b.discoveredAt) - Date.parse(a.publishedAt ?? a.discoveredAt));

mkdirSync(OUT, { recursive: true });

const homeBody = `<main>
<section class="hero"><p class="muted">${esc(SITE.tagline)}</p><h1>${esc(SITE.name)}</h1><p>${esc(SITE.description)}</p><p class="muted">当前使用 <strong>static-chatgpt</strong> 部署：GitHub 保存 canonical data，ChatGPT 负责研究维护，GitHub Pages 负责静态发布。</p></section>
<section><h2>已发布研究动态</h2>
${items.length ? items.map(itemCard).join("\n") : `<div class="empty"><strong>暂无已发布条目。</strong><p class="muted">仓库已完成静态运行准备，但不会把 synthetic 示例当作正式 AI4Math 情报。真实条目将在完成证据核验后由 ChatGPT 提交。</p></div>`}
</section>
</main>`;

write("index.html", page(SITE.homeTitle, homeBody));
write("404.html", page(`未找到 · ${SITE.name}`, `<main class="hero"><h1>404</h1><p>页面不存在。</p><a class="cta" href="${href("")}">返回首页</a></main>`));

for (const item of items) {
  const body = `<main><div class="hero"><p class="muted">${esc(item.source.name)}</p><h1>${esc(item.title)}</h1></div>
<div class="card">${item.summary ? `<p class="summary">${esc(item.summary)}</p>` : ""}${item.reason ? `<p class="muted">${esc(item.reason)}</p>` : ""}
<p><a class="cta" href="${esc(item.links.original)}" rel="noopener noreferrer">阅读原始来源 ↗</a></p></div></main>`;
  write(path.join("items", encodeURIComponent(item.id), "index.html"), page(`${item.title} · ${SITE.name}`, body, item.summary ?? SITE.description));
}

write("data/selected.json", JSON.stringify({ schemaVersion: 1, generatedAt: new Date().toISOString(), count: items.length, items }, null, 2) + "\n");
copyFileSync(canonicalPath, path.join(OUT, "data/selected.jsonl"));

const rssItems = items.slice(0, 50).map((item) => `<item><title>${xml(item.title)}</title><link>${xml(item.links.original)}</link><guid isPermaLink="false">${xml(item.id)}</guid><pubDate>${new Date(item.publishedAt ?? item.discoveredAt).toUTCString()}</pubDate><description>${xml(item.summary ?? "")}</description></item>`).join("");
write("feed.xml", `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>${xml(SITE.name)}</title><link>${xml(absolute(""))}</link><description>${xml(SITE.description)}</description>${rssItems}</channel></rss>`);

write("llms.txt", `# ${SITE.name}

> ${SITE.description}

Current deployment profile: static-chatgpt.
Canonical selected content: ${absolute("data/selected.jsonl")}
JSON index: ${absolute("data/selected.json")}
RSS: ${absolute("feed.xml")}
GitHub repository: https://github.com/Charlie-Wang-03/ai4math-radar

This static deployment does not expose the native live REST API, remote MCP server, admin console, or continuous worker.
`);

write("robots.txt", `User-agent: *\nAllow: /\nSitemap: ${absolute("sitemap.xml")}\n`);
const urls = ["", "terms/", "privacy/", ...items.map((item) => "items/" + encodeURIComponent(item.id) + "/")];
write("sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.map((u) => `<url><loc>${xml(absolute(u))}</loc></url>`).join("")}</urlset>`);
write("terms/index.html", legalPage("terms.md", "使用规则"));
write("privacy/index.html", legalPage("privacy.md", "隐私说明"));
write(".nojekyll", "");

console.log(JSON.stringify({ out: OUT, base: BASE.toString(), itemCount: items.length }, null, 2));
