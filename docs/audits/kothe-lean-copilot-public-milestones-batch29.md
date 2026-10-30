# Batch 29 — Köthe author announcement and Lean Copilot MATH-AI workshop milestone

Checked **2026-10-31**. Scope: two source-specific **calendar-day** milestones, without rewriting legacy V1 event IDs or publication compatibility timestamps.

## Köthe conjecture — author announcement, 2026-09-04 (not September 3 GitHub push)

- Canonical record `2026-09-03-kothe-astra-autonomous` identifies the autonomous GPT-6 Astra **Krempa matrix-form counterexample** archived at [`tadamcz/koethe`](https://github.com/tadamcz/koethe). The [original first commit](https://github.com/tadamcz/koethe/commit/cee238741115870f24bef8cd318bc64eac5e7500) has committer date `2026-09-03T22:50:12Z`; that Git clock **does not certify public visibility** and is not promoted to source milestone.
- The project's **own author Tom Adamczewski** published [this original X post](https://x.com/tmkadamcz/status/2095785941193404457), which the [independent VibeMathed problem page](https://vibemathed.com/problem/kothe-conjecture) cites specifically as the **X Announcement** (not merely as generic commentary). An [independent mirror of the author's original X thread](https://site.twstalker.com/AcerFur/status/2095943080524263711) preserves matching text: the author's claim that Astra produced Lean disproofs of Smale's mean-value and **Köthe conjectures**, subject to caution on statement fidelity/significance, followed by a reply linking `github.com/tadamcz/koethe`.
- The specific X post ID `2095785941193404457` uses [Twitter/X Snowflake's published 41-bit timestamp + 22-bit counter layout](https://github.com/twitter-archive/snowflake/blob/snowflake-2010/src/main/scala/com/twitter/service/snowflake/IdWorker.scala). Reproducible decoding: `(2095785941193404457 >> 22) + 1288834974657 = 1788509280857` Unix ms, corresponding to **2026-09-04T08:08:00.857Z**. The independent source catalog also [explicitly identifies this author post as September 4](https://handwiki.org/wiki/Software:List_of_mathematical_discoveries_by_artificial_intelligence). This confirms the **original platform message's calendar day**, not the moment when a GitHub repository was first public, or the first possible independent repost.
- **Access caveat:** direct fetching of the original X HTML returned **HTTP 403**. Item identity/content is corroborated via the independent archived author thread, direct fixed post permalink and independent VibeMathed link. Because direct platform `created_at` was not retrieved, **only day precision** is recorded; the decoded subsecond ID timestamp is preserved for forensic context but is **not asserted as `chronology.milestone.at`**.
- New optional `chronology`: `eventKind: other`, `milestone.date: 2026-09-04`, `precision: day`, `evidenceKind: other`, `evidenceUrl: https://x.com/tmkadamcz/status/2095785941193404457`. This is specifically an **author's first-party public statement** about the machine-checked claim and its supporting GitHub artifact.
- Do not infer mathematical soundness, solution of Köthe's original formulation solely from the Lean matrix theorem, independent expert approval, absolute earliest manuscript release, or an exact GitHub public-release clock. The later human paper arXiv:2609.07996 is another milestone.

## Lean Copilot — accepted-paper appearance in Dec 15 workshop program

- Canonical record `2023-12-15-lean-copilot` says Lean Copilot was showcased **at the NeurIPS MATH-AI Workshop**, with original source the [official workshop schedule](https://mathai2023.github.io/schedule/).
- The [first-party **Accepted Papers** program](https://mathai2023.github.io/papers/) specifically lists paper **#28**, `Towards Large Language Models as Copilots for Theorem Proving in Lean`, authors **Peiyang Song, Kaiyu Yang, Anima Anandkumar**, and links [the exact workshop PDF](https://mathai2023.github.io/papers/4.pdf). Both this accepted-papers program and the [official schedule](https://mathai2023.github.io/schedule/) put the actual **workshop on Friday December 15, 2023**, in New Orleans, with a **15:00–16:00 CST poster session**.
- This provides primary event-level date evidence that this was an **accepted paper in the Dec 15 workshop's program**. The schedule does **not** enumerate each poster or assign this paper a separate oral presentation, and does **not** date the online upload of its PDF. Therefore the milestone is **workshop program participation/date only**, not a fabricated 15:00 poster presentation, exact author attendance, or earliest online paper release.
- The [later arXiv manuscript](https://arxiv.org/abs/2404.12534) has April 2024 submission history and is a **later paper-version channel**; it does not disprove the 2023 official workshop program.
- New optional `chronology`: `eventKind: other`, `milestone.date: 2023-12-15`, `precision: day`, `evidenceKind: original-research-page`, `evidenceUrl: https://mathai2023.github.io/papers/`.

## Compatibility and review

- Exactly **two** `portable/content/selected.jsonl` items receive optional date-only `chronology.milestone`; all 314 records, immutable IDs, legacy `publishedAt`, `discoveredAt`, text, scores, categories and original source links are preserved.
- Source milestone dates differ from or agree with immutable ID prefixes **by design**, and the current V1 timeline is not automatically re-sorted.
- Historic publication-time gaps outside these **specific** author/workshop events remain open; do not treat X post timing as proof of prior third-party public state or convert the workshop's date to first-online-paper publication.
- Require hosted `check`/`docker`/CodeQL, a two-line JSON diff review and no unresolved PR comments before merge.

Expected gap among 96 date-only `publishedAt` entries, conditional on no concurrent edits: **8 → 6**.
