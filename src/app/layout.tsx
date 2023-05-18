import config from 'config/seo_meta.json'
import { Metadata } from 'next'
import './globals.css'

export const generateMetadata = async (): Promise<Metadata> => {
  const formatTwitterHandle = (handle: string | undefined) =>
    handle ? (handle.startsWith('@') ? handle : '@' + handle) : undefined

  const formattedTitle = config.title
  return {
    title: formattedTitle,
    description: config.description,
    robots: 'index, follow',
    twitter: {
      title: formattedTitle,
      description: config.description,
      creator: formatTwitterHandle(config.twitter.creator),
      card: 'summary_large_image',
      images: config.twitter.image,
      site: config.twitter.site,
    },
    openGraph: {
      type: 'website',
      url: process.env.NEXT_PUBLIC_SITE_URL,
      title: formattedTitle,
      description: config.description,
      siteName: config.title,
      images: {
        url:
          (process.env.NEXT_PUBLIC_BASE_URL
            ? process.env.NEXT_PUBLIC_BASE_URL
            : '/') + 'assets/JBM-Unfurl-banner.png',
        type: 'image/png',
        width: '1136',
        height: '497',
      },
    },
    manifest: '/manifest.json',
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
