# Batch 21 — official Palomar and Zenodo source-gap probes (2026-10-30)

## Scope

Following [Issue #127](https://github.com/Charlie-Wang-03/ai4math-radar/issues/127), the remaining chronology backlog includes one aiXiv-indexed Palomar proof claim and one Zenodo manuscript. Both have first-party or indexed versions; neither should be assigned an exact time from a repository creation timestamp.

| Radar entry | Primary publication question | Targeted machine source |
| --- | --- | --- |
| `2026-09-06-bugeaud-10-61-ai-formalization` | aiXiv reports “Published 2026-09-06 on Palomar”, indexed Sep16; test whether **Palomar version 2** was *actually registered* on Sept6 | `https://data.palomar-registry.org/versions/PALOMAR-2026-08-31-000013.json` → immutable version 2 child JSON |
| `2026-10-19-arad-herzog-conditional-ai-proof-claim` | Zenodo displays Oct19 but metadata `publication_date` may be depositor-entered, and `created` can refer to draft initialization; seek evidence about first *public* record release | `https://zenodo.org/api/records/23450488` |

## Guarantees

- Fixed, allowlisted URLs, no external arbitrary domains, no redirects, 1.3 MB response cap, 12-second request deadlines, identity/type checking and per-response SHA-256.
- Palomar `registered_at` from **version 2**, not `first_registered_on` or the original ID creation date; source/claim identity and `registered_at <= discoveredAt` require editorial verification.
- Zenodo `created`, `updated` and depositor-entered `publication_date` remain **candidate metadata**, not a public release clock. Record version status and identity must be inspected separately.
- All observations saved in JSON artifact by dedicated read-only Actions workflow; **zero** modifications to canonical `selected.jsonl`, metadata or existing news content.
- Real provider response may fail: do not auto-promote timestamps on HTTP errors or unsupported semantics.

## Acceptance

Run unit tests, GitHub Actions real probe and hosted required CI. Examine candidate result and submit a separate **data-only, evidence-reviewed PR** for just those source-specific milestones that actually meet the source contract. If evidence is absent, mark unresolved with a concrete reason in Issue #127. No mathematical theorem is certified by publication metadata.
