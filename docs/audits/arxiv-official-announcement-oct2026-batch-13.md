# Batch 13 — first-public arXiv announcement listing dates (2026-10-30)

## Scope, proof type, and temporal contract

The historical [Batch 11](provider-chronology-five-source-groups-batch-11.md) and [Batch 12](arxiv-oai-provenance-batch-12.md) showed why arXiv abstract `[Submitted on]`, Search API `published`, and OAI-PMH metadata `datestamp` are **not** original public announcement times. The correct additional evidence is the official **arXiv /list/<primary-category>/recent** page, which organizes individually named articles under **dated daily announcement headings**. On **2026-10-30 UTC**, these pages still exposed Oct 27/28 groups.

- Source identity match requires the entire arXiv ID in an official category listing under the exact listed calendar heading; verify the same ID against the original `links.original`. All nine original articles have one matched dated first-public listing.
- The group heading establishes **calendar day precision**, not a precise first-public HH:mm:ss. Do not infer a global default 20:00 ET or 00:00 UTC; no exact source clock certified.
- The `recent` page is **rolling**, so its past dates may eventually disappear. This audit is a durable *observation ledger* with the exact original source URL, category listing URL, observed headline group and retrieved-on date. The original arXiv article + archived monthly listing remain persistent corroboration of article identity/month, but the monthly listing alone does not prove day.
- Preserve the existing `publishedAt`, `publishedAtPrecision:"day"` and **immutable stable IDs** per [temporal contract #104](../editorial-temporal-contract-v1.md), even though they encode earlier submit dates. Add only `chronology.milestone` specifying the verified **arXiv public paper listing day**.
- No claim of mathematical/theorem correctness or statement fidelity is made.

## Dated official primary-source matches

| arXiv v1 | Immutable Radar ID | Legacy archive day | Verified arXiv public listing day | Official category/source |
| --- | --- | --- | --- | --- |
| [2610.34389](https://arxiv.org/abs/2610.34389) | `2026-10-25-li-wang-radical-well-mixed-difference-ideals` | 2026-10-25 | **2026-10-27** | [`math.AC` recent](https://arxiv.org/list/math.AC/recent?show=2000&skip=0), under `Tue, 27 Oct 2026` |
| [2610.34516](https://arxiv.org/abs/2610.34516) | `2026-10-25-jaakkola-mee-many-one-sigma2-gpt-sol` | 2026-10-25 | **2026-10-27** | [`cs.CC` recent](https://arxiv.org/list/cs.CC/recent?show=2000&skip=0), under `Tue, 27 Oct 2026` |
| [2610.35962](https://arxiv.org/abs/2610.35962) | `2026-10-25-moalla-h1-efficient-lean-agent` | 2026-10-25 | **2026-10-28** | [`cs.LG` recent](https://arxiv.org/list/cs.LG/recent?show=2000&skip=0), under `Wed, 28 Oct 2026` |
| [2610.36196](https://arxiv.org/abs/2610.36196) | `2026-10-26-fichte-szeider-count-catcher-lean-model-counting` | 2026-10-26 | **2026-10-28** | [`cs.LO` recent](https://arxiv.org/list/cs.LO/recent?show=2000&skip=0), under `Wed, 28 Oct 2026` |
| [2610.36377](https://arxiv.org/abs/2610.36377) | `2026-10-26-chen-wang-gross-prasad-geometric-langlands-ai` | 2026-10-26 | **2026-10-28** | [`math.NT` recent](https://arxiv.org/list/math.NT/recent?show=2000&skip=0), under `Wed, 28 Oct 2026` |
| [2610.36534](https://arxiv.org/abs/2610.36534) | `2026-10-27-hellwig-morgan-mullen-completely-normal-lean` | 2026-10-27 | **2026-10-28** | [`math.NT` recent](https://arxiv.org/list/math.NT/recent?show=2000&skip=0), under `Wed, 28 Oct 2026` |
| [2610.36767](https://arxiv.org/abs/2610.36767) | `2026-10-27-ospanov-usamo-proof-grading-mabgrader` | 2026-10-27 | **2026-10-28** | [`cs.AI` recent](https://arxiv.org/list/cs.AI/recent?show=2000&skip=0), under `Wed, 28 Oct 2026` |
| [2610.37018](https://arxiv.org/abs/2610.37018) | `2026-10-27-ortali-rectilinear-planarity-lean-ai` | 2026-10-27 | **2026-10-28** | [`cs.DS` recent](https://arxiv.org/list/cs.DS/recent?show=2000&skip=0), under `Wed, 28 Oct 2026` |
| [2610.37125](https://arxiv.org/abs/2610.37125) | `2026-10-27-wang-zeng-bialostocki-lotspeich-zero-sums` | 2026-10-27 | **2026-10-28** | [`math.CO` recent](https://arxiv.org/list/math.CO/recent?show=2000&skip=0), under `Wed, 28 Oct 2026` |

## Group and identity cross-check

- **2026-10-27**: arXiv `math.AC` group contains **2610.34389**; `cs.CC` group contains **2610.34516**.
- **2026-10-28**: `cs.LG` contains **2610.35962**; `cs.LO` contains **2610.36196**; `math.NT` contains **2610.36377** and **2610.36534**; `cs.AI` contains **2610.36767**; `cs.DS` contains **2610.37018**; `math.CO` contains **2610.37125**.
- No first-public day claim is made for the remaining older arXiv records whose dated original listings are currently beyond the rolling recent window.
- The latest canonical input was **314 selected** news records, reflecting the existing unattended daily editorial task. The nine rows are all present and have legacy day-only timestamps. This task does not revert or edit the latest daily news backfill.

## Regression and follow-up

1. Verify `npm run content:check` and `npm run build:static` and hosted `check`/`docker` before merge.
2. Keep separately tracking (a) legacy public URL/ID day, (b) publishedAt day-only compatibility, (c) source-verified `chronology.milestone.date`. The UI can show milestone date without deleting old permanent URLs.
3. Implement a **read-only daily capture of dated official listings with archived evidence** while the rolling window still exists, and add a CI guard rejecting use of an arXiv `/abs/<id>` *submission* page alone as evidenceKind `arxiv-announcement`.
4. Historical ProofNet Feb 2023 and Lean Atlas Apr 2026 require archived dated announcement snapshots. The arXiv identifier month is *not* itself a public day.
