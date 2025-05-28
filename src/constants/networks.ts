import { JBChainId } from 'juice-sdk-core'
import { NetworkName } from 'models/networkName'
import { isBrowser } from 'utils/isBrowser'

const infuraId = isBrowser()
  ? process.env.NEXT_PUBLIC_INFURA_ID
  : process.env.PRE_RENDER_INFURA_ID

type NetworkInfo = {
  name: NetworkName
  label: string
  color: string
  chainId: number // should be JBChainId
  blockExplorer: string
  rpcUrl: string
  token: string
}

/**
 * @TODO should be JB_CHAINS from sdk
 */
export const NETWORKS: Record<number, NetworkInfo> = {
  1: {
    name: NetworkName.mainnet,
    label: 'Ethereum Mainnet',
    color: '#ff8b9e',
    chainId: 1,
    token: 'ETH',
    rpcUrl: `https://mainnet.infura.io/v3/${infuraId}`,
    blockExplorer: 'https://etherscan.io',
  },
  11155111: {
    name: NetworkName.sepolia,
    label: 'Sepolia',
    color: '#ff8b9e',
    chainId: 11155111,
    blockExplorer: 'https://sepolia.etherscan.io',
    rpcUrl: `https://sepolia.infura.io/v3/${infuraId}`,
    token: 'SepETH',
  },
  42161: {
    name: NetworkName.arbitrum,
    label: 'Arbitrum',
    color: '#28a0f0',
    chainId: 42161,
    token: 'ArbETH',
    rpcUrl: `https://arbitrum-mainnet.infura.io/v3/${infuraId}`,
    blockExplorer: 'https://arbiscan.io',
  },
  421614: {
    name: NetworkName.arbitrumSepolia,
    label: 'Arbitrum Sepolia Testnet',
    color: '#96bedc',
    chainId: 421614,
    token: 'ArbETH',
    rpcUrl: `https://arbitrum-mainnet.infura.io/v3/${infuraId}`,
    blockExplorer: 'https://sepolia-explorer.arbitrum.io',
  },
  10: {
    name: NetworkName.optimism,
    label: 'Optimism',
    color: '#ff0420',
    chainId: 10,
    token: 'OpETH',
    rpcUrl: `https://optimism-mainnet.infura.io/v3/${infuraId}`,
    blockExplorer: 'https://optimistic.etherscan.io',
  },
  11155420: {
    name: NetworkName.optimismSepolia,
    label: 'Optimism Sepolia Testnet',
    color: '#f01f70',
    chainId: 11155420,
    token: 'OpETH',
    rpcUrl: `https://optimism-sepolia.infura.io/v3/${infuraId}`,
    blockExplorer: 'https://optimism-sepolia.blockscout.com',
  },
  8453: {
    name: NetworkName.base,
    label: 'Base',
    color: '#00d395',
    chainId: 8453,
    token: 'BaseETH',
    rpcUrl: `https://base-mainnet.infura.io/v3/${infuraId}`,
    blockExplorer: 'https://basescan.org',
  },
  84532: {
    name: NetworkName.baseSepolia,
    label: 'Base Sepolia',
    color: '#00d395',
    chainId: 84532,
    token: 'BaseETH',
    rpcUrl: `https://base-sepolia.infura.io/v3/${infuraId}`,
    blockExplorer: 'https://sepolia.basescan.org',
  },
}

export const TESTNET_IDS = new Set<number>([11155111, 421614, 11155420, 84532])

export const MAINNET_IDS = new Set<number>([1, 42161, 10, 8453])

export const NETWORKS_BY_NAME = Object.values(NETWORKS).reduce(
  (acc, curr) => ({
    ...acc,
    [curr.name]: curr,
  }),
  {} as Record<NetworkName, NetworkInfo>,
)

/**
 * Sort chain IDs in a predefined order
 * @param chainIds Array of chain IDs to sort
 * @returns Sorted array of chain IDs
 */
export function sortChainIds(chainIds: JBChainId[]): JBChainId[] {
  // Hardcoded order: Ethereum, Sepolia, Arbitrum, Arbitrum Sepolia, Optimism, Optimism Sepolia, Base, Base Sepolia
  const chainOrder = [1, 11155111, 42161, 421614, 10, 11155420, 8453, 84532]

  return chainIds.sort((a, b) => {
    const indexA = chainOrder.indexOf(a)
    const indexB = chainOrder.indexOf(b)
    // If a chain ID is not in the predefined order, put it at the end
    if (indexA === -1) return 1
    if (indexB === -1) return -1
    return indexA - indexB
  })
}

/**
 * TODO update to mainnet when we go to prod
 */
export const DEFAULT_PROJECT_CHAIN_ID = NETWORKS_BY_NAME.sepolia
  .chainId as unknown as JBChainId // TODO once mainnet is a JBChainId, this wont be necessary

/**
 * @note NOT used in JBV4!
 */
export const readNetwork =
  NETWORKS_BY_NAME[process.env.NEXT_PUBLIC_INFURA_NETWORK]
