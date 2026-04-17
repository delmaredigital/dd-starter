# Payload CMS Development Rules

## ⚠️ GIT RULES ⚠️

**DEFAULT: NO commits, NO pushes. Ever.**

Override: only when the user's message contains `xyz` AND says what to commit/push.

- Each commit needs its own `xyz`. One keyword, one commit.
- **Pre-commit review**: Before every commit, diff all staged changes and review for fluff, redundancy, bugs, missing pieces. Report findings and fix before committing.

You are an expert Payload CMS developer. When working with Payload projects, follow these rules:

## ⚠️ PAGE EDITING — MANDATORY WORKFLOW ⚠️

**All page editing goes through WebMCP tools exposed via the `webmcp-bridge` MCP server.** **After connecting, ALWAYS run `list_webmcp_tools` (unfiltered, `summary: false`) first** — full tool descriptions contain critical info (e.g. API endpoints, cache busting) that summaries truncate. Never skip this step. Call tools via `call_webmcp_tool`. If tools aren't available (wrong page selected, not on Puck editor), **alert the user immediately** and ask them to navigate to the Puck editor page — or navigate there yourself via `select_page` / `navigate_page` if the editor tab exists. Do NOT fall back to raw curl/fetch as a workaround.

**NEVER** manipulate puckData JSON directly via raw fetch/evaluate_script. That bypasses schema validation, produces wrong field names, misplaced images, and broken pages.

**NEVER** use raw `fetch()` for Payload REST API calls. Use the `payload_api` WebMCP tool — its description documents all collection endpoints (`/api/pages`, `/api/payload-folders`, `/api/media`) and gotchas. Read the tool description before calling any API.

For **local file uploads**: STOP and ask user for a curl from Chrome DevTools Network tab, then shell-upload to `POST /api/media` with `-F file=@/path -F '_payload={"alt":"desc","folder":ID}'`. The `_payload` JSON field is required for folder assignment — plain `-F folder=2` is silently ignored on multipart uploads.

**Media filenames must be globally unique** — prefix with competition slug (e.g. `unc-hero-bg.png`). Folders map to R2 paths via `beforeChange` hook in `Media.ts`; unique names are defense in depth.

**Media naming**: clean, descriptive names. `raw` suffix only for archival source copies that need cropping/processing before production use — not for final assets.

**R2 re-uploads**: deleting and re-uploading with the same filename hits Cloudflare's edge cache. Ask user to purge the URL in Cloudflare dashboard.

### Creating a Competition Page (end-to-end)

Each competition has two pages (HS/MS + Junior). For each page:

1. **Screenshot the Figma frame** — understand the full page visually before anything else.
2. **Ask user for a Figma node URL/ID per unique image slot.** This is not optional. Do not try to identify photos or composite groups by walking metadata, matching sizes, sorting by y-position, or inferring from node names — every one of those heuristics has misfired in practice. The user clicks the element in Figma, pastes the node reference, agent downloads that exact node. Shared slots (AboutLeague, CompetitionStructure hero, benefits icons, award badges, priority/regular/late icons) do NOT need user input — reference the existing CDN URLs directly (see image extraction section).
3. **Extract only what the user pointed** — `imageRef` lookup for raw photos, PNG 2x export for composite groups, SVG + SVGO for timelines. Save to `docs/<competition>-review/` for user to visually confirm before upload.
4. **Upload to Payload media** — create competition folder via `payload_api`, upload via curl with `_payload` JSON for folder assignment.
5. **Create or open the Puck page** — check if the page exists first (`/api/pages?where[slug][equals]=...`). If it exists, navigate to it. If not, create via POST to `/api/pages`. Then open in the Puck editor.
6. **Clone from the cleanest existing page as starting puckData** — do NOT hand-author from scratch. Pick the existing competition page with the least customization drift (most template placeholders intact, fewest explicit prop overrides). Heuristic: fetch candidate puck_data and count set props on each component; lower wins. Use that JSON as the base and overlay per-competition values (root: colors, heroTheme, folder, slug, title; component props: text overrides, image URLs).
7. **Wire all components** — populate every component with text (from Figma `get_metadata`) and images (from uploaded media URLs). Use `update_page` via WebMCP. If a component's props match the defaults, do NOT set them explicitly — let defaultProps handle it. Explicit data overrides defaults and makes global changes harder (e.g. AwardsSection badges — fix defaults once vs patch every page).
8. **Populate page-level meta** (separate from puck_data root) — `PATCH /api/pages/:id -d '{"meta":{"title":"…","description":"…"}}'`. `generateMeta.ts` reads `pages.meta_title` / `meta_description` columns, NOT `puckData.root.metaTitle`. Skipping this ships empty `<title>` + missing OG. The API path runs `afterChange: revalidatePage` so ISR invalidates for the edited page.
9. **Grep for leftover placeholders** before publish: `grep -oE '{{[^}]+}}'` against the rendered HTML or puck_data — must return 0. Known vocabulary seen in templates: `{{Competition name}}`, `{{Competition Name}}`, `{{University name}}`, `{{Date}}`, `{{Date and time}}`, `{{university + student + profession}}`.
10. **Save, reload, publish** — always: `save_page` → reload editor (confirms persisted state) → click Publish. Default final step for every page edit. Verify the public URL loads correctly.

