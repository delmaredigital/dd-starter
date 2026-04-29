/**
 * Shared font buffers for competition-image renderers (OG, login-desktop, …).
 *
 * Read once at module load; Satori needs Buffers passed via the `fonts` array
 * because it can't fetch fonts itself. fs.readFileSync is required (not import)
 * because import.meta.url resolves to a /_next/static path that isn't fetchable
 * in the server runtime.
 */
import { readFileSync } from 'fs'
import { join } from 'path'

const ASSETS_DIR = join(process.cwd(), 'public', 'competition-assets')

export const POPPINS_BOLD = readFileSync(join(ASSETS_DIR, 'Poppins-Bold.ttf'))
export const BASKERVVILLE_ITALIC = readFileSync(join(ASSETS_DIR, 'Baskervville-Italic.ttf'))

/** Standard Satori font descriptors — pass into ImageResponse / satori() options. */
export const COMPETITION_IMAGE_FONTS = [
  { name: 'Poppins', data: POPPINS_BOLD, weight: 700 as const, style: 'normal' as const },
  {
    name: 'Baskervville',
    data: BASKERVVILLE_ITALIC,
    weight: 400 as const,
    style: 'italic' as const,
  },
]
