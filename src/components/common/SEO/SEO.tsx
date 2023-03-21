import config from 'config/seo_meta.json'
import Head from 'next/head'
import { FC, ReactNode } from 'react'
import { ipfsUriToGatewayUrl } from 'utils/ipfs'
import { OpenGraphMetaTags } from './OpenGraphMetaTags'
import {
  TwitterCardType,
  TwitterMetaTags,
  TwitterMetaTagsProps,
} from './TwitterMetaTags'

export interface SEOProps {
  url?: string
  title?: string
  description?: string
  twitter?: Omit<TwitterMetaTagsProps, 'title' | 'description'>
  robots?: string
  children?: ReactNode
}

export const SEO: FC<SEOProps> = ({
  url,
  title,
  description,
  twitter,
  robots,
  children,
}) => {
  const formatTwitterHandle = (handle: string | undefined) =>
    handle ? (handle.startsWith('@') ? handle : '@' + handle) : undefined
  const formattedTitle = title
    ? `${config.titleTemplate.replace(/%s/g, title)}`
    : config.title
  return (
    <>
      <Head>
        <title key="title">{formattedTitle}</title>
        <meta
          key="description"
          name="description"
          content={description ?? config.description}
        />
        <meta key="robots" name="robots" content={robots ?? 'index,follow'} />
        <meta
          key="googlebot"
          name="googlebot"
          content={robots ?? 'index,follow'}
        ></meta>
      </Head>

      <TwitterMetaTags
        title={formattedTitle}
        description={description ?? config.description}
        handle={formatTwitterHandle(twitter?.handle ?? config.twitter.handle)}
        site={config.twitter.site}
        creator={formatTwitterHandle(
          twitter?.creator ?? config.twitter.creator,
        )}
        card={twitter?.card ?? (config.twitter.cardType as TwitterCardType)}
        image={ipfsUriToGatewayUrl(twitter?.image ?? config.twitter.image)}
      />

      <OpenGraphMetaTags
        type="website"
        url={url ?? process.env.NEXT_PUBLIC_BASE_URL} // default to base url
        title={formattedTitle}
        description={description ?? config.description}
        siteName={config.title}
        image={{
          src:
            (process.env.NEXT_PUBLIC_BASE_URL
              ? process.env.NEXT_PUBLIC_BASE_URL
              : '/') + 'assets/JBM-Unfurl-banner.png',
          type: 'image/png',
          width: '1136',
          height: '497',
        }}
      />

      <Head>{children}</Head>
    </>
  )
}
