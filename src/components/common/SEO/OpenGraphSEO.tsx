import { MetaTagsElement } from './MetaTagsElement'

export interface OpenGraphSEOProps {
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
  title,
  type,
  description,
  siteName,
  image,
}: OpenGraphSEOProps) => {
  return (
    <>
      {MetaTagsElement({ title, type, description, site_name: siteName }, 'og')}
      {MetaTagsElement(
        { _root: image?.src, width: image?.width, height: image?.height },
        'og:image',
      )}
    </>
  )
}
