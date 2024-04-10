import { NetworkName } from 'models/networkName'
import { isBrowser } from 'utils/isBrowser'

const infuraId = isBrowser()
  ? process.env.NEXT_PUBLIC_INFURA_ID
  : process.env.PRE_RENDER_INFURA_ID

type NetworkInfo = {
  name: NetworkName
  label: string
  token?: string
  color: string
  chainId: number
  blockExplorer: string
  rpcUrl: string
  faucet?: string
  price?: number
  gasPrice?: number
}

let hostname = 'localhost'
if (typeof window !== 'undefined') {
  hostname = window.location.hostname
}

export const NETWORKS: Record<number, NetworkInfo> = {
  31337: {
    name: NetworkName.localhost,
    label: 'Local Host',
    color: '#666666',
    chainId: 31337,
    blockExplorer: '',
    rpcUrl: `http://${hostname}:8545`,
  },
  1: {
    name: NetworkName.mainnet,
    label: 'Ethereum Mainnet',
    color: '#ff8b9e',
    chainId: 1,
    rpcUrl: `https://mainnet.infura.io/v3/${infuraId}`,
    blockExplorer: 'https://etherscan.io/',
  },
  /**
   * @deprecated Please use sepolia
   */
  5: {
    name: NetworkName.goerli,
    label: 'Goerli',
    color: '#0975F6',
    chainId: 5,
    faucet: 'https://goerli-faucet.slock.it/',
    blockExplorer: 'https://goerli.etherscan.io/',
    rpcUrl: `https://goerli.infura.io/v3/${infuraId}`,
  },
  11155111: {
    name: NetworkName.sepolia,
    label: 'Sepolia',
    color: '#ff8b9e',
    chainId: 11155111,
    faucet: 'https://example.com',
    blockExplorer: 'https://sepolia.etherscan.io',
    rpcUrl: `https://sepolia.infura.io/v3/${infuraId}`,
  },
}

export const NETWORKS_BY_NAME = Object.values(NETWORKS).reduce(
  (acc, curr) => ({
    ...acc,
    [curr.name]: curr,
  }),
  {} as Record<NetworkName, NetworkInfo>,
)

export const readNetwork =
  NETWORKS_BY_NAME[process.env.NEXT_PUBLIC_INFURA_NETWORK]
