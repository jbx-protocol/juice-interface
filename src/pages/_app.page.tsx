import type { AppProps } from 'next/app'
import React from 'react'
import { Head } from 'components/common'
import { NetworkProvider } from 'providers/NetworkProvider'

import '../styles/antd.css'
import '../styles/index.scss'

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      {/* Default HEAD - overwritten by specific page SEO */}
      <Head />
      <NetworkProvider>
        <Component {...pageProps} />
      </NetworkProvider>
    </>
  )
}
