# Batch 27 — Ground False: distinguish July workshop paper from Sept 24 NeurIPS acceptance announcement

## Exact Radar event and authoritative time source

The canonical news item `2026-09-24-ground-false-neurips` specifically says "**作者 9 月 24 日确认 Ground False 被 NeurIPS 2026 E&D Track 接收**". It is not claiming the research or code first became publicly accessible that day.

- **Original author's [academic homepage](https://marcusm117.github.io/)** contains a **dated News item: "Sep 24, 2026 | Our work Ground False ... has been accepted to NeurIPS 2026 ... E&D Track"**, which directly matches the Radar news claim and original author's name. The news item points to the same [ProofNet-Verified source repository](https://github.com/marcusm117/ProofNet-Verified). This is first-party author-dated evidence for the **acceptance announcement**, at *calendar day* precision only.
- No exact clock or timezone is exposed. `2026-09-24T00:00:00.000Z` is **legacy day-only V1 placeholder**, not an actual announcement instant. GitHub repo creation and code commits do not date the author's acceptance notice.
- Set optional `chronology.milestone` with `eventKind: other`, `date: 2026-09-24`, `precision: day`, `evidenceKind: original-research-page`, and the author's homepage URL. No `at` and no `earliestVerifiedPublic` claimed.

## Earlier result vs later venue announcement — version/title caution

The project **predates** the September news as a scientific work:

- The [official ICML 2026 3rd AI for Math workshop](https://ai4math2026.github.io/) convened **July 11, 2026**. The [corresponding workshop OpenReview manuscript](https://openreview.net/forum?id=5c0RSYyIWW), as cited in the [project's own public dataset](https://huggingface.co/datasets/marcusm117/ProofNet-Verified), uses the title **"Ground False: Dissecting Errors in Formal Mathematics Benchmarks"** and credits One An, Marcus Min, Xujie Si, Osbert Bastani. The ICML conference's [official schedule record](https://icml.cc/virtual/2026/82611) identifies the same July11 workshop paper.
- Separately, [coauthor Xujie Si's publications list](https://www.cs.utoronto.ca/~six/pubs.html) and [coauthor research group](https://trustml.github.io/publications.html) list the NeurIPS 2026 E&D version with the **different** title **"Ground False: Uncovering Errors in Formal Mathematics Benchmarks"** and a different author order. This likely reflects evolving paper versions, and requires comparison before collapsing manuscript title/venue identity.
- The Radar `originalTitle` currently uses **"Dissecting"** from the workshop version, while the news is about the later **NeurIPS acceptance**. That editorial inconsistency warrants its own version/identity content check; it is **not** a reason to misdate a clearly authored Sep24 NeurIPS acceptance announcement, and this PR does **not** silently change the original title, linked repository or scientific claims.
- Workshop presentation day and first online publication time of its manuscript are *not* equivalent. Do **not** insert `earliestVerifiedPublic=2026-07-11` as absolute first-public research without an actual public manuscript snapshot/posted_at.
- Neither the 55.6% ProofNet anomaly figures nor Lean proof fidelity have been independently evaluated by this **date audit**.

## Narrow change and regression criteria

Only **one** record receives optional day-precision chronology; no ID, `publishedAt`, score, summary, originalTitle, original GitHub link or source text is changed. Keep the July workshop paper as **earlier related evidence** and the dated September **venue acceptance** as the event this Radar record covers. Require hosted Check/Docker and CodeQL before merge.

Conditional on unchanged 314 records and 96 legacy midnight fields, missing optional chronology among those 96 falls **11 → 10**. Source title/venue ambiguity remains actionable as a separate editorial topic, not an invented release timestamp.
