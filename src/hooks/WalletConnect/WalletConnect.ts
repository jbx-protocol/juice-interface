import { useConnectModal } from '@rainbow-me/rainbowkit'
import { useCallback } from 'react'
import { useAccount } from 'wagmi'

export function useWalletConnect() {
  const { address: userAddress, isConnected } = useAccount()
  const { openConnectModal } = useConnectModal()

  const connect = useCallback(() => {
    if (!openConnectModal) {
      console.warn(
        'useWalletConnect - called connect but openConnectModal is undefined',
      )
      return
    }
    openConnectModal()
  }, [openConnectModal])

  return {
    isConnected: userAddress && isConnected,
    connect,
  }
}
