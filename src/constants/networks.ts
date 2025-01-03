import { NetworkName } from 'models/networkName'
import { isBrowser } from 'utils/isBrowser'

const infuraId = isBrowser()
  ? process.env.NEXT_PUBLIC_INFURA_ID
  : process.env.PRE_RENDER_INFURA_ID

type NetworkInfo = {
  name: NetworkName
  label: string
  color: string
  chainId: number
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
  42161: {
    name: NetworkName.arbitrumOne,
    label: 'Arbitrum One',
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
    rpcUrl: `https://sepolia-rollup.arbitrum.io/rpc`,
    blockExplorer: 'https://sepolia-explorer.arbitrum.io',
  },
  11155420: {
    name: NetworkName.optimismSepolia,
    label: 'Optimism Sepolia Testnet',
    color: '#f01f70',
    chainId: 11155420, 
    token: 'OpETH',
    rpcUrl: `https://sepolia.optimism.io`,
    blockExplorer: 'https://optimism-sepolia.blockscout.com',
  },
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

export const TESTNET_IDS = new Set([11155111, 421614, 11155420, 84531])

export type SupportedChainId = keyof typeof NETWORKS;

export const NETWORKS_BY_NAME = Object.values(NETWORKS).reduce(
  (acc, curr) => ({
    ...acc,
    [curr.name]: curr,
  }),
  {} as Record<NetworkName, NetworkInfo>,
)

export const DEFAULT_PROJECT_CHAIN_ID = NETWORKS_BY_NAME.mainnet.chainId

export const readNetwork =
  NETWORKS_BY_NAME[process.env.NEXT_PUBLIC_INFURA_NETWORK]
