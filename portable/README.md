# Portable data layer

This directory documents the deployment-neutral content interchange used by AI4Math Radar.

## Contract

Portable selected content uses the same field shape as the native Public API v1 selected snapshot.

One item per line:

```text
portable/content/selected.jsonl
```

The repository does not currently commit real production snapshots. Real exports belong in `.data/portable/` unless a future GitHub-native profile deliberately promotes Git to the canonical content store.

## Native → portable

From a running native deployment:

```bash
node scripts/export-portable-v1.ts \
  --base https://<running-site> \
  --out .data/portable/selected.jsonl
```

The exporter walks all pages of `/api/v1/selected/snapshot`, validates every item and writes:

```text
.data/portable/
├── selected.jsonl
└── manifest.json
```

It does not require database access.

## GitHub / ChatGPT mode

If `static-chatgpt` becomes active, ChatGPT may create or update portable JSONL directly, but every record must satisfy the same v1 item contract.

Important:

- preserve stable `id` values once published;
- `links.original` must remain the primary source URL;
- `links.aihot` is the product-local item URL and may need regeneration when the hosting base URL changes;
- `attribution.url` is likewise deployment-local;
- generated content must not claim stronger mathematical verification than the evidence supports.

## Static hosting adapter

A future static-site adapter should consume this contract rather than read PostgreSQL-specific tables or duplicate the editorial schema.

The adapter may derive:

- homepage indexes;
- category/tag indexes;
- RSS;
- `llms.txt`;
- static item pages;
- daily/weekly archive pages.

It should not invent runtime-only capabilities such as a live Fastify API, database-backed admin console or remote MCP server.

## Static → native

An importer is intentionally not implemented yet.

If a real switch back to `native-aihot` happens, build the importer from the portable contract at that time and test it against the actual static corpus. Implementing a speculative importer now would create maintenance burden without evidence of need.
