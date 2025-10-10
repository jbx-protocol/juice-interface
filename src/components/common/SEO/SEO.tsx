import config from 'config/seo_meta.json'
import { SiteBaseUrl } from 'constants/url'
import Head from 'next/head'
import { FC, ReactNode } from 'react'
import { ipfsUriToGatewayUrl } from 'utils/ipfs'
import { HotjarScript } from '../Head/scripts/HotjarScript'
import { OpenGraphMetaTags } from './OpenGraphMetaTags'
import {
  TwitterCardType,
  TwitterMetaTags,
  TwitterMetaTagsProps,
} from './TwitterMetaTags'

export interface SEOProps {
  url?: string
  title?: string
  overrideFormattedTitle?: boolean
  description?: string
  twitter?: Omit<TwitterMetaTagsProps, 'title' | 'description'>
  image?: string // Open Graph and Twitter image URL
  robots?: string
  children?: ReactNode
}

export const SEO: FC<React.PropsWithChildren<SEOProps>> = ({
  url,
  title,
  overrideFormattedTitle,
  description,
  twitter,
  image,
  robots,
  children,
}) => {
  const formatTwitterHandle = (handle: string | undefined) =>
    handle ? (handle.startsWith('@') ? handle : '@' + handle) : undefined

  let formattedTitle = config.title
  if (title) {
    formattedTitle = config.titleTemplate.replace(/%s/g, title)
  }
  if (overrideFormattedTitle) {
    formattedTitle = title ?? config.title
  }

  // Use provided image, or fall back to twitter.image, or finally to default config
  const finalImage = image ?? twitter?.image ?? config.twitter.image
  const processedImage = ipfsUriToGatewayUrl(finalImage)

  // Use default JBM banner dimensions if using default, otherwise use standard OG dimensions
  const isDefaultImage = finalImage === config.twitter.image
  const ogImage = {
    src: isDefaultImage
      ? (SiteBaseUrl ? SiteBaseUrl : '/') + 'assets/JBM-Unfurl-banner.png'
      : processedImage,
    type: 'image/png',
    width: isDefaultImage ? '1136' : '1200',
    height: isDefaultImage ? '497' : '630',
  }

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
        image={processedImage}
      />
      <OpenGraphMetaTags
        type="website"
        url={url ?? SiteBaseUrl} // default to base url
        title={formattedTitle}
        description={description ?? config.description}
        siteName={config.title}
        image={ogImage}
      />

      <Head>{children}</Head>
      {/**
       * As recommended in Next docs that next/script can be loaded directly
       * outside next/head with strategies like afterInteractive without affecting
       * the page performance
       */}
      {process.env.NODE_ENV === 'production' && (
        <>
          <HotjarScript />
        </>
      )}
    </>
  )
}
