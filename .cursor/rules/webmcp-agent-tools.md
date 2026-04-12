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
3. **MCP servers configured in Claude Code** (already done for this project):
   ```bash
   claude mcp add chrome-devtools-live npx chrome-devtools-mcp@latest -- --autoConnect
   claude mcp add webmcp-bridge npx @mcp-b/chrome-devtools-mcp@latest -- --autoConnect
   ```
   `chrome-devtools-live` — browser automation (evaluate_script, click, etc.)
   `webmcp-bridge` — discovers page-registered WebMCP tools (list_webmcp_tools, call_webmcp_tool). Both need `--autoConnect` to attach to your running Chrome.

### Connecting (each session)

1. Open Chrome normally (with your default profile — saved passwords and sessions carry over)
2. Navigate to the Puck editor page, e.g.:
   `pages.algoed.co/p-kcCapdQH/puck-editor/pages/2`
   (Log in if needed — your saved credentials should autofill)
3. Start a Claude Code session — the `chrome-devtools-live` MCP connects to your Chrome automatically
4. Chrome shows a permission dialog on first connect — accept it
5. The agent can now discover and call WebMCP tools on the page

### Verifying tools are available

Use `list_webmcp_tools` via the `webmcp-bridge` MCP server. Tools are self-documenting — their descriptions contain parameters, endpoints, and gotchas.

### Troubleshooting

- **`list_webmcp_tools` returns empty**: User's Puck editor page may not be open or not fully loaded. Ask user to reload.
- **MCP can't connect**: Check remote debugging at `chrome://inspect/#remote-debugging`.
- **Bridge launches its own Chrome**: Missing `--autoConnect` flag. Reconfigure with `claude mcp add webmcp-bridge npx @mcp-b/chrome-devtools-mcp@latest -- --autoConnect`.

## Workflow Gotchas
- **Never navigate the user's editor tab.** Use `new_page` for reference browsing.
- **Local file uploads**: STOP and ask user for a curl from DevTools.
- **Stale SSR after deploy**: reload Puck editor → re-publish.
- **Page slug = hero title, kebab-cased.** "Junior" prefix for K-5 variants.

## Architecture

Tools are registered via `navigator.modelContext.registerTool()` (WebMCP standard) when the Puck editor loads. The `webmcp-bridge` MCP server discovers them via CDP and exposes them as `list_webmcp_tools` / `call_webmcp_tool`. Tools operate on the editor's in-memory state (not Payload API) so changes appear live.

```
src/lib/webmcp/            — Tool registry, schema converter
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
