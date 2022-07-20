import Head from 'next/head'

import { metaTagsFormatted } from './metaTagsFormatted'

export type TwitterCardType =
  | 'summary'
  | 'summary_large_image'
  | 'app'
  | 'player'

export interface TwitterMetaTagsProps {
  title?: string
  description?: string
  handle?: string
  site?: string
  creator?: string
  card?: TwitterCardType
  image?: string
}

export const TwitterMetaTags = (props: TwitterMetaTagsProps) => {
  return (
    <Head>
      {metaTagsFormatted(props, 'twitter')?.map(({ key, value }) => (
        <meta key={key} property={key} content={value} />
      ))}
    </Head>
  )
}
