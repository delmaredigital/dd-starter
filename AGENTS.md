# AlgoEd Pages CMS — Agent Operating Manual

AlgoEd's Top 50 Schools League competition pages, built on Payload CMS with Puck visual editing. Content editors compose pages in the Puck editor; agents co-edit pages alongside humans via WebMCP tools registered on the editor page. Deployed on Railway at `pages.algoed.co`.

## Deployment & URLs

- **Domain**: `pages.algoed.co`
- **Admin**: `pages.algoed.co/p-kcCapdQH` (obscured path — see `payload.config.ts` for change checklist)
- **Puck editor**: `pages.algoed.co/p-kcCapdQH/puck-editor/pages/:id`
- **Page tree** (for folder renames): `pages.algoed.co/p-kcCapdQH/page-tree`

## ⚠️ GIT RULES ⚠️

**DEFAULT: NO commits, NO pushes. Ever.**

Override: only when the user's message contains `xyz` AND says what to commit/push.

- Each commit needs its own `xyz`. One keyword, one commit.
- **Pre-commit review**: Before every commit, diff all staged changes and review for fluff, redundancy, bugs, missing pieces. Report findings and fix before committing.

## ⚠️ PAGE EDITING — MANDATORY WORKFLOW ⚠️

**All page editing goes through WebMCP tools exposed via the `webmcp-bridge` MCP server.** **After connecting, ALWAYS run `list_webmcp_tools` (unfiltered, `summary: false`) first** — full tool descriptions contain critical info (e.g. API endpoints, cache busting) that summaries truncate. Never skip this step. Call tools via `call_webmcp_tool`. If tools aren't available (wrong page selected, not on Puck editor), **alert the user immediately** and ask them to navigate to the Puck editor page — or navigate there yourself via `select_page` / `navigate_page` if the editor tab exists. Do NOT fall back to raw curl/fetch as a workaround.

**NEVER** manipulate puckData JSON directly via raw fetch/evaluate_script. That bypasses schema validation, produces wrong field names, misplaced images, and broken pages.

**NEVER** use raw `fetch()` for Payload REST API calls. Use the `payload_api` WebMCP tool — its description documents all collection endpoints (`/api/pages`, `/api/payload-folders`, `/api/media`) and gotchas. Read the tool description before calling any API.

For **local file uploads**: try shell `curl POST /api/media` first (with user-supplied session cookie). If you get HTTP 403 + CF challenge page, **ask the user whether to disable CF Turnstile for this path** before proceeding — they may prefer relaxing the Cloudflare rule rather than the browser-fetch workaround. If the user declines or says "use the hack", use the browser-session path below:
1. Serve files from a CORS-enabled local HTTP server: `python3 -c "import http.server,socketserver; class H(http.server.SimpleHTTPRequestHandler):\n def end_headers(self): self.send_header('Access-Control-Allow-Origin','*'); super().end_headers()\nsocketserver.ThreadingTCPServer.allow_reuse_address=True; socketserver.ThreadingTCPServer(('',8765),H).serve_forever()" &` in the file dir
2. WebMCP `evaluate_script` on the Puck editor tab: `fetch('http://localhost:8765/<name>')` → `Blob` → multipart `FormData` with `file` + `_payload={"alt":"...","folder":ID}` → `POST /api/media` with `credentials:'include'`. Browser auto-sends auth cookies + passes CF.
3. Kill the server when done.

**NEVER base64-encode files** through the MCP (payload bloat, binary safety issues, wastes context window). Always stream bytes as a Blob. The `_payload` JSON field is required for folder assignment — plain `-F folder=2` is silently ignored on multipart uploads.

**Media filenames must be globally unique** — prefix with competition slug (e.g. `unc-hero-bg.png`). Folders map to R2 paths via `beforeChange` hook in `Media.ts`; unique names are defense in depth.

**Media naming**: clean, descriptive names. `raw` suffix only for archival source copies that need cropping/processing before production use — not for final assets.

**R2 re-uploads**: deleting and re-uploading with the same filename hits Cloudflare's edge cache. Ask user to purge the URL in Cloudflare dashboard.

### If WebMCP tools aren't available

