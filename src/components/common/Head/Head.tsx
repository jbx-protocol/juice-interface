import { VFC } from 'react'

import { SEO, SEOProps } from '../SEO'
import { FONT_PATHS } from './fonts'
import { FathomScript } from './scripts/FathomScript'
import { HotjarScript } from './scripts/HotjarScript'

export const Head: VFC<SEOProps> = props => {
  return (
    <SEO {...props}>
      <meta
        key="viewport"
        name="viewport"
        content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0"
      />
      <meta name="theme-color" content="#f5a312" />
      <meta name="msapplication-TileColor" content="#f5a312" />

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
      <link rel="manifest" href="/manifest.json" />
      <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#f5a312" />
      {FONT_PATHS.map(path => (
        <link
          key={path}
          rel="preload"
          href={path}
          as="font"
          type="font/woff"
          crossOrigin="true"
        />
      ))}

      {process.env.NODE_ENV === 'production' && (
        <>
          <FathomScript />
          <HotjarScript />
        </>
      )}
    </SEO>
  )
}