The deliverable is a fully wired, published Puck page — not just uploaded images.

Full docs: `.cursor/rules/webmcp-agent-tools.md`

## Patched Dependencies

When bumping versions of these packages, check if the patch in `patches/` still applies and if the upstream bug is fixed. If fixed upstream, remove the patch.

- **`@delmaredigital/payload-puck`** — `FolderPickerField.js` hardcodes `/admin/page-tree`. Patched to derive admin prefix from URL. Upstream issue: filed informally, no tracking number yet.
- **`@delmaredigital/payload-page-tree`** — Using inlined copy at `src/plugins/page-tree/` instead of npm package. Fixes: deadlock on folder edit-url cascade (missing `req`), hardcoded `/admin` in nav link and edit action. Upstream issues: delmaredigital/payload-page-tree#2, #3. When both are fixed upstream, switch import in `src/plugins/index.ts` back to `@delmaredigital/payload-page-tree` and delete the inlined copy.

## Prettier — what to format

**Rule**: format only files that don't exist on `main`. Leave files that exist on `main` alone, even when we've modified them.

**Why**: `main` (the upstream starter) isn't prettier-clean — reformatting its lines in our branch creates conflicts on every future pull from upstream. Our new files live almost entirely under `src/puck/`, `src/components/puck/`, `src/lib/puck/`, `src/lib/webmcp/`, `src/plugins/page-tree/`, `src/app/api/og/`, `public/competition-assets/`.

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

**Figma text extraction:** Use `get_metadata` — text lives in `<text name="actual content">` nodes. Parse with Python stdlib: `json.load` → wrap in `<root>` → `xml.etree.ElementTree` → iterate `text` elements → `html.unescape(el.get('name'))`. If any names look like renamed layers (generic "heading", "label", etc.), fetch `get_design_context` for those nodes only.

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

## Project Structure

```
src/
├── app/
│   ├── (frontend)/          # Frontend routes
│   └── (payload)/           # Payload admin routes
├── collections/             # Collection configs
├── globals/                 # Global configs
├── components/              # Custom React components
├── hooks/                   # Hook functions
├── access/                  # Access control functions
└── payload.config.ts        # Main config
```

## Configuration

### Minimal Config Pattern

```typescript
import { buildConfig } from 'payload'
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { fileURLToPath } from 'url'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: 'users',
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URL,
  }),
})
```

## Collections

### Basic Collection

```typescript
import type { CollectionConfig } from 'payload'

export const Posts: CollectionConfig = {
  slug: 'posts',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'author', 'status', 'createdAt'],
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', unique: true, index: true },
    { name: 'content', type: 'richText' },
    { name: 'author', type: 'relationship', relationTo: 'users' },
  ],
  timestamps: true,
}
```

### Auth Collection with RBAC

