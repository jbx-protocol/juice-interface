import config from 'config/seo_meta.json'
import { SiteBaseUrl } from 'constants/url'
import Head from 'next/head'
import { FC } from 'react'
import { cidFromUrl, ipfsPublicGatewayUrl } from 'utils/ipfs'

export interface SEOHeadProps {
  title?: string
  description?: string
  url?: string
  image?: string
  twitterCard?: 'summary' | 'summary_large_image' | 'app' | 'player'
  twitterCreator?: string
  robots?: string
  overrideFormattedTitle?: boolean
}

/**
 * Single SEO Head component that renders all meta tags in one <Head> component.
 * This ensures proper SSR extraction with Next.js Pages Router.
 */
export const SEOHead: FC<SEOHeadProps> = ({
  title,
  description,
  url,
  image,
  twitterCard,
  twitterCreator,
  robots,
  overrideFormattedTitle,
}) => {
  // Format title
  const formattedTitle = overrideFormattedTitle
    ? (title ?? config.title)
    : title
    ? config.titleTemplate.replace(/%s/g, title)
    : config.title

  // Use provided values or fall back to defaults
  const finalDescription = description ?? config.description
  const finalUrl = url ?? SiteBaseUrl ?? '/'
  const finalRobots = robots ?? 'index,follow'

  // Process image (handle IPFS URIs)
  const rawImage = image ?? config.twitter.image
  const processedImage = rawImage.startsWith('ipfs://')
    ? ipfsPublicGatewayUrl(cidFromUrl(rawImage))
    : rawImage

  // Use default JBM banner if no custom image
  const isDefaultImage = rawImage === config.twitter.image
  const finalImage = isDefaultImage
    ? (SiteBaseUrl ?? '/') + 'assets/JBM-Unfurl-banner.png'
    : processedImage

  const imageWidth = isDefaultImage ? 1136 : 1200
  const imageHeight = isDefaultImage ? 497 : 630

  // Twitter card type
  const finalTwitterCard = twitterCard ?? (config.twitter.cardType as 'summary_large_image')

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{formattedTitle}</title>
      <meta name="description" content={finalDescription} />
      <meta name="robots" content={finalRobots} />
      <meta name="googlebot" content={finalRobots} />

      {/* Open Graph Meta Tags */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={finalUrl} />
      <meta property="og:title" content={formattedTitle} />
      <meta property="og:description" content={finalDescription} />
      <meta property="og:site_name" content={config.title} />
      <meta property="og:image" content={finalImage} />
      <meta property="og:image:width" content={String(imageWidth)} />
      <meta property="og:image:height" content={String(imageHeight)} />
      <meta property="og:image:type" content="image/png" />

      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content={finalTwitterCard} />
      <meta name="twitter:site" content={config.twitter.site} />
      <meta name="twitter:creator" content={twitterCreator ?? config.twitter.creator} />
      <meta name="twitter:title" content={formattedTitle} />
      <meta name="twitter:description" content={finalDescription} />
      <meta name="twitter:image" content={processedImage} />
    </Head>
  )
}
