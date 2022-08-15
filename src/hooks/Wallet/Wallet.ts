import { useConnectWallet } from '@web3-onboard/react'

import {
  useProvider,
  useUserAddress,
  useChainUnsupported,
  useChangeNetworks,
  useDisconnect,
  useIsConnected,
  useChain,
  useSigner,
} from './hooks'

export function useWallet() {
  const provider = useProvider()
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
    provider,
    userAddress,
    isConnected,
    chain,
    chainUnsupported,
    connect,
    disconnect,
    changeNetworks,
  }
}