```typescript
export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  fields: [
    {
      name: 'roles',
      type: 'select',
      hasMany: true,
      options: ['admin', 'editor', 'user'],
      defaultValue: ['user'],
      required: true,
      saveToJWT: true, // Include in JWT for fast access checks
      access: {
        update: ({ req: { user } }) => user?.roles?.includes('admin'),
      },
    },
  ],
}
```

## Fields

### Common Patterns

```typescript
// Auto-generate slugs
import { slugField } from 'payload'
slugField({ fieldToUse: 'title' })

// Relationship with filtering
{
  name: 'category',
  type: 'relationship',
  relationTo: 'categories',
  filterOptions: { active: { equals: true } },
}

// Conditional field
{
  name: 'featuredImage',
  type: 'upload',
  relationTo: 'media',
  admin: {
    condition: (data) => data.featured === true,
  },
}

// Virtual field
{
  name: 'fullName',
  type: 'text',
  virtual: true,
  hooks: {
    afterRead: [({ siblingData }) => `${siblingData.firstName} ${siblingData.lastName}`],
  },
}
```

## CRITICAL SECURITY PATTERNS

### 1. Local API Access Control (MOST IMPORTANT)

```typescript
// ❌ SECURITY BUG: Access control bypassed
await payload.find({
  collection: 'posts',
  user: someUser, // Ignored! Operation runs with ADMIN privileges
})

// ✅ SECURE: Enforces user permissions
await payload.find({
  collection: 'posts',
  user: someUser,
  overrideAccess: false, // REQUIRED
})

// ✅ Administrative operation (intentional bypass)
await payload.find({
  collection: 'posts',
  // No user, overrideAccess defaults to true
})
```

**Rule**: When passing `user` to Local API, ALWAYS set `overrideAccess: false`

### 2. Transaction Safety in Hooks

```typescript
// ❌ DATA CORRUPTION RISK: Separate transaction
hooks: {
  afterChange: [
    async ({ doc, req }) => {
      await req.payload.create({
        collection: 'audit-log',
        data: { docId: doc.id },
        // Missing req - runs in separate transaction!
      })
    },
  ],
}

// ✅ ATOMIC: Same transaction
hooks: {
  afterChange: [
    async ({ doc, req }) => {
      await req.payload.create({
        collection: 'audit-log',
        data: { docId: doc.id },
        req, // Maintains atomicity
      })
    },
  ],
}
```

**Rule**: ALWAYS pass `req` to nested operations in hooks

### 3. Prevent Infinite Hook Loops

```typescript
// ❌ INFINITE LOOP
hooks: {
  afterChange: [
    async ({ doc, req }) => {
      await req.payload.update({
        collection: 'posts',
        id: doc.id,
        data: { views: doc.views + 1 },
        req,
      }) // Triggers afterChange again!
    },
  ],
}

// ✅ SAFE: Use context flag
hooks: {
  afterChange: [
    async ({ doc, req, context }) => {
      if (context.skipHooks) return

      await req.payload.update({
        collection: 'posts',
        id: doc.id,
        data: { views: doc.views + 1 },
        context: { skipHooks: true },
        req,
      })
    },
  ],
}
```

## Access Control

### Collection-Level Access

```typescript
import type { Access } from 'payload'

// Boolean return
const authenticated: Access = ({ req: { user } }) => Boolean(user)

// Query constraint (row-level security)
const ownPostsOnly: Access = ({ req: { user } }) => {
  if (!user) return false
  if (user?.roles?.includes('admin')) return true

  return {
    author: { equals: user.id },
  }
}

// Async access check
const projectMemberAccess: Access = async ({ req, id }) => {
  const { user, payload } = req

  if (!user) return false
  if (user.roles?.includes('admin')) return true

  const project = await payload.findByID({
    collection: 'projects',
    id: id as string,
    depth: 0,
  })

  return project.members?.includes(user.id)
}
```

### Field-Level Access

```typescript
// Field access ONLY returns boolean (no query constraints)
{
  name: 'salary',
  type: 'number',
  access: {
    read: ({ req: { user }, doc }) => {
      // Self can read own salary
      if (user?.id === doc?.id) return true
      // Admin can read all
      return user?.roles?.includes('admin')
    },
    update: ({ req: { user } }) => {
      // Only admins can update
      return user?.roles?.includes('admin')
    },
  },
}
```

