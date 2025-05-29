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

const appName = 'Juicebox';
const appLogoUrl = 'https://juicebox.money/assets/juice-logo-full_black.svg';

export const wagmiConfig = createConfig({
  chains:
    /**
     * TODO we should probably not include testnets on the prod site, and vice verse. Just for max safety.
     * The problem now though, is both the prod and testnet sites rely on some prod API routes
     * that use the SDK, which ultimately uses this wagmi config.
     */
    // process.env.NEXT_PUBLIC_TESTNET === 'true'
    //   ? [sepolia, optimismSepolia, baseSepolia, arbitrumSepolia]
    //   : [mainnet, optimism, arbitrum, base],
    [
      mainnet,
      optimism,
      arbitrum,
      base,
      sepolia,
      optimismSepolia,
      baseSepolia,
      arbitrumSepolia,
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
