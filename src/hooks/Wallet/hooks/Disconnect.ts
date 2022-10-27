import { useConnectWallet } from '@web3-onboard/react'
import { useCallback } from 'react'
import { safeLocalStorage } from 'utils/windowUtils'

export function useDisconnect() {
  const [{ wallet }, , disconnectHook] = useConnectWallet()
  const disconnect = useCallback(async () => {
    if (wallet) {
      await disconnectHook(wallet)
      safeLocalStorage?.removeItem('connectedWallets')
    }
  }, [disconnectHook, wallet])
  return disconnect
}
