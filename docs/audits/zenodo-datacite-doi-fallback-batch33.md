# Batch 33 — Zenodo Arad–Herzog version-specific public release time, DataCite DOI fallback

Date of investigation: **2026-10-31**. This is a **read-only metadata research probe** and must not change the canonical story or its date.

## Unresolved original source

The [Zenodo record 23450488](https://zenodo.org/records/23450488) contains the original Arad–Herzog claim attributed to Aran S. Ziegler, described as version 3 dated Oct19 in later publicity. The [Zenodo API](https://zenodo.org/api/records/23450488) previously returned HTTP 403 to automated inspection. Even if accessible, `metadata.publication_date` may be set by the depositor, `created` can mark **draft initialization**, and `updated` can denote edits after public release. Neither is ipso facto the record's first public release instant.

## New alternative primary-provider query

Zenodo is a DOI-registration client of **DataCite**. Its claimed version record should have the corresponding DOI `10.5281/zenodo.23450488`, so a separate public endpoint is now probed:
[DataCite DOI 10.5281/zenodo.23450488](https://api.datacite.org/dois/10.5281/zenodo.23450488).

The bounded, read-only researcher `scripts/probe-palomar-zenodo-source-gaps.mjs` now tests:
- Literal, exact DOI ID in both `data.id` and `data.attributes.doi`, status `data.type=dois`, record-ID-matched Zenodo landing URL and a title containing Arad and Herzog. A missing identity match never becomes a timestamp candidate.
- Candidate DataCite `created`, `registered`, `published`, `publicationYear`, `state` and `version` fields, along with source HTTP status, byte length and SHA-256 digest. The DataCite call runs **even when Zenodo API responds 403 or the original origin is inaccessible**.
- Official hosts only (`api.datacite.org`, `zenodo.org` and the pre-existing `data.palomar-registry.org` for the separate Palomar record), HTTPS, error-on-redirect, 12-second deadlines, 1.3 MB caps, fixed two target identities and **zero automatic writes**. GitHub Actions writes only the `original-source-gap-candidates` JSON artifact.

**Semantic limitation:** DataCite DOI creation/registration is *not* established as Zenodo's precise version-first-public instant, even if it coincides with the same date. Public DOI metadata may change and record 23450488 is not necessarily the original v1. An exact `registered` time can only be cited as a **DOI registry event**, not a source-release event, without additional evidence. Do not upgrade `publishedAt`, `chronology.milestone`, or mathematical-proof validity based on a mere DataCite timestamp. If DataCite or Zenodo is blocked, preserve explicit failure reason as `UNRESOLVED`.

## Acceptance and follow-up

1. Existing unit tests and new tests cover DOI identity, unrelated DOI rejection and Zenodo 403 with DataCite fallback.
2. Run the existing read-only `source-gap-evidence-probe.yml` workflow and inspect its **real, first-party** HTTP response artifact; tests of mocked data do **not** certify real timestamps.
3. Update Issue #127 with source statuses, DOI identity, exact semantics, and any resolved next step. Only a separate reviewed content PR may add a news timestamp if a matching public release can actually be demonstrated.

All original 314 articles, 96 legacy date-only fields and immutable URLs remain untouched by this PR.

## Real first-party GitHub Actions acceptance (2026-10-30 UTC)

The [official read-only source-gap probe run #41101972353](https://github.com/Charlie-Wang-03/ai4math-radar/actions/runs/41101972353) **PASS**, with the immutable `original-source-gap-candidates` artifact **ID 12997559280**. Unlike mocked tests, these values came from actual network requests executed by GitHub Actions, printed in the step logs and captured in the JSON artifact.

- **Zenodo original `https://zenodo.org/api/records/23450488`**: HTTP **403**, first-party metadata could not be read; `matched=false`. Response SHA-256 `cb46b269ceeab19b634f0cc38e24bdcfd6e05551bf7d34ae65209129c3056822`.
- **DataCite DOI `10.5281/zenodo.23450488`**: HTTP **200**, exact DOI/title/landing-record-ID match `doiMatched=true`, state **`findable`**, **version `3`**. `created = registered = 2026-10-18T15:39:11.000Z`, `published = \"2026\"` (year only), `publicationYear=2026`, landing URL `https://zenodo.org/doi/10.5281/zenodo.23450488`. Response SHA-256 `792affe2243ff8253c898112a579cccb00a862bd8f1896bbdef499d166896804`.
- These observations **do not** establish Zenodo version 3's earliest public record release instant or validate that the user's source displayed publication day (Oct 19) is an externally generated date. Even though Zenodo's published deposition documentation describes DOI registration upon publication, registration and public landing-page accessibility remain distinct evidence types, and public pre-registration/reservation semantics and record-vs-draft visibility require independent confirmation. **No news timestamp is promoted.**
- The adjacent **Palomar v2** record remains accurately matched and already handled in PR #131: `PALOMAR-2026-08-31-000013` v2 `registered_at=2026-09-06T08:42:06Z`, registry child HTTP 200, source digest `a9cde8b0b80a673a2749a450a58d26f12c5208b5deb688b98f11ffe65fb2abde`. This repeat is a regression check, not a new claim.

**Important discrepancy for the next review:** Version 3's DOI registry creation is Oct **18** UTC, while the Radar record quotes Zenodo's user-visible Oct **19** publication day. Without authenticated Zenodo page/API first-public metadata, do not collapse these dates into one event or silently change `publishedAt`. See [Issue #127](https://github.com/Charlie-Wang-03/ai4math-radar/issues/127).
