import coinbaseWalletModule from '@web3-onboard/coinbase'
import gnosisModule from '@web3-onboard/gnosis'
import injectedModule from '@web3-onboard/injected-wallets'
import keystoneModule from '@web3-onboard/keystone'
import { init, useAccountCenter, useWallets } from '@web3-onboard/react'
import walletConnectModule from '@web3-onboard/walletconnect'
import config from 'config/seo_meta.json'
import { NETWORKS, readNetwork } from 'constants/networks'
import { BigNumber } from 'ethers'
import { startTransition, useEffect } from 'react'
import { unpadLeadingZerosString } from 'utils/bigNumbers'
import {
  useLoadSafeWallet,
  useLoadWalletFromLocalStorage,
  useStoreWalletsInLocalStorage,
} from './hooks'

export function initWeb3Onboard() {
  console.info('Initializing Web3Onboard...')

  const injected = injectedModule()
  const gnosis = gnosisModule()
  const keystone = keystoneModule()
  const walletConnect = walletConnectModule({
    version: 2,
    projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID!,
    requiredChains: [readNetwork.chainId],
  })
  const coinbaseWalletSdk = coinbaseWalletModule()

  return init({
    wallets: [injected, gnosis, keystone, walletConnect, coinbaseWalletSdk],
    chains: Object.values(NETWORKS).map(n => ({
      id: unpadLeadingZerosString(BigNumber.from(n.chainId).toHexString()),
      rpcUrl: n.rpcUrl,
      token: n.token ?? 'ETH',
      label: n.label,
    })),
    appMetadata: {
      logo: '/assets/juice-logo-full_black.svg',
      name: config.title,
      description: config.description,
    },
  })
}

export function useInitWallet() {
  const updateAccountCenter = useAccountCenter()
  const loadWalletFromLocalStorage = useLoadWalletFromLocalStorage()
  const storeWalletsInLocalStorage = useStoreWalletsInLocalStorage()
  const loadSafeWallet = useLoadSafeWallet()
  const connectedWallets = useWallets()

  // If possible, load Safe wallets
  useEffect(() => {
    startTransition(() => {
      loadSafeWallet()
    })
  }, [loadSafeWallet])

  // Load any previously connected wallets
  useEffect(() => {
    startTransition(() => {
      loadWalletFromLocalStorage()
    })
  }, [loadWalletFromLocalStorage])

  // store any wallets
  useEffect(() => {
    startTransition(() => {
      storeWalletsInLocalStorage(connectedWallets)
    })
  }, [storeWalletsInLocalStorage, connectedWallets])

  // disable account center in web3-onboard
  useEffect(() => {
    startTransition(() => {
      updateAccountCenter({ enabled: false })
    })
  }, [updateAccountCenter])
}
