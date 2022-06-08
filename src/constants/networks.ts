import { NetworkName } from 'models/network-name'

const infuraId = process.env.NEXT_PUBLIC_INFURA_ID

type NetworkInfo = {
  name: NetworkName
  color: string
  chainId: number
  blockExplorer: string
  rpcUrl: string
  faucet?: string
  price?: number
  gasPrice?: number
}

export const NETWORKS: Record<number, NetworkInfo> = {
  1: {
    name: NetworkName.mainnet,
    color: '#ff8b9e',
    chainId: 1,
    rpcUrl: `https://mainnet.infura.io/v3/${infuraId}`,
    blockExplorer: 'https://etherscan.io/',
  },
  4: {
    name: NetworkName.rinkeby,
    color: '#e0d068',
    chainId: 4,
    rpcUrl: `https://rinkeby.infura.io/v3/${infuraId}`,
    faucet: 'https://faucet.rinkeby.io/',
    blockExplorer: 'https://rinkeby.etherscan.io/',
  },
  3: {
    name: NetworkName.ropsten,
    color: '#F60D09',
    chainId: 3,
    faucet: 'https://faucet.ropsten.be/',
    blockExplorer: 'https://ropsten.etherscan.io/',
    rpcUrl: `https://ropsten.infura.io/v3/${infuraId}`,
  },
}

const NETWORKS_BY_NAME = Object.values(NETWORKS).reduce(
  (acc, curr) => ({
    ...acc,
    [curr.name]: curr,
  }),
  {} as Record<NetworkName, NetworkInfo>,
)

export const readNetwork =
  NETWORKS_BY_NAME[process.env.NEXT_PUBLIC_INFURA_NETWORK as NetworkName]
