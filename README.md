# DD Starter

A modern Payload CMS starter template featuring visual page editing, hierarchical content management, and enhanced authentication. Built and maintained by [Delmare Digital](https://delmaredigital.com).

This template serves as a working demonstration of the `@delmaredigital` plugin ecosystem for Payload CMS.

<p align="center">
  <a href="https://demo.delmaredigital.com"><img src="https://img.shields.io/badge/Live_Demo-Try_It_Now-2ea44f?style=for-the-badge&logo=vercel&logoColor=white" alt="Live Demo - Try It Now"></a>
</p>

<p align="center">
  <a href="https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fdelmaredigital%2Fdd-starter&project-name=my-payload-site&build-command=pnpm%20run%20ci&env=PAYLOAD_SECRET,BETTER_AUTH_SECRET&stores=%5B%7B%22type%22%3A%22integration%22%2C%22protocol%22%3A%22storage%22%2C%22productSlug%22%3A%22neon%22%2C%22integrationSlug%22%3A%22neon%22%7D%2C%7B%22type%22%3A%22blob%22%7D%5D"><img src="https://vercel.com/button" alt="Deploy with Vercel" height="32"></a>
</p>

## Included Plugins

### [@delmaredigital/payload-puck](https://github.com/delmaredigital/payload-puck)
Visual page builder powered by [Puck](https://puckeditor.com). Create pages with a drag-and-drop interface instead of traditional block-based editing.

- Visual WYSIWYG page editing
- Pre-built components (Section, Flex, Grid, Heading, Text, Button, etc.)
- Multiple page layouts (Default, Full Width, Landing)
- Live preview in editor
- Server-side rendering support

### [@delmaredigital/payload-page-tree](https://github.com/delmaredigital/payload-page-tree)
Hierarchical content organization with automatic slug generation.

- Visual tree view for content hierarchy
- Folder-based URL structure
- Auto-generated slugs from path segments
- Works with Pages and Posts collections

### [@delmaredigital/payload-better-auth](https://github.com/delmaredigital/payload-better-auth)
Enhanced authentication using [Better Auth](https://better-auth.com).

- Email/password authentication
- Passkey/WebAuthn support
- Two-factor authentication (TOTP)
- API key management
- Role-based access control

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org) (App Router)
- **CMS**: [Payload CMS 3](https://payloadcms.com)
- **Database**: PostgreSQL (via Vercel Postgres/Neon)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com)
- **Storage**: Vercel Blob Storage

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm
- PostgreSQL database

### Installation

1. Clone the repository
2. Copy environment variables:
   ```bash
   cp .env.example .env.local
   ```
3. Configure your environment variables (see below)
4. Install dependencies:
   ```bash
   pnpm install
   ```
5. Start the development server:
   ```bash
   pnpm dev
   ```
   The database schema is automatically synced in development mode (push mode).

### Environment Variables

Required:
- `POSTGRES_URL` - PostgreSQL connection string
- `PAYLOAD_SECRET` - Secret for JWT signing (min 32 chars)
- `BETTER_AUTH_SECRET` - Secret for Better Auth (min 32 chars)

Optional:
- `BLOB_READ_WRITE_TOKEN` - Vercel Blob storage token
- `PUCK_API_KEY` - For Puck AI page generation (from [puckeditor.com](https://puckeditor.com))

## Project Structure

```
src/
├── app/(frontend)/     # Next.js frontend routes
├── app/(payload)/      # Payload admin routes
├── collections/        # Payload collections (Posts, Media, Users)
├── components/         # React components
├── lib/
│   ├── auth/          # Better Auth configuration
│   └── puck/          # Puck layouts and options
├── puck/              # Puck editor configuration
└── plugins/           # Payload plugin configuration
```

## Usage

### Creating Pages

1. Navigate to `/admin/page-tree`
2. Click "New Page" to create a page
3. Use the Puck visual editor to build your page layout
4. Publish when ready

### Managing Content Hierarchy

The Page Tree view (`/admin/page-tree`) provides a visual interface for organizing your content. Drag pages to reorder or nest them within folders.

### Authentication

Users are managed through Payload's admin panel with Better Auth handling the authentication flow. Roles (`user`, `admin`) control access to the admin panel and content.

## Development

```bash
# Start dev server
pnpm dev

# Type check
pnpm check

# Build for production
pnpm build

# Run production build
pnpm start
```

## Deploying to Vercel

This template is ready to deploy to Vercel:

1. Push your repository to GitHub
2. Import the project in Vercel
3. Configure environment variables in Vercel dashboard
4. **Important**: Override the build command to `pnpm run ci`

The `ci` script runs migrations before building, which is required for production deployments.

## Database Migrations

The project uses **push mode** in development, which automatically syncs schema changes.

For production, migrations are created once and included in the repository. If you make schema changes:

```bash
# Create a new migration
pnpm payload migrate:create
```

## License

MIT

---

Built by [Delmare Digital](https://delmaredigital.com)
