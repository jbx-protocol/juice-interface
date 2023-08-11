'use client'

import { useConnectWallet } from '@web3-onboard/react'
import {
  useChain,
  useChainUnsupported,
  useChangeNetworks,
  useDisconnect,
  useIsConnected,
  useSigner,
  useUserAddress,
} from './hooks'

export function useWallet() {
  const signer = useSigner()
  const userAddress = useUserAddress()
  const isConnected = useIsConnected()
  const chain = useChain()
  const chainUnsupported = useChainUnsupported()

  const [, connect] = useConnectWallet()
  const disconnect = useDisconnect()
  const changeNetworks = useChangeNetworks()

  return {
    signer,
    userAddress,
    isConnected,
    chain,
    chainUnsupported,
    connect,
    disconnect,
    changeNetworks,
  }
}

export type Wallet = ReturnType<typeof useWallet>