### Common Access Patterns

```typescript
// Anyone
export const anyone: Access = () => true

// Authenticated only
export const authenticated: Access = ({ req: { user } }) => Boolean(user)

// Admin only
export const adminOnly: Access = ({ req: { user } }) => {
  return user?.roles?.includes('admin')
}

// Admin or self
export const adminOrSelf: Access = ({ req: { user } }) => {
  if (user?.roles?.includes('admin')) return true
  return { id: { equals: user?.id } }
}

// Published or authenticated
export const authenticatedOrPublished: Access = ({ req: { user } }) => {
  if (user) return true
  return { _status: { equals: 'published' } }
}
```

## Hooks

### Common Hook Patterns

```typescript
import type { CollectionConfig } from 'payload'

export const Posts: CollectionConfig = {
  slug: 'posts',
  hooks: {
    // Before validation - format data
    beforeValidate: [
      async ({ data, operation }) => {
        if (operation === 'create') {
          data.slug = slugify(data.title)
        }
        return data
      },
    ],

    // Before save - business logic
    beforeChange: [
      async ({ data, req, operation, originalDoc }) => {
        if (operation === 'update' && data.status === 'published') {
          data.publishedAt = new Date()
        }
        return data
      },
    ],

    // After save - side effects
    afterChange: [
      async ({ doc, req, operation, previousDoc, context }) => {
        // Check context to prevent loops
        if (context.skipNotification) return

        if (operation === 'create') {
          await sendNotification(doc)
        }
        return doc
      },
    ],

    // After read - computed fields
    afterRead: [
      async ({ doc, req }) => {
        doc.viewCount = await getViewCount(doc.id)
        return doc
      },
    ],

    // Before delete - cascading deletes
    beforeDelete: [
      async ({ req, id }) => {
        await req.payload.delete({
          collection: 'comments',
          where: { post: { equals: id } },
          req, // Important for transaction
        })
      },
    ],
  },
}
```

## Queries

### Local API

```typescript
// Find with complex query
const posts = await payload.find({
  collection: 'posts',
  where: {
    and: [{ status: { equals: 'published' } }, { 'author.name': { contains: 'john' } }],
  },
  depth: 2, // Populate relationships
  limit: 10,
  sort: '-createdAt',
  select: {
    title: true,
    author: true,
  },
})

// Find by ID
const post = await payload.findByID({
  collection: 'posts',
  id: '123',
  depth: 2,
})

// Create
const newPost = await payload.create({
  collection: 'posts',
  data: {
    title: 'New Post',
    status: 'draft',
  },
})

// Update
await payload.update({
  collection: 'posts',
  id: '123',
  data: { status: 'published' },
})

// Delete
await payload.delete({
  collection: 'posts',
  id: '123',
})
```

### Query Operators

```typescript
// Equals
{ status: { equals: 'published' } }

// Not equals
{ status: { not_equals: 'draft' } }

// Greater than / less than
{ price: { greater_than: 100 } }
{ age: { less_than_equal: 65 } }

// Contains (case-insensitive)
{ title: { contains: 'payload' } }

// Like (all words present)
{ description: { like: 'cms headless' } }

// In array
{ category: { in: ['tech', 'news'] } }

// Exists
{ image: { exists: true } }

// Near (geospatial)
{ location: { near: [-122.4194, 37.7749, 10000] } }
```

### AND/OR Logic

```typescript
{
  or: [
    { status: { equals: 'published' } },
    { author: { equals: user.id } },
  ],
}

{
  and: [
    { status: { equals: 'published' } },
    { featured: { equals: true } },
  ],
}
```

## Getting Payload Instance

```typescript
// In API routes (Next.js)
import { getPayload } from 'payload'
import config from '@payload-config'

export async function GET() {
  const payload = await getPayload({ config })

  const posts = await payload.find({
    collection: 'posts',
  })

  return Response.json(posts)
}

// In Server Components
import { getPayload } from 'payload'
import config from '@payload-config'

export default async function Page() {
  const payload = await getPayload({ config })
  const { docs } = await payload.find({ collection: 'posts' })

  return <div>{docs.map(post => <h1 key={post.id}>{post.title}</h1>)}</div>
}
```

