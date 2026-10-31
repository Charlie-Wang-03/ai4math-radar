# Batch 35 — original arXiv historical RSS snapshots via the Internet Archive

Checked 2026-10-31. This is a **read-only, fixed-source research experiment**, not a publication-time migration.

## Problem

Two remaining items lack an archived **original arXiv `new` listing**:
- `2026-09-29-genlimitlib`, [arXiv 2609.36663](https://arxiv.org/abs/2609.36663), submitted **2026-09-29T04:06:07Z**; archived [cs.LO announcement feed](https://github.com/ehijano/rss_fetch/blob/e597e5120c034115fda2049d72812f2da7f99f3a/rss_data/cs.LO/2026-09-30_cs.LO.xml) shows Sept30 **`cross`**, not the primary **cs.LG `new`** item. A [derived secondary paper record](https://github.com/qhduan/cn-chat-arxiv/blob/968aefd7525b8933f8f697c04dad7f5107cbfcc5/papers/26/09/2609.36663.json) reports v1 `new`, but its original announcement date is not independently preserved.
- `2023-06-02-checkmate`, [arXiv 2306.01694](https://arxiv.org/abs/2306.01694), submitted **2023-06-02T17:12:25Z**; [coauthor-hosted manuscript](https://wenda302.github.io/assets/pdf/eval_LM_Kate.pdf) is dated **June5**, and a [2023-06-05 derivative arXiv daily listing](https://github.com/wwd29/arxiv-daily/blob/763279dd0d1bf3673215152b54bb1c48b901fa7a/html/user_0/2023-06-05.html) mentions the exact paper. Neither proves that this is the date of the **official new arXiv announcement**.

## Fixed historical provider evidence probe

An original arXiv publisher RSS item has [well-defined `arxiv:announce_type` semantics](https://info.arxiv.org/help/rss_specifications.html): `new` denotes first release on arXiv, `cross` a cross-category listing, `replace` a revision. The new `scripts/probe-historic-arxiv-rss-wayback.mjs` runs a read-only search of the **Internet Archive CDX** for pre-existing captures of **https://rss.arxiv.org/rss/cs.LG**, limited to:

| Canonical ID | Exact arXiv ID | CDX archive date window |
| --- | --- | --- |
| GenLimitLib | `2609.36663` | 2026-09-29 through 2026-10-03 |
| CheckMate | `2306.01694` | 2023-06-02 through 2023-06-09 |

- Search [CDX API](https://web.archive.org/cdx/search/cdx) for at most twelve capture metadata rows within each fixed date range, only HTTP 200 and **at most three actual archived response reads per target**.
- If original XML is available, match full arXiv ID, exact version **v1**, category feed source, `Announce Type: new` and item's real `pubDate`, separately preserving Wayback **capture time**, original item date, original XML SHA-256 digest and response status.
- HTTP 403, 429, 503, no captures, malformed XML, other versions or `cross` listings must remain **UNRESOLVED**. The Wayback timestamp is when an archive capture happened, **not** an event-release timestamp.
- Strict fixed URL and target identity, HTTPS, no redirects, 12-second request deadline, bounded 400 KB CDX / 4.4 MB XML, no user inputs, tokens, paid services, production networking, manual approvals or canonical data writes.
- Use existing GitHub Actions as a **short-lived, auditable, read-only runner**, with 30-day JSON artifact retention; deploying an additional long-running authenticated MCP server would add hosting, credentials and security complexity without providing a new source of historical evidence.
- These archived copies, even if original XML is recovered, require a **manual item/announcement verification and distinct content PR** before any `chronology.milestone` is populated.

## Acceptance

The isolated [workflow](../../.github/workflows/historic-arxiv-rss-wayback.yml) runs tests and the live source probe on a PR and on manual dispatch. Check actual GitHub Actions log and artifact; mock tests **do not** certify historical arXiv public dates. GitHub hosted Check, Docker, CodeQL and review must pass before merge.

No changes are made to the news catalog: currently **322** entries, **96** legacy date-only `publishedAt`, and (following PR #144) **three** date-only items still lacking optional source chronology. Stable IDs and old URL compatibility remain intact.
