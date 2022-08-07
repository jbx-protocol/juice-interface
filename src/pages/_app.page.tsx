import type { AppProps } from 'next/app'
import React from 'react'
import { Head } from 'components/common'
import { WagmiConfig } from 'wagmi'
import { appInfo, chains, wagmiClient } from 'utils/chainClient'
import { RainbowKitProvider } from '@rainbow-me/rainbowkit'

import '../styles/antd.css'
import '../styles/index.scss'
import '@rainbow-me/rainbowkit/styles.css'

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      {/* Default HEAD - overwritten by specific page SEO */}
      <Head />
      <WagmiConfig client={wagmiClient}>
        <RainbowKitProvider appInfo={appInfo} chains={chains}>
          <Component {...pageProps} />
        </RainbowKitProvider>
      </WagmiConfig>
    </>
  )
}
