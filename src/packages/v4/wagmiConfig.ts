import { createConfig, http } from 'wagmi'
import {
  arbitrum,
  arbitrumSepolia,
  base,
  baseSepolia,
  mainnet,
  optimism,
  optimismSepolia,
  sepolia,
} from 'wagmi/chains'

export const wagmiConfig = createConfig({
  chains: [
    mainnet,
    optimism,
    arbitrum,
    base,
    sepolia,
    optimismSepolia,
    baseSepolia,
    arbitrumSepolia,
  ],
  transports: {
    [mainnet.id]: http(
      `https://mainnet.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_ID}`,
    ),
    [optimism.id]: http(
      `https://optimism-mainnet.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_ID}`,
    ),
    [arbitrum.id]: http(
      `https://arbitrum-mainnet.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_ID}`,
    ),
    [base.id]: http(
      `https://base-mainnet.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_ID}`,
    ),

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
