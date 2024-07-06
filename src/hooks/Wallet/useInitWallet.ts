import { useAccountCenter, useWallets } from '@web3-onboard/react'
import { startTransition, useEffect } from 'react'
import {
  useLoadSafeWallet,
  useLoadWalletFromLocalStorage,
  useStoreWalletsInLocalStorage,
} from './hooks'

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
