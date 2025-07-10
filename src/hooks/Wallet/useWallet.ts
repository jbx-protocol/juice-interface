import {
  useChain,
  useChainUnsupported,
  useChangeNetworks,
  useConnect,
  useDisconnect,
  useIsConnected,
  useSigner,
  useUserAddress,
  useWalletBalance,
} from './hooks';

import { useEip1193Provider } from './hooks/useEip1193Provider';

export function useWallet() {
  const signer = useSigner()
  const userAddress = useUserAddress()
  const isConnected = useIsConnected()
  const chain = useChain()
  const eip1193Provider = useEip1193Provider()
  const chainUnsupported = useChainUnsupported()
  const balance = useWalletBalance()

  const connect = useConnect()
  const disconnect = useDisconnect()
  const changeNetworks = useChangeNetworks()

  return {
    signer,
    userAddress,
    eip1193Provider,
    isConnected,
    chain,
    chainUnsupported,
    balance,
    connect,
    disconnect,
    changeNetworks,
  }
}

export type Wallet = ReturnType<typeof useWallet>
