import { VFC } from 'react'

import { SEO } from '../SEO'

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
    </SEO>
  )
}
