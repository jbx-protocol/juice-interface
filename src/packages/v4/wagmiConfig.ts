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
      `https://optimism-sepolia.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_ID}`,
    ),
    // TODO maybe revert to       `https://api.developer.coinbase.com/rpc/v1/base-sepolia/${process.env.NEXT_PUBLIC_BASE_ID}`

    [baseSepolia.id]: http(
      `https://base-sepolia.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_ID}`,
    ),
    [arbitrumSepolia.id]: http(
      `https://arbitrum-sepolia.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_ID}`,
    ),
  },
})
