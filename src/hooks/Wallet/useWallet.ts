import { ParaEthersV5Signer } from '@getpara/ethers-v5-integration'
import {
  useAccount,
  useClient,
  useLogout,
  useModal,
  useWallet as useParaWallet,
} from '@getpara/react-sdk'
import { readNetwork } from 'constants/networks'
import { wagmiConfig } from 'contexts/Para/Providers'
import { providers, utils } from 'ethers'
import { useMemo } from 'react'
import { EIP1193Provider } from 'viem'
import {
  useBalance,
  useChainId,
  useChains,
  useSwitchChain,
  useWalletClient,
} from 'wagmi'

// Define return type for better type safety
interface WalletHookReturn {
  signer: providers.JsonRpcSigner | ParaEthersV5Signer | undefined
  userAddress: string | undefined
  eip1193Provider: EIP1193Provider | undefined
  isConnected: boolean
  chain: {
    id: string
    name: string
  }
  chainUnsupported: boolean
  balance: string
  connect: () => Promise<void>
  disconnect: () => void
  changeNetworks: (chainId?: number) => void
}

/**
 * Hook for wallet connection management supporting both Para embedded wallets
 * and external wallets (MetaMask, etc.) through Para SDK integration.
 *
 * Para supports two wallet types:
 * - Embedded: User logs in with social accounts (Google, Twitter, etc.) creating a Para account
 * - External: Traditional web3 wallets connected via wagmi (MetaMask, WalletConnect, etc.)
 */
export function useWallet(): WalletHookReturn {
  // Para SDK hooks for wallet state
  const { isConnected, connectionType, external } = useAccount()
  const { data: paraWallet } = useParaWallet() // Only available for embedded wallets
  const { logout: paraLogout } = useLogout()
  const { openModal } = useModal()
  const client = useClient()

  // Wagmi hooks for external wallet support
  const { data: walletClient } = useWalletClient()
  const chains = useChains()
  const chainId = useChainId()
  const { switchChain } = useSwitchChain()

  // Extract EIP-1193 provider for compatibility with ethers.js
  const eip1193Provider = walletClient?.transport as EIP1193Provider | undefined

  // Find current chain info
  const chain = chains.find(c => c.id === chainId)

  // Create appropriate signer based on wallet connection type
  // Memoized to prevent recreation on every render
  const signer = useMemo(() => {
    if (!isConnected) return undefined

    // External wallets (MetaMask, etc.) - use wagmi's provider
    if (
      (connectionType === 'external' || connectionType === 'both') &&
      walletClient
    ) {
      const provider = new providers.Web3Provider(
        walletClient.transport as providers.ExternalProvider,
      )
      return provider.getSigner()
    }

    // Embedded wallets or 'both' - use Para's signer
    // When 'both', we prioritize embedded for consistency
    if (connectionType === 'embedded' && client) {
      return new ParaEthersV5Signer(client)
    }

    return undefined
  }, [isConnected, connectionType, walletClient, client])

  // Resolve user address based on connection type
  const userAddress = useMemo(() => {
    // External wallet address comes from wagmi connection
    if (connectionType === 'external' && external?.evm?.address) {
      return external.evm.address
    }
    // Embedded wallet address comes from Para wallet
    return paraWallet?.address
  }, [connectionType, external?.evm?.address, paraWallet?.address])

  // Use wagmi's useBalance hook which works for both wallet types
  // This replaces Para's useWalletBalance for better compatibility
  const { data: balanceData } = useBalance({
    address: userAddress as `0x${string}` | undefined,
    config: wagmiConfig,
  })

  // Format balance to string, defaulting to '0' if not available
  const balance = balanceData?.value
    ? utils.formatEther(balanceData.value)
    : '0'

  // Connection handler - returns existing promise if already connected
  const connect = async () => {
    if (isConnected) {
      return Promise.resolve()
    }
    return openModal()
  }

  // Disconnection always goes through Para SDK
  const disconnect = () => paraLogout()

  // Network switching with fallback to default network
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
    chainUnsupported: false,
    balance,
    connect,
    disconnect,
    changeNetworks,
  }
}
