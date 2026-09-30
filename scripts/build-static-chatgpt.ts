import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { parsePortableJsonl, type PortableV1Item } from "./portable-v1-core.ts";
import { SITE } from "../industry/site.ts";
import { CATEGORIES } from "../industry/taxonomy.ts";

const ROOT = path.resolve(".");
const OUT = path.resolve(process.env.STATIC_OUT_DIR ?? "static-dist");
const BASE = new URL(process.env.STATIC_BASE_URL ?? "https://charlie-wang-03.github.io/ai4math-radar/");
const BASE_PATH = BASE.pathname.endsWith("/") ? BASE.pathname : BASE.pathname + "/";

function esc(value: unknown): string {
  return String(value ?? "").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#39;");
}
function href(route=""): string { return BASE_PATH + route.replace(/^\/+/, ""); }
function absolute(route=""): string { return new URL(href(route), BASE.origin).toString(); }
function write(rel:string, content:string){ const target=path.join(OUT,rel); mkdirSync(path.dirname(target),{recursive:true}); writeFileSync(target,content); }
function xml(value: unknown): string { return esc(value); }

function beijingParts(iso:string){
  const d=new Date(iso);
  const parts=new Intl.DateTimeFormat("zh-CN",{timeZone:"Asia/Shanghai",year:"numeric",month:"2-digit",day:"2-digit",weekday:"long",hour:"2-digit",minute:"2-digit",hour12:false}).formatToParts(d);
  const get=(t:string)=>parts.find(p=>p.type===t)?.value??"";
  return { day:`${get("year")}-${get("month")}-${get("day")}`, date:`${Number(get("month"))}月${Number(get("day"))}日`, weekday:get("weekday"), time:`${get("hour")}:${get("minute")}` };
}
function icon(kind:string):string{
  const icons:Record<string,string>={
    bolt:'<svg viewBox="0 0 24 24"><path d="M13 2.5L4.5 13.5H11l-1 8L19.5 10.5H13z"/></svg>',
    list:'<svg viewBox="0 0 24 24"><path d="M8 6h13M8 12h13M8 18h13"/><circle cx="3.5" cy="6" r="1"/><circle cx="3.5" cy="12" r="1"/><circle cx="3.5" cy="18" r="1"/></svg>',
    flame:'<svg viewBox="0 0 24 24"><path d="M12 22c4 0 7-2.7 7-7 0-3.6-2.4-6.2-4-8-.5 2-1.6 3.4-3 4 .3-3-1-6-4-8 0 4-4 6.5-4 11 0 4.3 3 8 8 8z"/></svg>',
    doc:'<svg viewBox="0 0 24 24"><rect x="5" y="3.5" width="14" height="17" rx="2"/><path d="M8.5 8h7M8.5 12h7M8.5 16h4"/></svg>',
    grid:'<svg viewBox="0 0 24 24"><rect x="3.5" y="3.5" width="7" height="7" rx="1.5"/><rect x="13.5" y="3.5" width="7" height="7" rx="1.5"/><rect x="3.5" y="13.5" width="7" height="7" rx="1.5"/><rect x="13.5" y="13.5" width="7" height="7" rx="1.5"/></svg>',
    bookmark:'<svg viewBox="0 0 24 24"><path d="M6 3.5h12v17l-6-4-6 4z"/></svg>',
    info:'<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8.5"/><path d="M12 11v5M12 8h.01"/></svg>',
    history:'<svg viewBox="0 0 24 24"><path d="M3.5 12a8.5 8.5 0 102.5-6"/><path d="M3.5 4v4h4"/><path d="M12 8v4l2.5 2"/></svg>',
    github:'<svg viewBox="0 0 24 24"><path d="M9 19c-4 1.5-4-2-5-2m10 4v-3.5c0-1 .1-1.5-.5-2 2.8-.3 5.7-1.4 5.7-6.2 0-1.4-.5-2.5-1.3-3.4.1-.3.6-1.6-.1-3.3 0 0-1.1-.3-3.5 1.3a12 12 0 00-6.4 0C5.5 2.3 4.4 2.6 4.4 2.6c-.7 1.7-.2 3-.1 3.3A4.8 4.8 0 003 9.3c0 4.8 2.9 5.9 5.7 6.2-.4.3-.7.8-.8 1.5V21"/></svg>'
  };
  return icons[kind]??"";
}
function navLink(route:string,label:string,iconName:string,active=false,disabled=false){
  const cls=`nav-link${active?" active":""}${disabled?" disabled":""}`;
  if(disabled) return `<span class="${cls}" title="当前 static-chatgpt profile 暂未提供此动态能力"><span class="nav-icon">${icon(iconName)}</span><span>${esc(label)}</span></span>`;
  return `<a class="${cls}" href="${href(route)}"><span class="nav-icon">${icon(iconName)}</span><span>${esc(label)}</span></a>`;
}
function sidebar(active:string){
  return `<aside class="sidebar">
<a class="brand" href="${href("")}"><span class="brand-dot"></span><span>AI4Math&nbsp;Radar</span></a>
<div class="side-scroll">
<section class="nav-section"><div class="nav-title">内容</div>
${navLink("", "精选","bolt",active==="home")}
${navLink("all/","全部 AI4Math 动态","list",active==="all")}
${navLink("hot/","热点榜","flame",false,true)}
${navLink("daily/","AI4Math 日报","doc",false,true)}
${navLink("topics/","主题","grid",active==="topics")}
${navLink("starred/","收藏","bookmark",active==="starred")}
</section>
<section class="nav-section"><div class="nav-title">更多</div>
${navLink("about/","关于","info",active==="about")}
${navLink("changelog/","更新日志","history",active==="changelog")}
<a class="nav-link" href="https://github.com/Charlie-Wang-03/ai4math-radar"><span class="nav-icon">${icon("github")}</span><span>GitHub 开源</span></a>
</section></div>
<div class="sidebar-footer"><div class="theme-switch" aria-label="外观"><button data-theme-choice="dark" title="深色">◐</button><button data-theme-choice="system" title="跟随系统">▣</button><button data-theme-choice="light" title="浅色">☼</button></div></div>
</aside>`;
}
function mobileTabs(active:string){
 return `<nav class="mobile-tabs"><a class="${active==="home"?"active":""}" href="${href("")}">⚡<span>精选</span></a><a class="${active==="all"?"active":""}" href="${href("all/")}">☷<span>全部</span></a><a class="disabled" href="javascript:void(0)">▤<span>日报</span></a><a class="${["topics","starred","about","changelog"].includes(active)?"active":""}" href="${href("about/")}">▦<span>更多</span></a></nav>`;
}
function shell(title:string, body:string, active="home", description=SITE.description, attrs=""){
 return `<!doctype html><html lang="zh-CN" data-theme="dark"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)}</title><meta name="description" content="${esc(description)}"><link rel="canonical" href="${esc(absolute(""))}"><link rel="stylesheet" href="${href("assets/aihot.css")}"><script>try{var p=localStorage.getItem('ai4math-static-theme')||'system';var t=p==='system'?(matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light'):p;document.documentElement.setAttribute('data-theme',t)}catch(e){}</script></head><body ${attrs}><div class="static-shell">${sidebar(active)}<main class="main"><div class="content"><div class="mobile-top"><a class="brand" href="${href("")}"><span class="brand-dot"></span>AI4Math Radar</a><span class="muted">static</span></div>${body}<footer class="footer">AI4Math Radar · 基于 AIHOT 开源框架构建 · <a href="${href("terms/")}">使用规则</a> · <a href="${href("privacy/")}">隐私说明</a></footer></div></main>${mobileTabs(active)}</div><script src="${href("assets/aihot.js")}"></script></body></html>`;
}
function tabs(active="all"){
 return `<div class="tabs" aria-label="筛选"><button class="tab ${active==="all"?"active":""}" data-category="all">全部</button>${CATEGORIES.map(c=>`<button class="tab ${active===c.key?"active":""}" data-category="${esc(c.key)}">${esc(c.label)}</button>`).join("")}</div>`;
}
function feedCard(item:PortableV1Item){
 const search=[item.title,item.summary,item.source.name,item.category,item.reason].filter(Boolean).join(" ");
 return `<article class="card feed-card" data-feed-item data-category="${esc(item.category??"")}" data-search="${esc(search)}">
<header class="feed-head"><span>${esc(item.source.name)}</span><span class="selected-badge">精选</span>${item.score!==null?`<span class="score">AI 评分&nbsp; ${item.score}</span>`:""}<button class="star" data-star-id="${esc(item.id)}" aria-label="收藏">☆</button></header>
<h3 class="feed-title"><a href="${href("items/"+encodeURIComponent(item.id)+"/")}">${esc(item.title)}</a></h3>
${item.summary?`<p class="feed-summary">${esc(item.summary)}</p>`:""}
${item.category?`<a class="category-tag" href="${href("")}?category=${encodeURIComponent(item.category)}">${esc(CATEGORIES.find(c=>c.key===item.category)?.label??item.category)}</a>`:""}
${item.reason?`<div class="reason">推荐理由：${esc(item.reason)}</div>`:""}
</article>`;
}
function timeline(items:PortableV1Item[]){
 if(!items.length) return `<div class="empty"><strong>这个筛选下还没有精选内容</strong><p>第一批真实 AI4Math 条目将在完成证据核验后发布；synthetic 示例不会进入正式站点。</p></div>`;
 const groups=new Map<string,{meta:ReturnType<typeof beijingParts>,items:PortableV1Item[]}>();
 for(const item of items){const meta=beijingParts(item.publishedAt??item.discoveredAt); const g=groups.get(meta.day); if(g)g.items.push(item); else groups.set(meta.day,{meta,items:[item]});}
 return [...groups.values()].map(g=>`<section class="day" data-day><div class="day-head"><span class="day-date">${esc(g.meta.date)}</span><span class="day-chevron">⌄</span><span class="day-meta">${esc(g.meta.weekday)} · ${g.items.length} 条</span></div><ol class="timeline">${g.items.map(item=>{const meta=beijingParts(item.publishedAt??item.discoveredAt);return `<li class="slot" data-feed-item-shell><time class="time">${esc(meta.time)}</time><span class="rail"></span>${feedCard(item)}</li>`;}).join("")}</ol></section>`).join("");
}
function toolbar(){return `<div class="toolbar">${tabs()}<label class="search"><span class="search-icon">⌕</span><input data-search placeholder="搜索标题、摘要…" autocomplete="off"><kbd class="search-kbd">/</kbd></label></div>`;}
function feedPage(items:PortableV1Item[],mode:"home"|"all"|"starred"){
 const title=mode==="all"?"全部 AI4Math 动态":mode==="starred"?"收藏":"精选";
 return `<div class="topline"><h1 class="page-title">${title}</h1></div>${toolbar()}<p class="subline">先扫描摘要，再展开感兴趣的内容。<a href="${href("feed.xml")}">订阅 AI4Math Radar RSS →</a></p>${timeline(items)}`;
}
function legalPage(file:string,title:string,active:string){const raw=readFileSync(path.join(ROOT,"industry/pages",file),"utf8");return shell(`${title} · ${SITE.name}`,`<div class="topline"><h1 class="page-title">${esc(title)}</h1></div><div class="legal" style="margin-top:20px">${esc(raw)}</div>`,active);}
function simplePage(title:string,body:string,active:string){return shell(`${title} · ${SITE.name}`,`<div class="topline"><h1 class="page-title">${esc(title)}</h1></div><div class="card item-card" style="margin-top:20px">${body}</div>`,active);}

