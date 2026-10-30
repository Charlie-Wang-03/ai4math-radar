# Batch 16 — Re-open provider evidence probes for explicit day-only records (2026-10-30)

## Problem
The original read-only `deriveCanonicalProbes` excludes every record with an explicit `publishedAtPrecision` field. As the daily editorial process now writes `"day"` explicitly, the publication-evidence GitHub Action silently omits new Hexagon and Palomar records, even though provider machine fields have already proven effective for 90 legacy entries (Batch 09).

## Conservative fix
- Derive allowlisted probes for implicit midnight legacy records **or** explicit `publishedAtPrecision:"day"`.
- Require `selected:true`, and skip any record with already verified `chronology.milestone.precision: "second"|"minute"`, even where legacy `publishedAt` stays a midnight placeholder due to permalink date conflicts.
- Keep original Hexagon v1 identity and Palomar exact `id/version` URL selection; no anonymous/arbitrary source URLs.
- This is **research-only**; it does not promote publishedAt, chronology or edit canonical news data. The original provider JSON and source URL must be inspected before a separate data correction PR.

## Initial intended scope
The newest canonical branch includes 8 Hexagon Oct29 explicit-day news and 2 Palomar versioned entries from Oct23/Oct28. One additional Hexagon Oct28 Kisin entry already has day-only chronology (not exact). Other original allowlisted WordPress records may also qualify. Actual scan cardinality and source results must be determined by the GitHub Actions research artifact, not guessed from filenames.

## Controls
One file script update and one deterministic test update only. Continue to use `.github/workflows/publication-time-evidence-probe.yml` (contents-read-only, no secrets, no auto writes). Review the source host, ID, version and public-event semantics before any exact `publishedAt` promotion. Use `chronology.milestone` on cross-day cases per temporal contract #104.

Acceptance: Node tests + hosted required checks + actual probe artifact. Clock evidence is *not* theorem correctness or public research priority certification.
