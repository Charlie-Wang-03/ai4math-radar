# Batch 36 — historical RSS transport, format and UTC evidence guards

Checked 2026-11-01. **Research-tool repair only; no canonical publication-date changes.**

Baseline: `main` at `879e438f697cff75344245115ad9902a01f6baa3`, following [PR #146](https://github.com/Charlie-Wang-03/ai4math-radar/pull/146). The daily selection added 12 stories to the previous 322, giving **334 records**. The previous audit's 322/96 figures are historical snapshots, not current counters. The probe now prints a read-only catalog snapshot so new daily additions do not silently stale this audit's denominator. `midnightTimestampCount` is a structural count, not an assertion that every midnight timestamp is an independently verified publication instant.

## Newly verified primary-source protocol evidence

- The [official arXiv RSS documentation at pre-2024 commit `2ac6c01ead6dc9857ce1871f1e620be6f7484330`](https://github.com/arXiv/arxiv-docs/blob/2ac6c01ead6dc9857ce1871f1e620be6f7484330/source/help/rss.md) explicitly documents **`http://arxiv.org/rss/`** and **RSS 1.0 as the default**, with 0.91/2.0 as optional versions. The commit is used to fix the historical documentation version, **not as a paper-publication clock**.
- [arXiv's 2024-01-31 migration notice](https://blog.arxiv.org/2024/01/31/attention-arxiv-users-re-implemented-rss/) describes the new `rss.arxiv.org` service and RSS 2.0 output, dropping RSS 0.91/1.0 support. Its discussion also distinguishes current subscription feeds from a historical-day retrieval API.
- [Current official RSS specifications](https://info.arxiv.org/help/rss_specifications.html) define modern item `pubDate` and `arxiv:announce_type`. Modern `new` denotes first arXiv release; `cross` and replacements are different events. Those modern fields must not be assumed to occur in all 2023 RSS 1.0 captures.

These documents do **not** recover CheckMate's missing original announcement. They expose limitations in how the existing archive probe would handle a future recovered capture. The previous real **zero-row CDX responses remain zero-row observations**; this repair does not claim that the parser caused those empty index responses.

## Reproducible defects and repair

1. **Captured original URL discarded.** The old probe received a CDX `original` URL but constructed the replay from the fixed HTTPS source instead. A capture of `http://arxiv.org/rss/cs.LG` could therefore be requested as a different HTTPS-original capture. Now validate the returned host/path against the exact target, reject query/credential/lookalike-origin swaps, and preserve the original HTTP or HTTPS scheme **inside an HTTPS Wayback replay**. No direct HTTP network requests or redirects are enabled.
2. **Legacy evidence conflated with insufficient modern fields.** Preserve matching legacy item identity and a title-carried arXiv version as research evidence. Mark legacy format explicitly and retain `UNRESOLVED` / manual review, rather than inventing `new`, inheriting channel `dc:date`, or silently reporting an absent article. The legacy test XML is **synthetic**, not a recovered CheckMate feed and not publication evidence.
3. **Timezone-less dates accepted by `Date.parse`.** For the same raw `Wed, 30 Sep 2026 00:30:00`, the old eligibility predicate accepts a UTC day of Sept30 under `TZ=UTC` but Sept29 under `TZ=Asia/Shanghai`. Now require an explicit numeric offset, GMT or UTC, validate the civil date/time and weekday, and reject calendar rollover, conflicting identity/type/version and out-of-target-window dates. No worker-local timezone defaults.
4. **Distinct failures collapsed.** Empty CDX coverage, rejected original URLs, HTTP denial, malformed index data, unreadable/truncated feeds, and a matched but unverified article now have distinct reason codes. None establishes that the paper was historically unpublished. Stream byte limits now cancel oversized reads before buffering an unbounded body; the existing fixed targets, deadlines and three-replay cap remain.

## Remaining event decisions

| Record | Decision after this batch | Why not promote a date |
| --- | --- | --- |
| `2026-09-29-genlimitlib` | **UNRESOLVED** | The known Sept30 `cs.LO` item is a cross-listing. Source-protocol repairs do not supply the missing primary-category `new` item. |
| `2023-06-02-checkmate` | **UNRESOLVED** | June2 submission, June5 author-PDF typesetting and third-party ingestion remain different evidence types. A synthetic legacy fixture proves parser behavior, not a June5 public announcement. |
| `2026-10-19-arad-herzog-conditional-ai-proof-claim` | **UNRESOLVED** | The earlier DataCite Oct18 DOI-registration versus displayed Oct19 manuscript-date discrepancy is not resolved by this arXiv-only tool repair. No new Zenodo first-public timestamp is asserted. |

Additional source searches found [CheckMate's author-led Harvard seminar on 2023-12-06](https://www.math.harvard.edu/event/evaluating-language-models-for-mathematics-through-interactions/) and the [2024 PNAS paper](https://pmc.ncbi.nlm.nih.gov/articles/PMC11181017/). These are **later distinct milestones**, not evidence to relabel the June 2023 entry. [Hugging Face's June5 submission by AK](https://huggingface.co/papers/2306.01694) remains a third-party paper-index action, not an original author or arXiv first-announcement clock. No arbitrary later event is substituted merely to close the backlog.

## Validation and scope

- **18/18 local focused tests PASS** on Node 22.16.0, including synthetic legacy RSS, HTTP-original replay, absent timezone, wrong civil dates, cross-UTC-day conversion, identity conflicts, source errors, truncated XML, streaming cancellation and replay bounds.
- The existing read-only `historic-arxiv-rss-wayback.yml` runs these tests and performs a bounded live probe on this PR. **Hosted CI and actual source-output results must be checked separately**; local mock tests cannot certify provider dates. Its run is a regression after the repair, not a promise of new archive coverage.
- Require Check/Docker/CodeQL success and resolved review threads before merge. Record real source observations, catalog count and merge status in Issue #127 after inspecting logs.
- No change to `portable/content/selected.jsonl`, IDs, `publishedAt`, chronology schema, public URLs, scheduling, workflow permissions, paid services or secrets. No persistent MCP service. This batch closes tooling defects, **not any of the three evidence gaps**.
