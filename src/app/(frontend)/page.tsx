import { redirect } from 'next/navigation'

// Root domain redirects to main site. Competition pages are served at /:org/:site.
//
// To restore a CMS-managed homepage, this page previously:
// 1. Queried pages collection: first for { isHomepage: { equals: true } },
//    then fallback { slug: { equals: 'home' } }
// 2. Rendered the page via <HybridPageRenderer> with puckServerConfig + puckRenderLayouts
// 3. Showed a WelcomeFallback component ("Welcome to DD Starter") when no homepage was found
// 4. generateMetadata pulled SEO from the page's puck data
// 5. Included <PageClient />, <PayloadRedirects />, <LivePreviewListener /> wrappers
//
// Imports needed: PayloadRedirects, generateMeta, HybridPageRenderer, puckServerConfig,
// puckRenderLayouts, PageClient from './[...slug]/page.client', LivePreviewListener
export default function HomePage() {
  redirect('https://www.algoed.co')
}