const canonicalPath=path.join(ROOT,"portable/content/selected.jsonl");
const items=parsePortableJsonl(readFileSync(canonicalPath,"utf8")).filter(i=>i.selected).sort((a,b)=>Date.parse(b.publishedAt??b.discoveredAt)-Date.parse(a.publishedAt??a.discoveredAt));
mkdirSync(OUT,{recursive:true});
mkdirSync(path.join(OUT,"assets"),{recursive:true});
copyFileSync(path.join(ROOT,"static/aihot.css"),path.join(OUT,"assets/aihot.css"));
copyFileSync(path.join(ROOT,"static/aihot.js"),path.join(OUT,"assets/aihot.js"));

write("index.html",shell(SITE.homeTitle,feedPage(items,"home"),"home"));
write("all/index.html",shell(`全部 AI4Math 动态 · ${SITE.name}`,feedPage(items,"all"),"all",SITE.description,'data-view="all"'));
write("starred/index.html",shell(`收藏 · ${SITE.name}`,feedPage(items,"starred"),"starred",SITE.description,'data-view="starred"'));
write("topics/index.html",simplePage("主题",`<p class="feed-summary">按 AI4Math 领域浏览。</p><div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:16px">${CATEGORIES.map(c=>`<a class="tab active" href="${href("")}?category=${encodeURIComponent(c.key)}">${esc(c.label)}</a>`).join("")}</div>`,"topics"));
write("about/index.html",simplePage("关于",`<p class="feed-summary">${esc(SITE.description)}</p><p class="feed-summary">当前使用 <strong>static-chatgpt</strong>：GitHub 保存 canonical data，ChatGPT 负责研究维护，GitHub Pages 负责静态发布；Native AIHOT runtime 仍保留为可切换部署方式。</p>`,"about"));
write("changelog/index.html",simplePage("更新日志",`<p class="feed-summary">2026-09-30：启用 static-chatgpt，并完成 AIHOT UI parity 第一阶段。</p>`,"changelog"));
write("404.html",shell(`页面不存在 · ${SITE.name}`,`<div class="card item-card"><h1>404</h1><p class="feed-summary">你访问的页面不存在。</p><a class="cta" href="${href("")}">回到精选</a></div>`,""));

