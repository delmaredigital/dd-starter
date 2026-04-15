import type { Metadata } from 'next'

import type { Media, Page, Post, Config } from '../payload-types'

import { mergeOpenGraph } from './mergeOpenGraph'
import { getServerSideURL } from './getURL'

const getImageURL = (image?: Media | Config['db']['defaultIDType'] | null) => {
  const serverUrl = getServerSideURL()

  let url = ''

  if (image && typeof image === 'object' && 'url' in image) {
    const ogUrl = image.sizes?.og?.url || image.url || ''
    try { url = new URL(ogUrl).href } catch { url = serverUrl + ogUrl }
  }

  return url
}

export const generateMeta = async (args: {
  doc: Partial<Page> | Partial<Post> | null
}): Promise<Metadata> => {
  const { doc } = args

  const ogImage = getImageURL(doc?.meta?.image)

  const rawTitle = doc?.meta?.title || ''
  // Prepend brand prefix unless the title already contains it
  const title = rawTitle
    ? rawTitle.toLowerCase().includes('algoed') ? rawTitle : `AlgoEd | ${rawTitle}`
    : 'AlgoEd'

  const canonicalUrl = doc?.slug ? `${getServerSideURL()}/${doc.slug}` : getServerSideURL()

  return {
    description: doc?.meta?.description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: mergeOpenGraph({
      description: doc?.meta?.description || '',
      images: ogImage
        ? [
            {
              url: ogImage,
            },
          ]
        : undefined,
      title,
      url: doc?.slug ? `/${doc.slug}` : '/',
    }),
    title,
  }
}
