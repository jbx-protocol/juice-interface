import { useWallet } from 'hooks/Wallet'
import { useCallback } from 'react'
import { safeLocalStorage } from 'utils/windowUtils'

export function useLoadWalletFromLocalStorage() {
  const { connect } = useWallet()

  const loadWalletFromLocalStorage = useCallback(async () => {
    let previouslyConnectedWallets
    const rawConnectedWallets = safeLocalStorage?.getItem('connectedWallets')
    if (rawConnectedWallets) {
      previouslyConnectedWallets = JSON.parse(rawConnectedWallets)
    }
    if (previouslyConnectedWallets) {
      const wallet = previouslyConnectedWallets[0]
      await connect({ autoSelect: { label: wallet, disableModals: true } })
    }
  }, [connect])

  return loadWalletFromLocalStorage
}
