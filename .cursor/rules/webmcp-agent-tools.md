# WebMCP Agent Tools for Puck Editor

AI agents can co-edit pages with humans in the Puck visual editor via self-describing WebMCP tools.

## Deployment

- **Admin**: `https://payload-cms-production-e365.up.railway.app/admin`
- **Puck editor**: `https://payload-cms-production-e365.up.railway.app/admin/puck-editor/pages/:id`
- Tools are available on any Puck editor page (the plugin registers them on load)

## Architecture

Tools are registered client-side when the Puck editor loads. They operate on the editor's in-memory state (not the Payload API), so changes appear live in the canvas.

```
src/lib/webmcp/          — Tool registry, polyfill wrapper, schema converter
src/puck/webmcp-plugin.tsx — Puck plugin that bridges usePuck() to tool registry
```

The plugin is injected via `PuckConfigProvider`'s `plugins` prop in `src/components/admin/PuckProvider.tsx`.

### Dual export

Tools are exposed two ways:
- `window.__puckAgentTools` — fallback for direct `page.evaluate()` access
- `navigator.modelContext` — WebMCP standard path via `@mcp-b/webmcp-polyfill`

## Available Tools

| Tool | Read-only | Description |
|------|-----------|-------------|
| `get_page_state` | Yes | Returns current puckData JSON + component summary |
| `get_component_schema` | Yes | Returns field definitions, defaults, enums for all or one component |
| `update_page` | No | Replaces entire page content, editor updates live |
| `update_root_props` | No | Merges partial root props (title, layout, etc.) |
| `upload_image` | No | Uploads image via URL or base64 to Payload media, returns ID for use in Image/Card props |

## Connecting an Agent

### Via Chrome DevTools MCP (recommended)

The Chrome DevTools MCP plugin (installed in Claude Code) launches and manages its own
browser instance automatically. No manual Chrome launch needed.

**Agent workflow:**
1. Use `navigate_page` to go to the Payload admin login page
2. Ask the user to type credentials in the browser window that appeared
3. Use `navigate_page` to go to the Puck editor page
4. Use `evaluate_script` to call `window.__puckAgentTools` for tool access

```bash
# Plugin is pre-installed. If not, install once:
# claude mcp add chrome-devtools npx chrome-devtools-mcp@latest
```

**Example agent commands:**
```js
// Navigate to Puck editor
navigate_page({ type: 'url', url: 'https://payload-cms-production-e365.up.railway.app/admin/puck-editor/pages/2' })

// Verify tools are registered
evaluate_script({ function: '() => window.__puckAgentTools?.map(t => t.name)' })

// Call a tool
evaluate_script({ function: 'async () => { const t = window.__puckAgentTools.find(t => t.name === "get_page_state"); return JSON.parse((await t.execute({})).content[0].text).summary }' })
```

### Via Playwright / direct page.evaluate()

```js
// List tools
const tools = await page.evaluate(() =>
  window.__puckAgentTools?.map(t => ({ name: t.name, description: t.description }))
)

// Call a tool
const result = await page.evaluate(() =>
  window.__puckAgentTools?.find(t => t.name === 'get_page_state')?.execute({})
)
```

## Schema Auto-Generation

Component schemas are generated at runtime from Puck's config (`puckConfig.components`). Each component's `fields` object and `defaultProps` are converted to JSON Schema by `src/lib/webmcp/fields-to-schema.ts`. When upstream adds or modifies Puck components, the schemas update automatically.

## Key Design Decisions

- **Editor state, not Payload API**: Tools dispatch `setData` into Puck's reducer for live WYSIWYG updates. Save/publish is a separate human action.
- **No separate auth**: Agent piggybacks on the human's admin session via CDP.
- **Minimal codebase footprint**: All new code in `src/lib/webmcp/` and `src/puck/webmcp-plugin.tsx`. Only `PuckProvider.tsx` is modified (1 import + 1 prop).
- **Agent input validation**: Currently unvalidated (TODO: add zod). The `as AgentTool[]` cast in `webmcp-plugin.tsx` marks this boundary.
