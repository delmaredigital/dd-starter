# WebMCP Agent Tools for Puck Editor

AI agents can co-edit pages with humans in the Puck visual editor via self-describing WebMCP tools.

## Deployment

- **Domain**: `pages.algoed.co`
- **Admin**: `pages.algoed.co/p-kcCapdQH` (obscured path — see payload.config.ts for change checklist)
- **Puck editor**: `pages.algoed.co/p-kcCapdQH/puck-editor/pages/:id`
- Tools are available on any Puck editor page (the plugin registers them on load)

## Quick Start — Connecting to the Puck Editor

### Prerequisites (one-time setup)

1. **Chrome 144+** (check `chrome://version`)
2. **Enable remote debugging in Chrome**: go to `chrome://inspect/#remote-debugging` and enable it
3. **MCP server configured in Claude Code** (already done for this project):
   ```bash
   claude mcp add chrome-devtools-live npx chrome-devtools-mcp@latest -- --autoConnect
   ```

### Connecting (each session)

1. Open Chrome normally (with your default profile — saved passwords and sessions carry over)
2. Navigate to the Puck editor page, e.g.:
   `pages.algoed.co/p-kcCapdQH/puck-editor/pages/2`
   (Log in if needed — your saved credentials should autofill)
3. Start a Claude Code session — the `chrome-devtools-live` MCP connects to your Chrome automatically
4. Chrome shows a permission dialog on first connect — accept it
5. The agent can now discover and call WebMCP tools on the page

### Verifying tools are available

The agent should run:
```js
evaluate_script({ function: '() => window.__puckAgentTools?.map(t => t.name)' })
// Expected: ['get_page_state', 'get_component_schema', 'update_page', 'update_root_props', 'upload_image', 'save_page', 'payload_api']
```

### Troubleshooting

- **Tools return `null`**: Agent may be on the wrong page. Navigate to a Puck editor URL.
- **MCP can't connect**: Check that remote debugging is enabled in `chrome://inspect/#remote-debugging`.
- **Two Chrome DevTools MCPs conflict**: If the Chrome DevTools MCP plugin is also installed, disable it to avoid the plugin launching its own headless browser. The `chrome-devtools-live` server (with `--autoConnect`) is preferred.

## Tool Philosophy

- **Specialized tools** (get_page_state, update_page, update_root_props, upload_image, save_page): for operations with specialized logic — editor state manipulation, file uploads, MediaReference formatting.
- **payload_api**: generic REST wrapper for simple CRUD that doesn't need specialized logic — folder creation, page creation, slug/metadata changes, querying. Tool description documents common endpoints and gotchas.

Tool descriptions are self-documenting — the agent reads the description to understand parameters, gotchas, and when to use each tool. Check tool descriptions for the latest details.

## Workflow Gotchas
- **Preview mode**: Clicking "Preview" in the editor opens a full-page preview. To return to the editor, click the "Close Preview" button (top-right). The agent can do this via `evaluate_script` finding the button: `document.querySelectorAll('button').find(b => b.textContent.includes('Close Preview')).click()`
- **Never navigate the user's editor tab to another URL.** Use `new_page` to open a separate tab for reference browsing (e.g., extracting source data from Webflow). Keep the Puck editor tab untouched.
- **Cards also use MediaReference** for their `image` prop — same shape as Image component.
- **Local file uploads**: see CLAUDE.md — STOP and ask user for a curl.
- **Stale SSR after deploy**: Live page may cache old HTML. Fix: reload Puck editor → re-publish.

## Architecture

Tools are registered client-side when the Puck editor loads, operating on the editor's in-memory state (not Payload API) so changes appear live. Component schemas auto-generate from the Puck config at runtime — new components are auto-discovered.

```
src/lib/webmcp/            — Tool registry, polyfill, schema converter
src/puck/webmcp-plugin.tsx — Puck plugin (bridges usePuck() to registry)
src/components/puck/       — Custom competition components
```

## Building Custom Puck Components

### The Flow (Webflow → Puck)
1. **Extract source** — download HTML/CSS from Webflow pages to `docs/reference/webflow/`
2. **Identify sections** — each `<section>` in Webflow maps to one Puck component
3. **Write React component** — match source CSS values exactly (fonts, sizes, colors, spacing)
4. **Split into two files** — `.render.tsx` (server-safe render + types + defaultProps) and `.tsx` (adds `createMediaField`-based field definitions). This split is required because `createMediaField` is client-only.
5. **Register** — add to `src/components/puck/index.ts` (client) and `index.server.ts` (server). Both configs import from these registries.
6. **Deploy** — components appear in the Puck sidebar. WebMCP `get_component_schema` auto-discovers them.
7. **Use via WebMCP** — agent calls `update_page` with the new component type and props

### File Convention
```
src/components/puck/
  ComponentName.render.tsx   — types, defaultProps, render function (server-safe)
  ComponentName.tsx          — imports from .render, adds fields (client-only)
  shared.tsx                 — AccentBar, CompetitionCTA, safeHex
  index.ts                   — client component registry
  index.server.ts            — server component registry (uses `as any` for extendConfig boundary)
```

### Parity with Webflow Source — STRICT
- **Default: 100% parity with source.** Every font size, weight, line-height, color, spacing, padding, margin, grid gap must match the Webflow source CSS exactly. No random drift, no "close enough."
- **Verify against computed styles, not just CSS files.** Webflow applies styles at runtime (inline, shared stylesheets) that don't appear in the page-specific CSS. Always check computed styles on the live page via Chrome DevTools.
- **Diverge only with strong reason.** If Tailwind conventions are objectively better AND visually identical, that's OK. Document why.
- **If it takes 100% more effort to achieve parity, do it.** The cost of visual drift compounds across pages.

### Styling Convention: Tailwind + Inline Styles
- **Tailwind classes for:** layout (grid, flex), responsive breakpoints, spacing (margin, padding, gap), font weight, text color when static, display, alignment
- **Inline styles only for:** dynamic values from props (primaryColor, highlightTextColor), values that must match source exactly and aren't Tailwind presets
- **Never use:** a separate CSS file for component styles, inline styles for things Tailwind handles

### Responsive
- Use Tailwind responsive prefixes: `grid-cols-1 md:grid-cols-2`, `gap-2.5 md:gap-10`, `px-4 md:px-0`
- Desktop first, stack on mobile via `grid-cols-1` → `md:grid-cols-N`
- Container: `max-w-[940px] mx-auto px-4 md:px-0` — matches Webflow's 940px max-width with mobile padding

### What's Configurable vs Locked
- **Configurable (Puck fields):** text content, images, brand colors, CTA links, layout direction
- **Locked (React code):** font sizes, spacing, grid layout, responsive breakpoints, visual structure
- Design philosophy: editors customize content and branding, developers own the visual structure

## Key Design Decisions

- **Editor state, not Payload API**: Tools dispatch `setData` into Puck's reducer for live WYSIWYG updates. Save/publish is a separate action.
- **No separate auth**: Agent piggybacks on the human's admin session via CDP.
- **Minimal codebase footprint**: All new code in `src/lib/webmcp/` and `src/puck/webmcp-plugin.tsx`. Only `PuckProvider.tsx` is modified (1 import + 1 prop).
