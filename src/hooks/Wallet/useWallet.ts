import { readNetwork } from 'constants/networks'
import { useConnect } from 'wagmi'
import {
  useChain,
  useChainUnsupported,
  useChangeNetworks,
  useDisconnect,
  useIsConnected,
  useSigner,
  useUserAddress,
} from './hooks'

const chainId = readNetwork.chainId

export function useWallet() {
  const { data: signer } = useSigner()
  const userAddress = useUserAddress()
  const isConnected = useIsConnected()
  const chain = useChain()
  const chainUnsupported = useChainUnsupported()

  const { connect } = useConnect({
    chainId,
  })
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
