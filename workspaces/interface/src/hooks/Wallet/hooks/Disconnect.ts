import { useConnectWallet } from '@web3-onboard/react'
import { useCallback } from 'react'

export function useDisconnect() {
  const [{ wallet }, , disconnectHook] = useConnectWallet()
  const disconnect = useCallback(async () => {
    if (wallet) {
      await disconnectHook(wallet)
      window.localStorage.removeItem('connectedWallets')
    }
  }, [disconnectHook, wallet])
  return disconnect
}
