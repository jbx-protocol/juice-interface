import { createConfig, http } from 'wagmi'
import {
  arbitrumSepolia,
  baseSepolia,
  optimismSepolia,
  sepolia,
} from 'wagmi/chains'

export const wagmiConfig = createConfig({
  chains: [sepolia, optimismSepolia, baseSepolia, arbitrumSepolia],
  transports: {
    [sepolia.id]: http(
      `https://sepolia.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_ID}`,
    ),
    [optimismSepolia.id]: http(
      'https://sepolia.optimism.io'
    ),
    [baseSepolia.id]: http(
      `https://api.developer.coinbase.com/rpc/v1/base-sepolia/${process.env.NEXT_PUBLIC_BASE_ID}`,
    ),
    [arbitrumSepolia.id]: http(
      `https://sepolia-rollup.arbitrum.io/rpc`,
    ),
  },
})
