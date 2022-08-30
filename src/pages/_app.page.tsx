import coinbaseWalletModule from '@web3-onboard/coinbase'
import gnosisModule from '@web3-onboard/gnosis'
import injectedModule from '@web3-onboard/injected-wallets'
import keystoneModule from '@web3-onboard/keystone'
import ledgerModule from '@web3-onboard/ledger'
import trezorModule from '@web3-onboard/trezor'
import walletConnectModule from '@web3-onboard/walletconnect'
import { Head } from 'components/common'
import type { AppProps } from 'next/app'
import React, { useEffect } from 'react'

import { BigNumber } from '@ethersproject/bignumber'
import { init, useAccountCenter, useWallets } from '@web3-onboard/react'
import config from 'config/seo_meta.json'
import {
  useLoadWalletFromLocalStorage,
  useStoreWalletsInLocalStorage,
} from 'hooks/Network'
import { unpadLeadingZerosString } from 'utils/bigNumbers'
import '../styles/antd.css'
import '../styles/index.scss'

import { NETWORKS } from 'constants/networks'

const injected = injectedModule()
const gnosis = gnosisModule()
const ledger = ledgerModule()
const trezor = trezorModule({
  appUrl: 'https://juicebox.money/',
  email: 'me.jango@protonmail.com',
})
const keystone = keystoneModule()
const walletConnect = walletConnectModule()
const coinbaseWalletSdk = coinbaseWalletModule()

init({
  wallets: [
    injected,
    gnosis,
    ledger,
    trezor,
    keystone,
    walletConnect,
    coinbaseWalletSdk,
  ],
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
  const updateAccountCenter = useAccountCenter()
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

  // disable account center in web3-onboard
  useEffect(() => {
    updateAccountCenter({ enabled: false })
  }, [updateAccountCenter])

  return (
    <>
      {/* Default HEAD - overwritten by specific page SEO */}
      <Head />
      <Component {...pageProps} />
    </>
  )
}
