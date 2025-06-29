import {
  useAccount,
  useLogout,
  useModal,
  useWallet as useParaWallet,
  useWalletBalance,
} from '@getpara/react-sdk'
import { signMessage } from '@wagmi/core'
import { readNetwork } from 'constants/networks'
import { wagmiConfig } from 'contexts/Para/Providers'
import { useChainId, useChains, useSwitchChain, useWalletClient } from 'wagmi'
import { EIP1193Provider } from 'viem'

export function useWallet() {
  const { data: paraAccount } = useAccount()
  const { data: paraWallet } = useParaWallet()
  const { logout: paraLogout } = useLogout()
  const { openModal } = useModal()
  const { data: walletClient } = useWalletClient()
  const eip1193Provider = walletClient?.transport as EIP1193Provider | undefined


  const chains = useChains()
  const chainId = useChainId()
  const { switchChain } = useSwitchChain()

  const chain = chains.find(c => c.id === chainId)

  const signer = {
    signMessage: async (message: string) => {
      if (
        !paraAccount?.isConnected ||
        !paraWallet?.id ||
        !paraWallet?.address
      ) {
        throw new Error('Wallet not connected')
      }
      return await signMessage(wagmiConfig, {
        account: paraWallet.address as `0x${string}`,
        message,
      })
    },
  }
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
    signer,
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