Run `list_webmcp_tools` (via `webmcp-bridge`, unfiltered, `summary: false`) at the start of any page-editing session. If it returns empty:

1. **Ask the user to confirm a Puck editor tab is open** at `pages.algoed.co/p-kcCapdQH/puck-editor/pages/:id` and reload it. Tools register on editor load.
2. **Check the user's environment**: Chrome 144+ with remote debugging enabled at `chrome://inspect/#remote-debugging`.
3. **If the MCP servers are not installed at all** (one-time setup — give the human these commands to run):

   ```bash
   claude mcp add chrome-devtools-live npx chrome-devtools-mcp@latest -- --autoConnect
   claude mcp add webmcp-bridge npx @mcp-b/chrome-devtools-mcp@latest -- --autoConnect
   ```

   `chrome-devtools-live` provides browser automation (`evaluate_script`, `click`, etc.). `webmcp-bridge` discovers the page-registered WebMCP tools. Both need `--autoConnect` to attach to the user's running Chrome — without it, the bridge launches its own Chrome and tools won't be discoverable.

### Workflow gotchas

- **Never navigate the user's editor tab.** Use `new_page` for reference browsing.
- **Stale SSR after deploy**: reload the Puck editor → re-publish.
- **Page slug = hero title, kebab-cased.** "Junior" prefix for K-5 variants.
- **Skip fields that use defaults.** Components fall back to `defaultProps` when props are missing — don't pass them when creating pages: AwardsSection (heading, introText, all badges, teamAward, individualAward), JoinCTA (heading, body).

### Creating a Competition Page (end-to-end)

Each competition has two pages (HS/MS + Junior). For each page:

