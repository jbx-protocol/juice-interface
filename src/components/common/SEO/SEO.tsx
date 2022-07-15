import Head from 'next/head'
import { FC, ReactNode } from 'react'

import config from '../../../config/seo_meta.json'
import { OpenGraphSEO } from './OpenGraphSEO'
import { TwitterCardType, TwitterSEO, TwitterSEOProps } from './TwitterSEO'

interface Props {
  title?: string
  description?: string
  twitter?: TwitterSEOProps
  robots?: string
  children?: ReactNode
}

export const SEO: FC<Props> = ({
  title,
  description,
  twitter,
  robots,
  children,
}) => {
  const formattedTitle = title
    ? `${config.titleTemplate.replace(/%s/g, title)}`
    : config.title
  return (
    <Head>
      <title key="title">{formattedTitle}</title>
      <meta
        key="description"
        name="description"
        content={description ?? config.description}
      />
      <TwitterSEO
        title={formattedTitle}
        description={description ?? config.description}
        handle={twitter?.handle ?? config.twitter.handle}
        site={twitter?.site ?? config.twitter.site}
        creator={twitter?.creator ?? config.twitter.creator}
        card={twitter?.card ?? (config.twitter.cardType as TwitterCardType)}
        image={twitter?.image ?? config.twitter.image}
      />
      <OpenGraphSEO
        type="website"
        title={formattedTitle}
        description={description ?? config.description}
        siteName={config.title}
        image={{
          src: '/assets/banana-cover.png',
          type: 'image/svg',
          width: '2870',
          height: '1245',
        }}
      />

      <meta key="robots" name="robots" content={robots ?? 'index,follow'} />
      <meta
        key="googlebot"
        name="googlebot"
        content={robots ?? 'index,follow'}
      ></meta>
      <meta
        name="google-site-verification"
        content="0Jp7zERBL5i76DiM-bODvBGgbjuVMEQGSuwOchP_ZnE"
      />

      {children}
    </Head>
  )
}
