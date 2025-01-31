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

let hostname = 'localhost'
if (typeof window !== 'undefined') {
  hostname = window.location.hostname
}

export const NETWORKS: Record<number, NetworkInfo> = {
  1: {
    name: NetworkName.mainnet,
    label: 'Ethereum Mainnet',
    color: '#ff8b9e',
    chainId: 1,
    token: 'ETH',
    rpcUrl: `https://mainnet.infura.io/v3/${infuraId}`,
    blockExplorer: 'https://etherscan.io/',
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
  // 42161: {
  //   name: NetworkName.arbitrum,
  //   label: 'Arbitrum',
  //   color: '#28a0f0',
  //   chainId: 42161,
  //   token: 'ArbETH',
  //   rpcUrl: `https://arbitrum-mainnet.infura.io/v3/${infuraId}`,
  //   blockExplorer: 'https://arbiscan.io',
  // },
  421614: {
    name: NetworkName.arbitrumSepolia,
    label: 'Arbitrum Sepolia Testnet',
    color: '#96bedc',
    chainId: 421614,
    token: 'ArbETH',
    rpcUrl: `https://sepolia-rollup.arbitrum.io/rpc`,
    blockExplorer: 'https://sepolia-explorer.arbitrum.io',
  },
  // 10: {
  //   name: NetworkName.optimism,
  //   label: 'Optimism',
  //   color: '#ff0420',
  //   chainId: 10,
  //   token: 'OpETH',
  //   rpcUrl: `https://optimism-mainnet.infura.io/v3/${infuraId}`,
  //   blockExplorer: 'https://optimistic.etherscan.io',
  // },
  11155420: {
    name: NetworkName.optimismSepolia,
    label: 'Optimism Sepolia Testnet',
    color: '#f01f70',
    chainId: 11155420,
    token: 'OpETH',
    rpcUrl: `https://sepolia.optimism.io`,
    blockExplorer: 'https://optimism-sepolia.blockscout.com',
  },
  // 8453: {
  //   name: NetworkName.base,
  //   label: 'Base',
  //   color: '#00d395',
  //   chainId: 8453,
  //   token: 'BaseETH',
  //   rpcUrl: `https://mainnet.base.org`,
  //   blockExplorer: 'https://basescan.org',
  // },
  84532: {
    name: NetworkName.baseSepolia,
    label: 'Base Sepolia',
    color: '#00d395',
    chainId: 84532,
    token: 'BaseETH',
    rpcUrl: `https://sepolia.base.org`,
    blockExplorer: 'https://sepolia.basescan.org',
  },
}

export const TESTNET_IDS = new Set<number>([
  11155111, 421614, 11155420, 84531, 1442,
])

export const NETWORKS_BY_NAME = Object.values(NETWORKS).reduce(
  (acc, curr) => ({
    ...acc,
    [curr.name]: curr,
  }),
  {} as Record<NetworkName, NetworkInfo>,
)

/**
 * TODO update to mainnet when we go to prod
 */
export const DEFAULT_PROJECT_CHAIN_ID = NETWORKS_BY_NAME.sepolia
  .chainId as unknown as JBChainId // TODO once mainnet is a JBChainId, this wont be necessary

export const readNetwork =
  NETWORKS_BY_NAME[process.env.NEXT_PUBLIC_INFURA_NETWORK]
