import { Web3Provider } from '@ethersproject/providers'
import { useWallet } from 'hooks/Wallet'
import { useCallback, useMemo } from 'react'

export function useLoadWalletFromLocalStorage() {
  const { connect } = useWallet()

  const ethereumWebProvider = useMemo(() => {
    if (typeof window === 'undefined') return
    const { ethereum } = window
    if (typeof ethereum === 'undefined') return

    return new Web3Provider(ethereum)
  }, [])

  // Returns if a wallet is currently connected to Juicebox.
  const walletIsAvailable = useCallback(async () => {
    const accounts = (await ethereumWebProvider?.listAccounts()) ?? []
    return accounts.length > 0
  }, [ethereumWebProvider])

  const loadWalletFromLocalStorage = useCallback(async () => {
    // Check to see if a wallet has been connected before, otherwise don't worry about it.
    if (!(await walletIsAvailable())) return

    let previouslyConnectedWallets
    const rawConnectedWallets = localStorage.getItem('connectedWallets')
    if (rawConnectedWallets) {
      previouslyConnectedWallets = JSON.parse(rawConnectedWallets)
    }
    if (previouslyConnectedWallets) {
      const wallet = previouslyConnectedWallets[0]
      await connect({ autoSelect: { label: wallet, disableModals: true } })
    }
  }, [connect, walletIsAvailable])

  return loadWalletFromLocalStorage
}
