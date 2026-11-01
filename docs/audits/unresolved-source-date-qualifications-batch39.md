# Batch 39 — make unresolved date semantics visible in the actual news text

Baseline: `8c285145474f78cdca8f14cf4c264385f8f08abe`, after Batch 38. **Editorial correction, not two new date certifications.** Continue Issue #127; do not close either remaining structural chronology gap.

## Defect found in the public-facing content

The Zenodo v3 summary still said the author made the manuscript public **on October 19**, and described that day as the displayed public date. That is stronger than the evidence established by Batch 37: exact version metadata supports a **source-declared Issued date**, not an independently established first-public UTC day. Leaving the stronger claim in the news while qualifying it only in audit files is misleading. This batch removes those two time assertions and explains the evidence in the visible summary. It does not retract the mathematical claim or change its conditional/unverified status.

GenLimitLib's summary correctly describes September 29 as a submission day, but the compatibility date could still be read as a verified public announcement. Append a visible distinction between submission, the known cross-listing, and the still-unverified original primary-category announcement.

## Source-specific basis, rechecked in this continuation

### GenLimitLib

- [Original arXiv 2609.36663](https://arxiv.org/abs/2609.36663): v1 submitted **2026-09-29T04:06:07Z**. This is a submission clock, not the first public announcement.
- [Pinned original cs.LO RSS copy](https://github.com/ehijano/rss_fetch/blob/e597e5120c034115fda2049d72812f2da7f99f3a/rss_data/cs.LO/2026-09-30_cs.LO.xml): exact `2609.36663v1`, `cross`, `Wed, 30 Sep 2026 00:00:00 -0400`. The source-copy blob is `600661f660669a69cf448d987384b8bc137f884c`. This demonstrates the cross-category notice, not the missing `cs.LG new` listing.
- [Official RSS definitions](https://info.arxiv.org/help/rss_specifications.html) distinguish first release (`new`) from notice in a non-primary category (`cross`); [availability guidance](https://info.arxiv.org/help/availability.html) distinguishes submission/moderation from public announcement. Do not infer an actual paper's announcement from the normal schedule.
- A newly located [Penn State author seminar](https://www.eecs.psu.edu/events/event-detail.aspx?EventID=357bb44e-5a13-43b9-9172-4) explicitly discusses this paper, but its **October 7, 2026** scheduled talk is a later event. It is not substituted for the September paper milestone merely to reduce the backlog. The page is evidence of a scheduled talk, not independent proof that it occurred.
- Fresh scoped GitHub XML search surfaced the known cs.LO copy, not a new original primary-category item. Search/index coverage is incomplete by nature; absence of another result does not prove absence of historical disclosure. No repeated Wayback workflow was run in this batch.

### Zenodo Arad–Herzog v3

- [Batch 37 immutable provider receipt](evidence/batch37-author-public-evidence.json) preserves the version-specific [DataCite DOI](https://api.datacite.org/dois/10.5281/zenodo.23450488): version `3`, Issued **2026-10-19**, registered **2026-10-18T15:39:11.000Z**, response SHA-256 `792affe2243ff8253c898112a579cccb00a862bd8f1896bbdef499d166896804`. These previously retrieved values are reused transparently; this batch does not claim a fresh successful API response.
- [Zenodo's publication-date guidance](https://help.zenodo.org/docs/deposit/describe-records/publication-date/) says this editable field defaults to draft creation day and can represent earlier publication elsewhere. [DataCite dateType definitions](https://datacite-metadata-schema.readthedocs.io/en/4.7/appendices/appendix-1/dateType/) distinguish Issued from Available. A declared civil date must not silently become the site's independently verified UTC first-public date.
- The web tool could not retrieve v3's landing page, JSON exports or record API. Its failure is **tool access failure**, not a new measured origin HTTP status and not evidence that the manuscript never existed publicly.
- The [accessible v4 page](https://zenodo.org/records/23475012) identifies **version 4**, declares October 19 and describes a revised proof/support package. It cannot substitute for v3's first-public metadata. No new PDF or Lean verification was performed; existing v3 mathematical trust warnings remain unchanged.

## Exact changes and integrity

Only `summary` changes for `2026-09-29-genlimitlib` and `2026-10-19-arad-herzog-conditional-ai-proof-claim`. Preserve all original research text except the two unsupported Zenodo date assertions. No headline, original title, source, URL, ID, `publishedAt`, precision, discovery time, score, category, attribution or chronology mutation. Other **332 records remain byte-for-byte unchanged**. CheckMate's adopted milestone remains untouched.

Local transformation and the fixed-baseline remote helper independently agreed:

- Before blob: `16feedd052c010f436582bed443d7ee057e19e1c`.
- After blob: `dde56d03c262a590a63fbffe9b7ccfaafeb9462d`; 571,475 bytes; SHA-256 `d3d13ed022defbb2d249b5421722179bb6dcb26656842189142142ae7476284e`.
- 334 unique records, two changed lines/summary fields, all other fields preserved; 105 midnight-valued compatibility fields and two missing optional chronologies unchanged.
- [Guarded helper run 41329303395](https://github.com/Charlie-Wang-03/ai4math-radar/actions/runs/41329303395) created an unattached blob only; it did not update any ref. The temporary workflow is removed from the final tree before PR review. No workflow or permission change is proposed for main.

## Acceptance and remaining limits

Four focused local tests pass on Node 22.16.0 (`--experimental-strip-types`), covering identity preservation, submission/cross/new distinction, v3 Issued/registration wording and retained conditional-proof warnings. These tests check editorial invariants, not scientific correctness or new historical facts. No local full-suite success is claimed. Require hosted tests/typecheck, content integrity, static build, Docker, CodeQL and completed review before expected-head squash merge; inspect deployment separately.

**Outcome:** readers see the same uncertainty as the audit. The two first-public evidence gaps remain open. No additional infrastructure, automatic source-clock promotion, later-event substitution, recurring schedule or standing MCP is merged. A future source-backed date adoption must update the prose and its regression expectations together.
