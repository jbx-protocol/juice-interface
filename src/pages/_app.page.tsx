import type { AppProps } from 'next/app'
import React, { useEffect } from 'react'
import { Head } from 'components/common'
import injectedModule from '@web3-onboard/injected-wallets'

import '../styles/antd.css'
import '../styles/index.scss'
import {
  useLoadWalletFromLocalStorage,
  useStoreWalletsInLocalStorage,
} from 'hooks/Network'
import { BigNumber } from '@ethersproject/bignumber'
import { init, useWallets } from '@web3-onboard/react'
import { unpadLeadingZerosString } from 'utils/bigNumbers'
import config from 'config/seo_meta.json'

import { NETWORKS } from 'constants/networks'

const injected = injectedModule()

init({
  wallets: [injected],
  chains: Object.values(NETWORKS).map(n => ({
    id: unpadLeadingZerosString(BigNumber.from(n.chainId).toHexString()),
    rpcUrl: n.rpcUrl,
    token: n.token ?? 'ETH',
    label: n.label,
  })),
  appMetadata: {
    icon: '/assets/juice_logo-ol.png',
    name: config.title,
    description: config.description,
  },
})

export default function MyApp({ Component, pageProps }: AppProps) {
  const loadWalletFromLocalStorage = useLoadWalletFromLocalStorage()
  const storeWalletsInLocalStorage = useStoreWalletsInLocalStorage()
  const connectedWallets = useWallets()

  // Load any previously connected wallets
  useEffect(() => {
    loadWalletFromLocalStorage()
  }, [loadWalletFromLocalStorage])

  // store any wallets
  useEffect(() => {
    storeWalletsInLocalStorage(connectedWallets)
  }, [storeWalletsInLocalStorage, connectedWallets])
  return (
    <>
      {/* Default HEAD - overwritten by specific page SEO */}
      <Head />
      <Component {...pageProps} />
    </>
  )
}
