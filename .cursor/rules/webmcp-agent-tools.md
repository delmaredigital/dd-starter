# WebMCP Agent Tools for Puck Editor

AI agents can co-edit pages with humans in the Puck visual editor via self-describing WebMCP tools.

## Deployment

- **Admin**: `https://payload-cms-production-e365.up.railway.app/admin`
- **Puck editor**: `https://payload-cms-production-e365.up.railway.app/admin/puck-editor/pages/:id`
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
   `https://payload-cms-production-e365.up.railway.app/admin/puck-editor/pages/2`
   (Log in if needed — your saved credentials should autofill)
3. Start a Claude Code session — the `chrome-devtools-live` MCP connects to your Chrome automatically
4. Chrome shows a permission dialog on first connect — accept it
5. The agent can now discover and call WebMCP tools on the page

### Verifying tools are available

The agent should run:
```js
evaluate_script({ function: '() => window.__puckAgentTools?.map(t => t.name)' })
// Expected: ['get_page_state', 'get_component_schema', 'update_page', 'update_root_props', 'upload_image']
```

### Troubleshooting

- **Tools return `null`**: Agent may be on the wrong page. Navigate to a `/admin/puck-editor/pages/:id` URL.
- **MCP can't connect**: Check that remote debugging is enabled in `chrome://inspect/#remote-debugging`.
- **Two Chrome DevTools MCPs conflict**: If the Chrome DevTools MCP plugin is also installed, disable it to avoid the plugin launching its own headless browser. The `chrome-devtools-live` server (with `--autoConnect`) is preferred.

## Available Tools

| Tool | Read-only | Description |
|------|-----------|-------------|
| `get_page_state` | Yes | Returns current puckData JSON + component summary |
| `get_component_schema` | Yes | Returns field definitions, defaults, enums for all or one component |
| `update_page` | No | Replaces entire page content, editor updates live |
| `update_root_props` | No | Merges partial root props (title, layout, etc.) |
| `upload_image` | No | Uploads image via URL or base64 to Payload media, returns ID for use in Image/Card props |

### Calling tools via evaluate_script

```js
// Read page state
evaluate_script({ function: 'async () => { const t = window.__puckAgentTools.find(t => t.name === "get_page_state"); return JSON.parse((await t.execute({})).content[0].text).summary }' })

// Get component schema (all components)
evaluate_script({ function: 'async () => { const t = window.__puckAgentTools.find(t => t.name === "get_component_schema"); return JSON.parse((await t.execute({})).content[0].text) }' })

// Update page content
evaluate_script({ function: 'async () => { const t = window.__puckAgentTools.find(t => t.name === "update_page"); return (await t.execute({ puckData: { root: { props: { title: "My Page" } }, content: [...], zones: {} } })).content[0].text }' })

// Upload image from URL
evaluate_script({ function: 'async () => { const t = window.__puckAgentTools.find(t => t.name === "upload_image"); return JSON.parse((await t.execute({ url: "https://example.com/image.jpg", alt: "Description" })).content[0].text) }' })
```

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

## Schema Auto-Generation

Component schemas are generated at runtime from Puck's config (`puckConfig.components`). Each component's `fields` object and `defaultProps` are converted to JSON Schema by `src/lib/webmcp/fields-to-schema.ts`. When upstream adds or modifies Puck components, the schemas update automatically.

## Key Design Decisions

- **Editor state, not Payload API**: Tools dispatch `setData` into Puck's reducer for live WYSIWYG updates. Save/publish is a separate human action.
- **No separate auth**: Agent piggybacks on the human's admin session via CDP.
- **Minimal codebase footprint**: All new code in `src/lib/webmcp/` and `src/puck/webmcp-plugin.tsx`. Only `PuckProvider.tsx` is modified (1 import + 1 prop).
- **Agent input validation**: Currently unvalidated (TODO: add zod). The `as AgentTool[]` cast in `webmcp-plugin.tsx` marks this boundary.