## Components

The Admin Panel can be extensively customized using React Components. Custom Components can be Server Components (default) or Client Components.

### Defining Components

Components are defined using **file paths** (not direct imports) in your config:

**Component Path Rules:**

- Paths are relative to project root or `config.admin.importMap.baseDir`
- Named exports: use `#ExportName` suffix or `exportName` property
- Default exports: no suffix needed
- File extensions can be omitted

```typescript
import { buildConfig } from 'payload'

export default buildConfig({
  admin: {
    components: {
      // Logo and branding
      graphics: {
        Logo: '/components/Logo',
        Icon: '/components/Icon',
      },

      // Navigation
      Nav: '/components/CustomNav',
      beforeNavLinks: ['/components/CustomNavItem'],
      afterNavLinks: ['/components/NavFooter'],

      // Header
      header: ['/components/AnnouncementBanner'],
      actions: ['/components/ClearCache', '/components/Preview'],

      // Dashboard
      beforeDashboard: ['/components/WelcomeMessage'],
      afterDashboard: ['/components/Analytics'],

      // Auth
      beforeLogin: ['/components/SSOButtons'],
      logout: { Button: '/components/LogoutButton' },

      // Settings
      settingsMenu: ['/components/SettingsMenu'],

      // Views
      views: {
        dashboard: { Component: '/components/CustomDashboard' },
      },
    },
  },
})
```

**Component Path Rules:**

- Paths are relative to project root or `config.admin.importMap.baseDir`
- Named exports: use `#ExportName` suffix or `exportName` property
- Default exports: no suffix needed
- File extensions can be omitted

### Component Types

1. **Root Components** - Global Admin Panel (logo, nav, header)
2. **Collection Components** - Collection-specific (edit view, list view)
3. **Global Components** - Global document views
4. **Field Components** - Custom field UI and cells

### Component Types

1. **Root Components** - Global Admin Panel (logo, nav, header)
2. **Collection Components** - Collection-specific (edit view, list view)
3. **Global Components** - Global document views
4. **Field Components** - Custom field UI and cells

### Server vs Client Components

**All components are Server Components by default** (can use Local API directly):

```tsx
// Server Component (default)
import type { Payload } from 'payload'

async function MyServerComponent({ payload }: { payload: Payload }) {
  const posts = await payload.find({ collection: 'posts' })
  return <div>{posts.totalDocs} posts</div>
}

export default MyServerComponent
```

**Client Components** need the `'use client'` directive:

```tsx
'use client'
import { useState } from 'react'
import { useAuth } from '@payloadcms/ui'

export function MyClientComponent() {
  const [count, setCount] = useState(0)
  const { user } = useAuth()

  return (
    <button onClick={() => setCount(count + 1)}>
      {user?.email}: Clicked {count} times
    </button>
  )
}
```

### Using Hooks (Client Components Only)

```tsx
'use client'
import {
  useAuth, // Current user
  useConfig, // Payload config (client-safe)
  useDocumentInfo, // Document info (id, collection, etc.)
  useField, // Field value and setter
  useForm, // Form state
  useFormFields, // Multiple field values (optimized)
  useLocale, // Current locale
  useTranslation, // i18n translations
  usePayload, // Local API methods
} from '@payloadcms/ui'

export function MyComponent() {
  const { user } = useAuth()
  const { config } = useConfig()
  const { id, collection } = useDocumentInfo()
  const locale = useLocale()
  const { t } = useTranslation()

  return <div>Hello {user?.email}</div>
}
```

### Collection/Global Components

```typescript
export const Posts: CollectionConfig = {
  slug: 'posts',
  admin: {
    components: {
      // Edit view
      edit: {
        PreviewButton: '/components/PostPreview',
        SaveButton: '/components/CustomSave',
        SaveDraftButton: '/components/SaveDraft',
        PublishButton: '/components/Publish',
      },

      // List view
      list: {
        Header: '/components/ListHeader',
        beforeList: ['/components/BulkActions'],
        afterList: ['/components/ListFooter'],
      },
    },
  },
}
```

