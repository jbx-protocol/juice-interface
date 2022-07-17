import Head from 'next/head'

import { metaTagsFormatted } from './metaTagsFormatted'

export interface OpenGraphSEOProps {
  url?: string
  title?: string
  type?: string
  description?: string
  siteName?: string
  image?: {
    src: string
    type: string
    width: string
    height: string
  }
}

export const OpenGraphSEO = ({
  url,
  title,
  type,
  description,
  siteName,
  image,
}: OpenGraphSEOProps) => {
  const rootTags =
    metaTagsFormatted(
      { url, title, type, description, site_name: siteName },
      'og',
    ) ?? []
  const imageTags =
    metaTagsFormatted(
      { _root: image?.src, width: image?.width, height: image?.height },
      'og:image',
    ) ?? []
  return (
    <Head>
      {[...rootTags, ...imageTags].map(({ key, value }) => (
        <meta key={key} property={key} content={value} />
      ))}
    </Head>
  )
}
