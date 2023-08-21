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
  const { data: signer } = useSigner()
  const userAddress = useUserAddress()
  const isConnected = useIsConnected()
  const chain = useChain()
  const chainUnsupported = useChainUnsupported()

  const disconnect = useDisconnect()
  const changeNetworks = useChangeNetworks()

  return {
    signer,
    userAddress,
    isConnected,
    chain,
    chainUnsupported,
    disconnect,
    changeNetworks,
  }
}

export type Wallet = ReturnType<typeof useWallet>