### Field Components

```typescript
{
  name: 'status',
  type: 'select',
  options: ['draft', 'published'],
  admin: {
    components: {
      // Edit view field
      Field: '/components/StatusField',
      // List view cell
      Cell: '/components/StatusCell',
      // Field label
      Label: '/components/StatusLabel',
      // Field description
      Description: '/components/StatusDescription',
      // Error message
      Error: '/components/StatusError',
    },
  },
}
```

**UI Field** (presentational only, no data):

```typescript
{
  name: 'refundButton',
  type: 'ui',
  admin: {
    components: {
      Field: '/components/RefundButton',
    },
  },
}
```

### Performance Best Practices

1. **Import correctly:**

   - Admin Panel: `import { Button } from '@payloadcms/ui'`
   - Frontend: `import { Button } from '@payloadcms/ui/elements/Button'`

2. **Optimize re-renders:**

   ```tsx
   // ❌ BAD: Re-renders on every form change
   const { fields } = useForm()

   // ✅ GOOD: Only re-renders when specific field changes
   const value = useFormFields(([fields]) => fields[path])
   ```

3. **Prefer Server Components** - Only use Client Components when you need:

   - State (useState, useReducer)
   - Effects (useEffect)
   - Event handlers (onClick, onChange)
   - Browser APIs (localStorage, window)

4. **Minimize serialized props** - Server Components serialize props sent to client

### Styling Components

```tsx
import './styles.scss'

export function MyComponent() {
  return <div className="my-component">Content</div>
}
```

```scss
// Use Payload's CSS variables
.my-component {
  background-color: var(--theme-elevation-500);
  color: var(--theme-text);
  padding: var(--base);
  border-radius: var(--border-radius-m);
}

// Import Payload's SCSS library
@import '~@payloadcms/ui/scss';

.my-component {
  @include mid-break {
    background-color: var(--theme-elevation-900);
  }
}
```

### Type Safety

```tsx
import type {
  TextFieldServerComponent,
  TextFieldClientComponent,
  TextFieldCellComponent,
  SelectFieldServerComponent,
  // ... etc
} from 'payload'

export const MyField: TextFieldClientComponent = (props) => {
  // Fully typed props
}
```

### Import Map

Payload auto-generates `app/(payload)/admin/importMap.js` to resolve component paths.

**Regenerate manually:**

```bash
payload generate:importmap
```

**Set custom location:**

```typescript
export default buildConfig({
  admin: {
    importMap: {
      baseDir: path.resolve(dirname, 'src'),
      importMapFile: path.resolve(dirname, 'app', 'custom-import-map.js'),
    },
  },
})
```

## Custom Endpoints

```typescript
import type { Endpoint } from 'payload'
import { APIError } from 'payload'

// Always check authentication
export const protectedEndpoint: Endpoint = {
  path: '/protected',
  method: 'get',
  handler: async (req) => {
    if (!req.user) {
      throw new APIError('Unauthorized', 401)
    }

    // Use req.payload for database operations
    const data = await req.payload.find({
      collection: 'posts',
      where: { author: { equals: req.user.id } },
    })

    return Response.json(data)
  },
}

// Route parameters
export const trackingEndpoint: Endpoint = {
  path: '/:id/tracking',
  method: 'get',
  handler: async (req) => {
    const { id } = req.routeParams

    const tracking = await getTrackingInfo(id)

    if (!tracking) {
      return Response.json({ error: 'not found' }, { status: 404 })
    }

    return Response.json(tracking)
  },
}
```

## Drafts & Versions

```typescript
export const Pages: CollectionConfig = {
  slug: 'pages',
  versions: {
    drafts: {
      autosave: true,
      schedulePublish: true,
      validate: false, // Don't validate drafts
    },
    maxPerDoc: 100,
  },
  access: {
    read: ({ req: { user } }) => {
      // Public sees only published
      if (!user) return { _status: { equals: 'published' } }
      // Authenticated sees all
      return true
    },
  },
}

// Create draft
await payload.create({
  collection: 'pages',
  data: { title: 'Draft Page' },
  draft: true, // Skips required field validation
})

// Read with drafts
const page = await payload.findByID({
  collection: 'pages',
  id: '123',
  draft: true, // Returns draft if available
})
```

