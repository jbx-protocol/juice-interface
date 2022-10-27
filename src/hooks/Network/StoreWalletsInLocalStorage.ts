import { WalletState } from '@web3-onboard/core'
import { useCallback } from 'react'
import { safeLocalStorage } from 'utils/windowUtils'

export function useStoreWalletsInLocalStorage() {
  const storeWalletsInLocalStorage = useCallback(
    async (wallets: WalletState[]) => {
      if (!wallets.length) return

      const connectedWalletsLabelArray = wallets.map(({ label }) => label)
      safeLocalStorage?.setItem(
        'connectedWallets',
        JSON.stringify(connectedWalletsLabelArray),
      )
    },
    [],
  )

  return storeWalletsInLocalStorage
}
