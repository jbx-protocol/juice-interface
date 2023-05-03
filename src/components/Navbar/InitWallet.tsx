import { BigNumber } from '@ethersproject/bignumber'
import coinbaseWalletModule from '@web3-onboard/coinbase'
import { OnboardAPI } from '@web3-onboard/core'
import gnosisModule from '@web3-onboard/gnosis'
import injectedModule from '@web3-onboard/injected-wallets'
import keystoneModule from '@web3-onboard/keystone'
import ledgerModule from '@web3-onboard/ledger'
import { init, useAccountCenter, useWallets } from '@web3-onboard/react'
import trezorModule from '@web3-onboard/trezor'
import walletConnectModule from '@web3-onboard/walletconnect'
import config from 'config/seo_meta.json'
import { NETWORKS } from 'constants/networks'
import {
  useLoadSafeWallet,
  useLoadWalletFromLocalStorage,
  useStoreWalletsInLocalStorage,
} from 'hooks/Network'
import { useEffect, useState } from 'react'
import { unpadLeadingZerosString } from 'utils/bigNumbers'

function initWeb3Onboard(): OnboardAPI {
  console.info('Initializing Web3Onboard...')

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

  return init({
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
      icon: '/assets/juice-logo-icon_black.png',
      name: config.title,
      description: config.description,
    },
  })
}

export function useInitWallet() {
  const [web3Onboard] = useState<OnboardAPI | null>(() => initWeb3Onboard())

  const updateAccountCenter = useAccountCenter()
  const loadWalletFromLocalStorage = useLoadWalletFromLocalStorage()
  const storeWalletsInLocalStorage = useStoreWalletsInLocalStorage()
  const loadSafeWallet = useLoadSafeWallet()
  const connectedWallets = useWallets()

  // If possible, load Safe wallets
  useEffect(() => {
    if (!web3Onboard) return
    loadSafeWallet()
  }, [loadSafeWallet, web3Onboard])

  // Load any previously connected wallets
  useEffect(() => {
    if (!web3Onboard) return

    loadWalletFromLocalStorage()
  }, [loadWalletFromLocalStorage, web3Onboard])

  // store any wallets
  useEffect(() => {
    if (!web3Onboard) return

    storeWalletsInLocalStorage(connectedWallets)
  }, [storeWalletsInLocalStorage, connectedWallets, web3Onboard])

  // disable account center in web3-onboard
  useEffect(() => {
    if (!web3Onboard) return

    updateAccountCenter({ enabled: false })
  }, [updateAccountCenter, web3Onboard])
}
