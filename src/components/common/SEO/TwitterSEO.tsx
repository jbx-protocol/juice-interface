import { MetaTagsElement } from './MetaTagsElement'

export type TwitterCardType =
  | 'summary'
  | 'summary_large_image'
  | 'app'
  | 'player'

export interface TwitterSEOProps {
  title?: string
  description?: string
  handle?: string
  site?: string
  creator?: string
  card?: TwitterCardType
  image?: string
}

export const TwitterSEO = (props: TwitterSEOProps) => {
  return MetaTagsElement(props, 'twitter')
}
