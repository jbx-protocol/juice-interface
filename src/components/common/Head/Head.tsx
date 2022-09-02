import { VFC } from 'react'

import { SEO } from '../SEO'
import { FathomScript } from './scripts/FathomScript'
import { HotjarScript } from './scripts/HotjarScript'

export const Head: VFC = () => {
  return (
    <SEO>
      <meta
        key="viewport"
        name="viewport"
        content="width=device-width, initial-scale=1"
      />
      <meta name="theme-color" content="#000000" />

      <link rel="apple-touch-icon" href="/assets/juice_logo-ol.png" />
      <link rel="icon" href="/favicon.ico" />
      <link rel="manifest" href="/manifest.json" />

      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link
        href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&display=swap"
        rel="stylesheet"
      />

      {process.env.NODE_ENV === 'production' && (
        <>
          <FathomScript />
          <HotjarScript />
        </>
      )}
    </SEO>
  )
}
