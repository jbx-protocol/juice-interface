import { useChainModal, useConnectModal } from '@rainbow-me/rainbowkit'
import { useCallback, useMemo } from 'react'
import { useAccount, useNetwork } from 'wagmi'

export function useWallet() {
  const { address: userAddress, isConnected } = useAccount()
  const { chain } = useNetwork()
  const { openConnectModal } = useConnectModal()
  const { openChainModal } = useChainModal()

  const chainUnsupported = useMemo(() => {
    return chain?.unsupported ?? false
  }, [chain])

  const changeNetworks = useCallback(() => {
    if (!openChainModal) {
      console.warn(
        'useWallet - called changeNetwork but openChainModal is undefined',
      )
      return
    }
    openChainModal()
  }, [openChainModal])

  const connect = useCallback(() => {
    if (!openConnectModal) {
      console.warn(
        'useWallet - called connect but openConnectModal is undefined',
      )
      return
    }
    openConnectModal()
  }, [openConnectModal])

  const checkNetworkSupported = useCallback(() => {
    const modalInterventionRequired = chainUnsupported
    if (modalInterventionRequired) {
      changeNetworks()
    }
    return !modalInterventionRequired
  }, [chainUnsupported, changeNetworks])

  const checkWalletConnected = useCallback(() => {
    const modalInterventionRequired = !isConnected
    if (modalInterventionRequired) {
      connect()
    }
    return !modalInterventionRequired
  }, [connect, isConnected])

  return {
    userAddress,
    isConnected: userAddress && isConnected,
    connect,
    chainUnsupported,
    changeNetworks,
    checkNetworkSupported,
    checkWalletConnected,
  }
}
