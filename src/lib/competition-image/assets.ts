/**
 * Static SVG assets used across competition-image renderers, embedded as
 * base64 data URIs (Satori can't fetch its own assets — must be inlined).
 * Read once at module load.
 */
import { readFileSync } from 'fs'
import { join } from 'path'

const ASSETS_DIR = join(process.cwd(), 'public', 'competition-assets')

function svgToDataUri(filename: string): string {
  const bytes = readFileSync(join(ASSETS_DIR, filename))
  return `data:image/svg+xml;base64,${bytes.toString('base64')}`
}

/** "Proudly hosted on algoed" laurel ribbon, used by OG and login templates. */
export const LAUREL_BADGE = svgToDataUri('og-proudly-hosted-badge.svg')

/** Ribbon end-streamer; mirror with scaleX(-1) for the right side. */
export const RIBBON_TAIL = svgToDataUri('login-ribbon-tail.svg')
