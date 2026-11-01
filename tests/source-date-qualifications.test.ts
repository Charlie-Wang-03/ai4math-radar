import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

type News = { id: string; summary: string; publishedAt: string; links: { original: string; aihot: string } };
const entries: News[] = readFileSync(new URL("../portable/content/selected.jsonl", import.meta.url), "utf8")
  .trim().split(/\r?\n/).map((line: string) => JSON.parse(line) as News);
function item(id: string): News {
  const matches = entries.filter((entry) => entry.id === id);
  assert.equal(matches.length, 1);
  return matches[0]!;
}
const genId = "2026-09-29-genlimitlib";
const zenId = "2026-10-19-arad-herzog-conditional-ai-proof-claim";

test("source-date explanations preserve the two legacy identities and original version links", () => {
  for (const [id, date, original] of [
    [genId, "2026-09-29", "https://arxiv.org/abs/2609.36663"],
    [zenId, "2026-10-19", "https://zenodo.org/records/23450488"],
  ] as const) {
    const news = item(id);
    assert.equal(news.publishedAt, `${date}T00:00:00.000Z`);
    assert.equal(news.links.original, original);
    assert.equal(news.links.aihot, `https://charlie-wang-03.github.io/ai4math-radar/items/${id}/`);
  }
});

test("GenLimitLib visibly distinguishes submission, cross-listing and the unverified first announcement", () => {
  const summary = item(genId).summary;
  assert.ok(summary.startsWith("GenLimitLib 在 9 月 29 日提交预印本，"));
  assert.match(summary, /2026 年 9 月 29 日是 arXiv v1 提交日期/);
  assert.match(summary, /不等于已核实的首次公开公告日期/);
  assert.match(summary, /9 月 30 日在 cs\.LO 的跨分类公告（cross）/);
  assert.match(summary, /不能替代主分类 cs\.LG 的首次公告（new）证据/);
  assert.match(summary, /首次公开公告时间仍待核/);
});

test("Zenodo v3 no longer claims its declared issue day is a verified public-release day", () => {
  const summary = item(zenId).summary;
  assert.ok(summary.startsWith("Aran S. Ziegler 的《Proof of the Arad–Herzog conjecture》版本 3，"));
  assert.doesNotMatch(summary, /于 2026 年 10 月 19 日在 Zenodo 公开/);
  assert.doesNotMatch(summary, /Zenodo 显示公开日期为 10 月 19 日/);
  assert.match(summary, /记录 23450488/);
  assert.match(summary, /来源声明发行日期（Issued）为 2026 年 10 月 19 日/);
  assert.match(summary, /DOI 登记时间为 2026 年 10 月 18 日 15:39:11 UTC/);
  assert.match(summary, /均不能单独证明该版本首次公开可访问的 UTC 日期或时刻/);
  assert.match(summary, /版本 4 的日期不用于替代版本 3/);
  assert.match(summary, /首次公开 UTC 时间仍待核/);
});

test("date clarification does not weaken the existing conditional-proof warning", () => {
  const summary = item(zenId).summary;
  assert.match(summary, /\*\*这不是经过独立确认的猜想解决\*\*/);
  assert.match(summary, /约 859 个公理\/外部输入/);
  assert.match(summary, /约 269 项为具名非平凡数学假设/);
  assert.match(summary, /完整复核工件未公开；截至发布时没有独立专家审核/);
});