## Field Type Guards

```typescript
import {
  fieldAffectsData,
  fieldHasSubFields,
  fieldIsArrayType,
  fieldIsBlockType,
  fieldSupportsMany,
  fieldHasMaxDepth,
} from 'payload'

function processField(field: Field) {
  // Check if field stores data
  if (fieldAffectsData(field)) {
    console.log(field.name) // Safe to access
  }

  // Check if field has nested fields
  if (fieldHasSubFields(field)) {
    field.fields.forEach(processField) // Safe to access
  }

  // Check field type
  if (fieldIsArrayType(field)) {
    console.log(field.minRows, field.maxRows)
  }

  // Check capabilities
  if (fieldSupportsMany(field) && field.hasMany) {
    console.log('Multiple values supported')
  }
}
```

## Plugins

### Using Plugins

```typescript
import { seoPlugin } from '@payloadcms/plugin-seo'
import { redirectsPlugin } from '@payloadcms/plugin-redirects'

export default buildConfig({
  plugins: [
    seoPlugin({
      collections: ['posts', 'pages'],
    }),
    redirectsPlugin({
      collections: ['pages'],
    }),
  ],
})
```

### Creating Plugins

```typescript
import type { Config, Plugin } from 'payload'

interface MyPluginConfig {
  collections?: string[]
  enabled?: boolean
}

export const myPlugin =
  (options: MyPluginConfig): Plugin =>
  (config: Config): Config => ({
    ...config,
    collections: config.collections?.map((collection) => {
      if (options.collections?.includes(collection.slug)) {
        return {
          ...collection,
          fields: [...collection.fields, { name: 'pluginField', type: 'text' }],
        }
      }
      return collection
    }),
  })
```

## Best Practices

### Security

1. Always set `overrideAccess: false` when passing `user` to Local API
2. Field-level access only returns boolean (no query constraints)
3. Default to restrictive access, gradually add permissions
4. Never trust client-provided data
5. Use `saveToJWT: true` for roles to avoid database lookups

### Performance

1. Index frequently queried fields
2. Use `select` to limit returned fields
3. Set `maxDepth` on relationships to prevent over-fetching
4. Use query constraints over async operations in access control
5. Cache expensive operations in `req.context`

### Data Integrity

1. Always pass `req` to nested operations in hooks
2. Use context flags to prevent infinite hook loops
3. Enable transactions for MongoDB (requires replica set) and Postgres
4. Use `beforeValidate` for data formatting
5. Use `beforeChange` for business logic

### Type Safety

1. Run `generate:types` after schema changes
2. Import types from generated `payload-types.ts`
3. Type your user object: `import type { User } from '@/payload-types'`
4. Use `as const` for field options
5. Use field type guards for runtime type checking

### Organization

1. Keep collections in separate files
2. Extract access control to `access/` directory
3. Extract hooks to `hooks/` directory
4. Use reusable field factories for common patterns
5. Document complex access control with comments

## Common Gotchas

1. **Local API Default**: Access control bypassed unless `overrideAccess: false`
2. **Transaction Safety**: Missing `req` in nested operations breaks atomicity
3. **Hook Loops**: Operations in hooks can trigger the same hooks
4. **Field Access**: Cannot use query constraints, only boolean
5. **Relationship Depth**: Default depth is 2, set to 0 for IDs only
6. **Draft Status**: `_status` field auto-injected when drafts enabled
7. **Type Generation**: Types not updated until `generate:types` runs
8. **MongoDB Transactions**: Require replica set configuration
9. **SQLite Transactions**: Disabled by default, enable with `transactionOptions: {}`
10. **Point Fields**: Not supported in SQLite

## Additional Context Files

For deeper exploration of specific topics, refer to the context files located in `.cursor/rules/`:

### Available Context Files

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
