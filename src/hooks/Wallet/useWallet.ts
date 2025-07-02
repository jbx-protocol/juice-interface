import { ParaEthersV5Signer } from '@getpara/ethers-v5-integration'
import {
  useAccount,
  useClient,
  useLogout,
  useModal,
  useWallet as useParaWallet,
  useWalletBalance,
} from '@getpara/react-sdk'
import { readNetwork } from 'constants/networks'
import { EIP1193Provider } from 'viem'
import { useChainId, useChains, useSwitchChain, useWalletClient } from 'wagmi'

export function useWallet() {
  const { data: paraAccount } = useAccount()
  const { data: paraWallet } = useParaWallet()
  const { logout: paraLogout } = useLogout()
  const { openModal } = useModal()
  const { data: walletClient } = useWalletClient()
  const client = useClient()
  const eip1193Provider = walletClient?.transport as EIP1193Provider | undefined

  const chains = useChains()
  const chainId = useChainId()
  const { switchChain } = useSwitchChain()

  const chain = chains.find(c => c.id === chainId)

  // The Para Ethers V5 Signer satisfies signer requirements
  const paraSigner =
    client && paraAccount?.isConnected
      ? new ParaEthersV5Signer(client)
      : undefined

  const userAddress = paraWallet?.address
  const isConnected = paraAccount?.isConnected ?? false
  const chainUnsupported = false
  const balanceQuery = useWalletBalance({
    walletId: paraWallet?.id ?? '',
  })

  const balance = balanceQuery.data ?? '0'
  const connect = () => {
    if (isConnected) {
      return Promise.resolve()
    }
    return openModal()
  }
  const disconnect = () => paraLogout()
  const changeNetworks = (chainId?: number) => {
    switchChain({ chainId: chainId ?? readNetwork.chainId })
  }

  return {
    signer: paraSigner,
    userAddress,
    eip1193Provider,
    isConnected,
    chain: {
      id: String(chain?.id ?? chainId),
      name: chain?.name ?? 'Unknown',
    },
    chainUnsupported,
    balance,
    connect,
    disconnect,
    changeNetworks,
  }
}
