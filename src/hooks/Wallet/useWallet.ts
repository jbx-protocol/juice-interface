import { createConfig, http } from 'wagmi';
import {
  arbitrum,
  arbitrumSepolia,
  base,
  baseSepolia,
  mainnet,
  optimism,
  optimismSepolia,
  sepolia,
} from 'wagmi/chains';
import { coinbaseWallet, injected, safe } from 'wagmi/connectors';
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

const appName = 'Juicebox';
const appLogoUrl = 'https://juicebox.money/assets/juice-logo-full_black.svg';
const walletConnectProjectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID;

export const wagmiConfig = createConfig({
  chains: [
    mainnet,
    arbitrum,
    base,
    optimism,
    sepolia,
    arbitrumSepolia,
    baseSepolia,
    optimismSepolia,
  ],
  connectors: [
    injected(),
    coinbaseWallet({
      appName,
      appLogoUrl,
      preference: { options: 'all' },
    }),
    // walletConnect({ projectId: walletConnectProjectId }),
    safe(),
  ],
  transports: {
    [mainnet.id]: http(`https://mainnet.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_ID}`),
    [optimism.id]: http(`https://optimism-mainnet.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_ID}`),
    [arbitrum.id]: http(`https://arbitrum-mainnet.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_ID}`),
    [base.id]: http(`https://base-mainnet.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_ID}`),
    [sepolia.id]: http(`https://sepolia.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_ID}`),
    [arbitrumSepolia.id]: http(`https://arbitrum-sepolia.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_ID}`),
    [baseSepolia.id]: http(`https://base-sepolia.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_ID}`),
    [optimismSepolia.id]: http(`https://optimism-sepolia.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_ID}`),
  },
});

export function useWallet() {
  const signer = useSigner()
  const userAddress = useUserAddress()
  const isConnected = useIsConnected()
  const chain = useChain()
  const chainUnsupported = useChainUnsupported()
  const balance = useWalletBalance()

  const connect = useConnect()
  const disconnect = useDisconnect()
  const changeNetworks = useChangeNetworks()

  return {
    signer,
    userAddress,
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
