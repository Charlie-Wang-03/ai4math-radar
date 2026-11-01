import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

type News = {
  id: string;
  title: string;
  summary: string;
  publishedAt: string;
  links: { original: string; aihot: string };
  chronology?: { eventKind: string; milestone: { date: string; precision: string; evidenceKind: string; evidenceUrl: string; at?: string }; earliestVerifiedPublic?: unknown };
};
const entries: News[] = readFileSync(new URL("../portable/content/selected.jsonl", import.meta.url), "utf8")
  .trim().split(/\r?\n/).map((line: string) => JSON.parse(line) as News);
function checkmate(): News {
  const matches = entries.filter((entry) => entry.id === "2023-06-02-checkmate");
  assert.equal(matches.length, 1);
  return matches[0]!;
}

test("CheckMate retains its immutable permalink and June2 compatibility date", () => {
  const item = checkmate();
  assert.equal(item.publishedAt, "2023-06-02T00:00:00.000Z");
  assert.equal(item.links.original, "https://arxiv.org/abs/2306.01694");
  assert.equal(item.links.aihot, "https://charlie-wang-03.github.io/ai4math-radar/items/2023-06-02-checkmate/");
  assert.equal(item.title, "CheckMate 把数学 LLM 评测从静态答题升级为可交互的人类专家审查平台");
  assert.equal(Object.hasOwn(item, "publishedAtPrecision"), false);
});

test("CheckMate adds only a day-level public-project milestone, not first paper release", () => {
  assert.deepEqual(checkmate().chronology, {
    eventKind: "other",
    milestone: {
      date: "2023-06-05",
      precision: "day",
      evidenceKind: "original-research-page",
      evidenceUrl: "https://github.com/collinskatie/checkmate/pull/1",
    },
  });
  assert.equal(Object.hasOwn(checkmate().chronology!.milestone, "at"), false);
  assert.equal(Object.hasOwn(checkmate().chronology!, "earliestVerifiedPublic"), false);
});

test("CheckMate's visible summary explains the public-code and first-announcement distinction", () => {
  const summary = checkmate().summary;
  assert.ok(summary.startsWith("Collins 等提出 CheckMate，一个让数学家与语言模型进行多轮交互、追问、纠错并记录 reasoning failure 的评测平台。"));
  assert.match(summary, /2023 年 6 月 5 日 UTC/);
  assert.match(summary, /公开源码协作/);
  assert.match(summary, /不是新研究成果或平台首次上线/);
  assert.match(summary, /首次 arXiv 公告时间仍待核/);
  assert.match(summary, /兼容字段保留 2023 年 6 月 2 日/);
});

test("CheckMate milestone is grounded in the complete archived public-author receipt", () => {
  const receipt: { checkmate: {
    complete: boolean; status: number; archiveSha256: string;
    repo: { id: number; name: string }; actor: { id: number; login: string };
    prUrl: string; prCreatedAt: string;
    events: Array<{ eventId: string; public: boolean; baseRepoPrivate: boolean; identityMatched: boolean; createdAt: string }>;
  } } = JSON.parse(readFileSync(new URL("../docs/audits/evidence/batch37-author-public-evidence.json", import.meta.url), "utf8"));
  const evidence = receipt.checkmate;
  assert.equal(evidence.complete, true);
  assert.equal(evidence.status, 200);
  assert.equal(evidence.archiveSha256, "8ff6279ce40a2dac7648f6083a51170e950ab6f1f0800168baaa554760620ee1");
  assert.deepEqual(evidence.repo, { id: 643507916, name: "collinskatie/checkmate" });
  assert.deepEqual(evidence.actor, { id: 19373539, login: "albertqjiang" });
  assert.equal(evidence.prUrl, checkmate().chronology!.milestone.evidenceUrl);
  assert.equal(evidence.prCreatedAt, "2023-06-05T12:39:48Z");
  assert.deepEqual(evidence.events.map((event) => event.eventId), ["29533246293", "29533253947"]);
  assert.ok(evidence.events.every((event) => event.public && event.baseRepoPrivate === false && event.identityMatched));
  assert.ok(evidence.events.every((event) => event.createdAt.endsWith("Z") && event.createdAt.slice(0, 10) === checkmate().chronology!.milestone.date));
});
