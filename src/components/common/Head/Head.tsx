import { SEO, SEOProps } from '../SEO/SEO'
import { FONT_PATHS } from './fonts'

export const Head: React.FC<SEOProps> = props => {
  return (
    <SEO {...props}>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="theme-color" content="#5777EB" />
      <meta name="msapplication-TileColor" content="#5777EB" />

      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href="/apple-touch-icon.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href="/favicon-32x32.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href="/favicon-16x16.png"
      />
      <link
        rel="manifest"
        href="/manifest.json"
        crossOrigin="use-credentials"
      />
      <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5777EB" />
      {FONT_PATHS.map(path => (
        <link
          key={path}
          rel="preload"
          href={path}
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      ))}
    </SEO>
  )
}
