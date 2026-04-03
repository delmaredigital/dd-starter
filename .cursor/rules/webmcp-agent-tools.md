# WebMCP Agent Tools for Puck Editor

AI agents can co-edit pages with humans in the Puck visual editor via self-describing WebMCP tools.

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
| `upload_image` | No | Fetches image from URL, uploads to Payload media, returns ID for use in Image/Card props |

## Connecting an Agent

### Via Chrome DevTools MCP

```bash
# 1. Configure MCP server in Claude Code
claude mcp add chrome-devtools npx @mcp-b/chrome-devtools-mcp@latest

# 2. Launch Chrome with remote debugging
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --remote-debugging-port=9222

# 3. In that Chrome, navigate to a Puck editor page (e.g. /admin/puck-editor/pages/1)
# 4. Agent discovers tools via list_webmcp_tools, calls them via call_webmcp_tool
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