for(const item of items){
 const body=`<div class="item-page"><a class="item-back" href="${href("")}">← 返回精选</a><article class="card item-card"><div class="feed-head"><span>${esc(item.source.name)}</span><span class="selected-badge">精选</span>${item.score!==null?`<span class="score">AI 评分&nbsp; ${item.score}</span>`:""}</div><h1>${esc(item.title)}</h1>${item.summary?`<p class="summary">${esc(item.summary)}</p>`:""}${item.reason?`<div class="reason">推荐理由：${esc(item.reason)}</div>`:""}<a class="cta" href="${esc(item.links.original)}" rel="noopener noreferrer">阅读原始来源 ↗</a></article></div>`;
 write(path.join("items",encodeURIComponent(item.id),"index.html"),shell(`${item.title} · ${SITE.name}`,body,"",item.summary??SITE.description));
}

write("terms/index.html",legalPage("terms.md","使用规则",""));
write("privacy/index.html",legalPage("privacy.md","隐私说明",""));
write("data/selected.json",JSON.stringify({schemaVersion:1,generatedAt:new Date().toISOString(),count:items.length,items},null,2)+"\n");
copyFileSync(canonicalPath,path.join(OUT,"data/selected.jsonl"));
const rssItems=items.slice(0,50).map(item=>`<item><title>${xml(item.title)}</title><link>${xml(item.links.original)}</link><guid isPermaLink="false">${xml(item.id)}</guid><pubDate>${new Date(item.publishedAt??item.discoveredAt).toUTCString()}</pubDate><description>${xml(item.summary??"")}</description></item>`).join("");
write("feed.xml",`<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>${xml(SITE.name)}</title><link>${xml(absolute(""))}</link><description>${xml(SITE.description)}</description>${rssItems}</channel></rss>`);
write("llms.txt",`# ${SITE.name}\n\n> ${SITE.description}\n\nCurrent deployment profile: static-chatgpt.\nCanonical selected content: ${absolute("data/selected.jsonl")}\nJSON index: ${absolute("data/selected.json")}\nRSS: ${absolute("feed.xml")}\nGitHub repository: https://github.com/Charlie-Wang-03/ai4math-radar\n\nThis static deployment preserves the AIHOT reading UI but does not expose the native live REST API, remote MCP server, admin console, or continuous worker.\n`);
write("robots.txt",`User-agent: *\nAllow: /\nSitemap: ${absolute("sitemap.xml")}\n`);
const urls=["","all/","starred/","topics/","about/","changelog/","terms/","privacy/",...items.map(i=>"items/"+encodeURIComponent(i.id)+"/")];
write("sitemap.xml",`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.map(u=>`<url><loc>${xml(absolute(u))}</loc></url>`).join("")}</urlset>`);
write(".nojekyll","");
console.log(JSON.stringify({out:OUT,base:BASE.toString(),itemCount:items.length,ui:"aihot-parity"},null,2));
