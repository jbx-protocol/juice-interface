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