1. **Screenshot the Figma frame** — understand the full page visually before anything else.
2. **Ask user for a Figma node URL/ID per unique image slot.** This is not optional. Do not try to identify photos or composite groups by walking metadata, matching sizes, sorting by y-position, or inferring from node names — every one of those heuristics has misfired in practice. The user clicks the element in Figma, pastes the node reference, agent downloads that exact node. Shared slots (AboutLeague, CompetitionStructure hero, benefits icons, award badges, priority/regular/late icons) do NOT need user input — reference the existing CDN URLs directly (see image extraction section).
3. **Extract only what the user pointed** — `imageRef` lookup for raw photos, PNG 2x export for composite groups, SVG + SVGO for timelines. Save to `docs/<competition>-review/` for user to visually confirm before upload.
4. **Upload to Payload media** — create competition folder via `payload_api`, then upload via the browser-fetch pipeline documented above (local CORS server + `evaluate_script` multipart POST). Never base64, never shell curl.
5. **Create or open the Puck page** — check if the page exists first (`/api/pages?where[slug][equals]=...`). If it exists, navigate to it. If not, create via POST to `/api/pages`. Then open in the Puck editor.
6. **Clone from the cleanest existing page as starting puckData** — do NOT hand-author from scratch. Pick the existing competition page with the least customization drift (most template placeholders intact, fewest explicit prop overrides). Heuristic: fetch candidate puck_data and count set props on each component; lower wins. Use that JSON as the base and overlay per-competition values (root: colors, heroTheme, folder, slug, title; component props: text overrides, image URLs).
7. **Wire all components** — populate every component with text (from the Figma frame for THIS competition, see "Figma text extraction" below) and images (from uploaded media URLs). Use `update_page` via WebMCP. **Text is copied VERBATIM** — preserve typos, inconsistent casing (`science & Engineering`), stale years (`competition 2026` even when it's actually 2027), trailing/leading whitespace, Unicode curly quotes, and `{{…}}` tokens. **`{{…}}` tokens are intentional literal rendered text**, not placeholders the agent is supposed to fill in — e.g. the live page is meant to read `Distinguish Yourself at {{Competition name}} Competition` with the braces visible. Do not substitute values on your own. If you think a `{{…}}` should be resolved, ASK the user; otherwise keep the braces. Do NOT "smarten" or correct. Cloning an existing competition page is for STRUCTURE only (component order, root prop shape) — discard all its text and overlay the target Figma's characters. If a component's props match the defaults, do NOT set them explicitly — let defaultProps handle it. Explicit data overrides defaults and makes global changes harder (e.g. AwardsSection badges — fix defaults once vs patch every page).
8. **Populate page-level meta** (separate from puck_data root) — `PATCH /api/pages/:id -d '{"meta":{"title":"…","description":"…"}}'`. `generateMeta.ts` reads `pages.meta_title` / `meta_description` columns, NOT `puckData.root.metaTitle`. Skipping this ships empty `<title>` + missing OG. The API path runs `afterChange: revalidatePage` so ISR invalidates for the edited page.
9. **Grep for `{{…}}` tokens** before publish: `grep -oE '{{[^}]+}}'` against rendered HTML or puck_data. These are NOT bugs by default — they're literal Figma text that must survive verbatim (see step 7). Only resolve a `{{…}}` when the user tells you what value to substitute for that specific token. Default action: leave them in place.
10. **Save, reload, publish** — always: `save_page` → reload editor (confirms persisted state) → click Publish. Default final step for every page edit. Verify the public URL loads correctly.

The deliverable is a fully wired, published Puck page — not just uploaded images.

## Component Code Edits

### File convention (`.render.tsx` vs `.tsx`)

Each Puck component is split into two files:

```
src/components/puck/
  ComponentName.render.tsx   — types, defaultProps, render function (server-safe)
  ComponentName.tsx          — imports from .render, adds Puck field definitions (client-only)
  shared.tsx                 — AccentBar, CompetitionCTA, safeHex
  index.ts                   — client component registry
  index.server.ts            — server component registry (uses `as any` for extendConfig boundary)
```

The split is required because `createMediaField` (used in `.tsx`) is client-only, while server rendering needs the types and render function from `.render.tsx`. **For most edits (text, styling, layout), edit `.render.tsx`.** Only edit `.tsx` when changing field definitions exposed to the editor.

### Parity with Webflow source — STRICT

- **Default: 100% parity with source.** Every font size, weight, line-height, color, spacing, padding, margin, grid gap must match the Webflow source CSS exactly. No drift, no "close enough."
- **Verify against computed styles, not just CSS files.** Webflow applies styles at runtime (inline, shared stylesheets) that don't appear in page-specific CSS. Check computed styles on the live page via Chrome DevTools.
- **Diverge only with strong reason.** If Tailwind conventions are objectively better AND visually identical, that's OK. Document why.

### Styling: Tailwind + inline

- **Tailwind classes for**: layout (grid, flex), responsive breakpoints, spacing (margin, padding, gap), font weight, static text color, display, alignment.
- **Inline styles only for**: dynamic values from props (e.g. `primaryColor`, `highlightTextColor`), values that must match source exactly and aren't Tailwind presets.
- **Never use**: a separate CSS file for component styles, or inline styles for things Tailwind handles.

### Responsive

- Tailwind responsive prefixes: `grid-cols-1 md:grid-cols-2`, `gap-2.5 md:gap-10`, `px-4 md:px-0`.
- Desktop first; stack on mobile via `grid-cols-1` → `md:grid-cols-N`.
- Container: `max-w-[940px] mx-auto px-4 md:px-0` — matches Webflow's 940px max-width with mobile padding.

### Adding a new component type or modifying WebMCP plumbing

See `.cursor/rules/puck-extension.md` — covers the Webflow → Puck flow, file registry wiring, and WebMCP architecture.

## Patched Dependencies

When bumping versions of these packages, check if the patch in `patches/` still applies and if the upstream bug is fixed. If fixed upstream, remove the patch.

- **`@delmaredigital/payload-puck`** — `FolderPickerField.js` hardcodes `/admin/page-tree`. Patched to derive admin prefix from URL. Upstream issue: filed informally, no tracking number yet.
- **`@delmaredigital/payload-page-tree`** — On upstream `^0.3.14`, which fixes the cascade deadlock (issue #2) and hardcoded `/admin` (issue #3). No local patch.

## Migrations on this fork

When merging `upstream/main`, **patch upstream's migration `.ts` before committing**:
- Switch import to `@payloadcms/db-postgres` (we don't use `db-vercel-postgres`).
- Add `IF NOT EXISTS` to any `ALTER TYPE ... ADD VALUE` we may have shipped earlier.

If upstream catches up to a change we shipped (e.g. `20260424_202032` superseded our `20260416_015924`), delete our preemptive file and run `DELETE FROM payload_migrations WHERE name = '<our-name>'` per env — then deploy. Upstream's (now-idempotent) migration becomes the canonical record. Reserves our migration history for genuine fork-only schema (e.g. `20260413_041646_r2_media_prefix_column`).

## Prettier — what to format

**Rule**: format only files that don't exist on `main`. Leave files that exist on `main` alone, even when we've modified them.

**Why**: `main` (the upstream starter) isn't prettier-clean — reformatting its lines in our branch creates conflicts on every future pull from upstream. Our new files live almost entirely under `src/puck/`, `src/components/puck/`, `src/lib/puck/`, `src/lib/webmcp/`, `src/lib/competition-image/`, `src/app/api/og/`, `src/app/api/competition-image/`, `public/competition-assets/`.

**Test**: `git show main:<path>` fails → new → format. Succeeds → leave it.

**Batch command**: `git diff main...HEAD --name-only --diff-filter=A | grep -E '\.(ts|tsx|css|mjs|js)$' | xargs npx prettier --write`

## Core Principles

1. **TypeScript-First**: Always use TypeScript with proper types from Payload
2. **Security-Critical**: Follow all security patterns, especially access control
3. **Type Generation**: Run `generate:types` script after schema changes
4. **Transaction Safety**: Always pass `req` to nested operations in hooks
5. **Access Control**: Understand Local API bypasses access control by default
6. **Access Control**: Ensure roles exist when modifiyng collection or globals with access controls

### Figma Source

File: `UvxPI6vPpl72ATLvSkbade` — "AlgoEd New" (team shared version)
Master page: "Top 50 Schools League" (`6214:15184`) — start here.
Each competition section contains multiple child frames (HS, Junior, Mobile).
Fetch the specific HS desktop frame, not the section root — the root includes
all variants and produces duplicates. Ask the user for the exact Figma URL
if the right frame isn't obvious.

**Prefer MCP tools over REST API.** Use Figma MCP (`get_metadata`, `get_design_context`, `get_screenshot`) and WebMCP (`payload_api`, `upload_image`) as default. REST API is justified only when MCP can't do the job — e.g. `imageRef` extraction from fills, composite PNG export, or `curl` uploads referencing local disk files. Read current state (screenshot, page data, Figma design) before any action — don't work from memory.

**Figma text has copy-paste errors.** Pages are cloned from a template — org/competition names often reference the wrong competition. Flag mismatches, don't silently copy them.

**Figma text extraction (canonical method — use this, don't reinvent):** REST `GET /v1/files/:key/nodes?ids=<frameId>` with `X-Figma-Token`. Walk the returned document tree recursively; for every node with `type == "TEXT"`, read the `characters` field (the actually-rendered text, including typos/whitespace/curly quotes/`{{placeholders}}`). Record each with its `absoluteBoundingBox.y`/`x` to infer which component slot it belongs to. Do NOT use the layer `name` field — layer names get renamed to generic things like "heading" and drop the actual content. `characters` is always the real rendered text.

**⚠️ Figma image extraction — human-points-node is MANDATORY**

**The rule**: every photo or composite group comes from a Figma node URL/ID the user provides. Agent does NOT pick nodes by walking the frame, matching sizes, sorting by y-position, grouping by parent, or reading layer names. Those heuristics have all been tried and all misfire, because per-competition Figma frames contain copy-paste artifacts, duplicate layers, and unreplaced shared-placeholder content sitting in per-comp slots. Ask; don't guess.

**Prompt the user in plain terms**: *"Paste the Figma node URL (or node ID) for the [hero bg / fostering composite / etc.]."* Accept any form — browser URL with `?node-id=X-Y`, `X:Y` ID, or `X-Y` ID. All are valid API inputs.

Once you have the node, extract based on what the user said it is:

- **Raw photo fill** (partner logo, hero bg, about photo, joincta circle): `GET /v1/files/:key/nodes?ids=:id` → read `imageRef` from `fills` → look up full-res source at `GET /v1/files/:key/images` → `meta.images[imageRef]`.
- **Composite group** (fostering, deadline): `GET /v1/images/:key?ids=:nodeId&format=png&scale=2`. The node URL from the user is already the right group — do not walk ancestors.
- **SVG (timelines)**: `GET /v1/images/:key?ids=:nodeId&format=svg` → `npx svgo`. If the SVG contains embedded `base64` raster → re-export as PNG instead.

**Check shared assets FIRST — never re-upload these; reference existing CDN URLs:**

| Slot | Shared asset | Used on |
|---|---|---|
| AboutLeague featureImage | `shared-league-photos-2x.png` | all competitions |
| CompetitionStructure heroImage (HS) | `challenge-hero-hs.png` | all HS pages |
| CompetitionStructure heroImage (Jr) | `challenge-hero-jr-raw.png` | all Junior pages |
| AboutPartner featureImage (fallback) | `shared-about-building.png` | schools without unique campus photo (UNC, Rutgers, UCI, Rice) |
| Benefits icons | `public/competition-assets/benefit-*.svg` | selected via `iconKey` enum |
| Award badges | `public/competition-assets/award-*.png` | selected via `badgeIcon` enum |
| Priority/regular/late deadline icons | `public/competition-assets/priority.png` etc. | selected via `variant` enum |
| Decorative frames inside composites (293×197 rectangles) | part of the composite export | n/a — don't extract separately |

**Always per-competition unique — upload for each new school:**

| Slot | Extract as | Notes |
|---|---|---|
| `CompetitionNav.partnerLogo` | raw `imageRef` | school EWB chapter logo |
| `CompetitionHero.backgroundImage` | raw `imageRef` | school campus photo |
| `CompetitionHero.heroImage` | composite parent group PNG at 2x, OR `null` | some comps have no separate illustration — set to null |
| `AboutPartnerV2.featureImage` | raw `imageRef` (or skip if using shared fallback) | school-specific campus photo |
| `FosteringSection.featureImage` | composite parent group PNG at 2x | multiple photos + decor |
| `DeadlineTable.featureImage` | composite parent group PNG at 2x | multiple photos + decor |
| `JoinCTA.photo` | raw `imageRef` from ellipse fill only | globe frame is in component code — do NOT export composite |
| `ResponsiveImageSection.desktopImage` + `.mobileImage` | SVG + SVGO | per-competition dates; show user before upload |

**When Figma shows a shared placeholder in a per-comp slot**: common pattern — designer hasn't filled in per-comp content yet, so the frame still shows e.g. the About STEM graphic in the fostering slot. Flag it to the user and skip upload; don't create a duplicate of a shared asset under a new name.

**HS vs Junior within the same school**: default is **most assets shared** — same partner logo, same hero bg, same hero illustration, same AboutPartner photo, same JoinCTA circle, same timeline dates. Upload once, reference from both pages. The slots most likely to genuinely differ between HS and Jr are the two-column composites (fostering, deadline) — because the designer may swap photos to reflect age-appropriate content. Only when the user explicitly points to a different node for HS vs Jr, upload both with `jr-` prefix for the Junior one (e.g. `thurj-fostering-photos.png` vs `thurj-jr-fostering-photos.png` — matches page slug).

**Gotchas**:
- Figma MCP `get_design_context` is NOT for images — it decomposes groups into individual vector parts. Use REST `/v1/images/:key?ids=…` for PNG/SVG export.
- Figma PNG export preserves alpha — black in viewers = transparent, not broken.
- Save extracts to `docs/<competition>-review/` for user visual confirm. Never `/tmp/`.

| Section node | Competition | HS desktop frame | Junior frame | Status |
|---|---|---|---|---|
| `6392:24638` | UNC | `6391:14298` | `6272:33298` | ✅ Both done |
| `6392:29351` | THURJ | `6386:14219` | `6391:19998` | ✅ Both done |
| `6391:11413` | Boston | `6272:25391` | `6293:12596` | ✅ Both done |
| `6413:24208` | Stanford | `6413:24209` | `6413:25999` | ✅ Both done |
| `6272:26901` | UIUC | `6272:26901` | `6486:11601` | ✅ Both done |
| `6392:24639` | UCI | `6391:16219` | `6272:34603` | ✅ Both done |
| `6392:24640` | Rice University | `6391:18150` | `6382:11349` | ✅ Both done |
| `6391:14297` | Rutgers | `6391:11414` | `6275:621` | ✅ Both done |
| (Yale section node unrecorded) | Yale | — | — | ✅ Both done |
| `6486:15093` | Washington University | `6486:15093` | `6486:16873` | ✅ Both done (text + media; timeline TBD) |

### Figma-to-CSS Convention

Figma designs at 1728px frame width. All sizing scales **× 0.75** to CSS. Prefer Tailwind design tokens over exact values, inferring designer intent. See `src/components/puck/shared.tsx` for scale table and section width tiers.

### Editing puckData

Drafts are **always on** for Pages. Every save creates a `_pages_v` row; `pages.puck_data` is the published copy. If these two drift, the next Puck editor save (or any Payload API write) loads the stale draft as the base and silently clobbers the published state. Use one of the two patterns below — never write to `pages.puck_data` alone.

Helper: `scripts/puck-update.py --id <pid> --data <file.json> [--mode api|sql]`

**Pattern A — sync-latest (SQL, for batched migrations):** single transaction
```sql
BEGIN;
UPDATE pages SET puck_data = $1::jsonb WHERE id = $pid;
UPDATE _pages_v SET version_puck_data = $1::jsonb
  WHERE parent_id = $pid AND latest = true;
COMMIT;
```
Then `POST /api/revalidate-all`. Overwrites the latest version in place — history lost, but fast.

**Pattern C — API PATCH (default):** `PATCH /api/pages/:id` with `{"puckData": {...}}`. Payload handles versioning, hooks, and revalidation. Use this for one-off edits. WebMCP `update_page` uses this path.

**Shape rules (both patterns):**
- Use `jsonb_set` to target the deepest specific field — don't replace a whole object/array if you only need one sub-field.
- When you do replace a field, write the **complete** value. The server renderer shallow-merges `defaultProps` with stored props — a missing key gets the default, but a partial value (e.g. `tiers: [{title: "A"}]` missing `fee`/`variant`) overrides the default entirely.

**Drift audit (run after any bulk SQL migration):**
```sql
SELECT p.id FROM pages p
LEFT JOIN _pages_v v ON v.parent_id = p.id AND v.latest = true
WHERE p.puck_data IS NOT NULL
  AND (v.version_puck_data IS NULL
    OR md5(p.puck_data::text) != md5(v.version_puck_data::text));
```
Zero rows = safe. Any row means the next editor save will regress that page.

### Code Validation

- To validate typescript correctness after modifying code run `tsc --noEmit`
- Generate import maps after creating or modifying components.

### Media Sizes (all 7)

`Media.ts` `imageSizes` generates **seven** variants on every upload: `thumbnail` (300w), `square` (500×500), `small` (600w), `medium` (900w), `large` (1400w), `xlarge` (1920w), `og` (1200×630 center-cropped). Each has its own `sizes_<name>_*` columns in the `media` table.

Any R2 ↔ DB audit query MUST union across **all seven** `sizes_*_filename` columns — not just thumbnail/small/medium/large/og. Missing `square` + `xlarge` from an audit wrongly flags ~20% of every upload's files as orphans. `scripts/media-pipeline.py audit` gets this right.

### Maintenance Scripts

- **`scripts/puck-update.py`** — safe puckData writer; `--mode api` (PATCH via Payload, default) or `--mode sql` (both-table sync). Never write `pages.puck_data` alone (see "Editing puckData").
- **`scripts/media-pipeline.py`** — media lifecycle commands: `check <id>` (per-row sanity), `reupload <id>` (full flow: download raw from R2 S3 API → verify MD5==ETag → delete → re-upload → verify byte-identity), `reupload-batch <file>`, `fix-ids` (walk all puckData, swap stale media IDs where URL resolves to a different current ID), `audit` (R2 ↔ DB + stale-ID drift).

### Folder Rename & Slug Propagation

**Do NOT rename folders via the standard Payload admin form.** It saves the folder but intentionally skips slug cascade — pages keep stale URLs. Use the **page-tree view** (`/p-kcCapdQH/page-tree`) which sets `context.updateSlugs = true` to propagate slug changes to all linked pages. Alternatively: `POST /api/page-tree/regenerate-slugs?folderId=<id>`.

`pathSegment` controls the URL piece, not `name`. The cascade hook (`cascadeSlugUpdates`) only fires when triggered through the tree view or API — never from the standard edit form. This is a safety measure to prevent accidental URL breakage.

**⚠️ The cascade does NOT propagate to existing media.** Folder rename updates `payload_folders.name` + page slugs only. Existing `media.prefix` column stays at the old value and R2 object keys are not moved/renamed. Page URLs keep working (media is still served from old R2 paths), but you have drift: folder `name=washu-ewb` while media prefix is still `pages/wash-ewb/`. New uploads to the renamed folder go to the new path, creating a mixed state.

To fully realign, run a media migration per-file: download raw bytes from R2 S3 API → DELETE media row → re-upload via Payload API (beforeChange hook writes the new prefix) → swap puckData URL refs. `scripts/media-pipeline.py reupload` implements this.

## Additional Context Files

Topic-specific docs in `.cursor/rules/`. Read the relevant file on demand — don't preload.

### Fork-specific

- **`puck-extension.md`** — Read when adding a new Puck component type (Webflow → Puck flow, file registry wiring) or modifying the WebMCP plumbing (`src/lib/webmcp/`, `src/puck/webmcp-plugin.tsx`). Daily editing rules already live in this file (CLAUDE.md).

### Upstream Payload reference

1. **`payload-overview.md`** - High-level architecture and core concepts

   - Payload structure and initialization
   - Configuration fundamentals
   - Database adapters overview

2. **`security-critical.md`** - Critical security patterns (⚠️ IMPORTANT)

   - Local API access control
   - Transaction safety in hooks
   - Preventing infinite hook loops

3. **`collections.md`** - Collection configurations

   - Basic collection patterns
   - Auth collections with RBAC
   - Upload collections
   - Drafts and versioning
   - Globals

4. **`fields.md`** - Field types and patterns

   - All field types with examples
   - Conditional fields
   - Virtual fields
   - Field validation
   - Common field patterns

5. **`field-type-guards.md`** - TypeScript field type utilities

   - Field type checking utilities
   - Safe type narrowing
   - Runtime field validation

6. **`access-control.md`** - Permission patterns

   - Collection-level access
   - Field-level access
   - Row-level security
   - RBAC patterns
   - Multi-tenant access control

7. **`access-control-advanced.md`** - Complex access patterns

   - Nested document access
   - Cross-collection permissions
   - Dynamic role hierarchies
   - Performance optimization

8. **`hooks.md`** - Lifecycle hooks

   - Collection hooks
   - Field hooks
   - Hook context patterns
   - Common hook recipes

9. **`queries.md`** - Database operations

   - Local API usage
   - Query operators
   - Complex queries with AND/OR
   - Performance optimization

10. **`endpoints.md`** - Custom API endpoints

    - REST endpoint patterns
    - Authentication in endpoints
    - Error handling
    - Route parameters

11. **`adapters.md`** - Database and storage adapters

    - MongoDB, PostgreSQL, SQLite patterns
    - Storage adapter usage (S3, Azure, GCS, etc.)
    - Custom adapter development

12. **`plugin-development.md`** - Creating plugins

    - Plugin architecture
    - Modifying configuration
    - Plugin hooks
    - Best practices

13. **`components.md`** - Custom Components

    - Component types (Root, Collection, Global, Field)
    - Server vs Client Components
    - Component paths and definition
    - Default and custom props
    - Using hooks
    - Performance best practices
    - Styling components

## Resources

- Docs: https://payloadcms.com/docs
- LLM Context: https://payloadcms.com/llms-full.txt
- GitHub: https://github.com/payloadcms/payload
- Examples: https://github.com/payloadcms/payload/tree/main/examples
- Templates: https://github.com/payloadcms/payload/tree/main/templates
