# Batch 28 — author-dated Rózsa arXiv availability and LeanDojo release statements

Checked: **2026-10-30**. Goal: certify the date of each exact public milestone using first-party author statements, rather than turn paper submission clocks into publication clocks.

## 1. Rózsa — 2026-10-20 author public arXiv availability notice

- Canonical ID: `2026-10-19-rozsa-lean-equational-reasoning`; [original paper](https://arxiv.org/abs/2610.26467).
- [Georgios Kissas's original academic homepage](https://georgioskissas.com/), under **news**, explicitly says **"Oct 20, 2026 | Our paper Rózsa: Certified Equational Reasoning is now available on arXiv!"**, linking the exact paper, and names the SAIR challenge leaderboards. This is a first-party, item-matched, **day-only author announcement of paper public availability**.
- The arXiv paper gives **v1 submitted Mon Oct 19 2026 14:16:17Z**; the legacy Radar ID/publishedAt/summary record this *submission*. That is distinct from the author's **Oct20 public availability** milestone. We could not locate a contemporaneous first-party per-item arXiv dated `new` announcement feed, so we do **not** assert Oct20 is independently verified by an arXiv announcement channel itself, or that it is the absolute first public release across platforms.
- Add `chronology.eventKind: paper-release`, `milestone.date: 2026-10-20`, `precision: day`, `evidenceKind: original-research-page`, `evidenceUrl: https://georgioskissas.com/`. No `at` field; original exact arXiv submission time must not be repurposed as publication.
- Original headline, summary, scientific score, stable ID, old `publishedAt` and original arXiv source remain unchanged. This audit does not independently verify Lean certificates or leaderboard results.

## 2. LeanDojo — 2023-06-28 public author release announcement

- Canonical ID: `2023-06-27-leandojo`; [original arXiv paper](https://arxiv.org/abs/2306.15626).
- [Original Lean theorem-proving Zulip community archive, 'Releasing LeanDojo'](https://leanprover-community.github.io/archive/stream/219941-Machine-Learning-for-Theorem-Proving/topic/Releasing.20LeanDojo.html) has a post from **Kaiyu Yang (Jun 28 2023 at 02:53)** explicitly announcing release of **LeanDojo: open-source tools, benchmarks, and models**, and linking its project homepage, paper, code and both datasets. This is direct, durable author-origin event evidence. The author also links a post to his X account. In the same forum, other researchers replied that day, independently showing the release announcement was public.
- The archive heading displays a time without an explicit timezone contract. This update therefore certifies **calendar day 2023-06-28**, *not* a timezone-assumed 02:53 UTC instant.
- The previous `2023-06-27` canonical URL refers to the arXiv **v1 submission** (Tue Jun27 17:05:32Z) and is left immutable. Neither that submission clock nor the June28 community announcement proves the exact minute of the earliest public listing of the arXiv article.
- Add `chronology.eventKind: other`, `milestone.date: 2023-06-28`, `precision: day`, `evidenceKind: original-research-page`, `evidenceUrl` of the fixed community author post archive. This is a **project/tool/data release announcement**, not a first-paper submission date, and is consistent with the existing summary discussing release of the toolkit and benchmarks.

## Remaining limitations

- The original **Rózsa** arXiv `new` feed and the **LeanDojo** June 2023 first-public arXiv announcement have not been independently retrieved. Their earlier legacy dates must remain understood as compatibility records, not as authenticated arXiv public announcement days.
- For other still-unresolved entries: arXiv GenLimitLib shows only a cross-category RSS in the preserved copy; MathlibLemma's PMLR conference date range is not a paper upload date; ProofNet's original Feb23 legacy date conflicts with an arXiv Feb24 v1 submission; no exact public time for the Köthe GitHub repo has been certified; original Erdős #124 forum and Zenodo metadata remain inaccessible in independent probes.
- Unresolved does not imply false, and a publisher metadata timestamp never by itself certifies the mathematical statement.

## Merge contract

Two additive JSONL chronology objects and this audit document only. No V1 permalink, `publishedAt`, `discoveredAt`, score, original source or text edits. Require hosted content/check, Docker, security scans and resolved PR reviews before merge.

Conditional on otherwise unchanged `main`: **314 records**, **96** legacy day-only `publishedAt` unchanged; **10 → 8** legacy date-only items still lack an optional source milestone.
