import { NetworkName } from 'models/network-name'

const infuraId = process.env.REACT_APP_INFURA_ID

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
  31337: {
    name: NetworkName.localhost,
    color: '#666666',
    chainId: 31337,
    blockExplorer: '',
    rpcUrl: 'http://' + window.location.hostname + ':8545',
  },
  1: {
    name: NetworkName.mainnet,
    color: '#ff8b9e',
    chainId: 1,
    rpcUrl: `https://mainnet.infura.io/v3/${infuraId}`,
    blockExplorer: 'https://etherscan.io/',
  },
  42: {
    name: NetworkName.kovan,
    color: '#7003DD',
    chainId: 42,
    rpcUrl: `https://kovan.infura.io/v3/${infuraId}`,
    blockExplorer: 'https://kovan.etherscan.io/',
    faucet: 'https://gitter.im/kovan-testnet/faucet', //https://faucet.kovan.network/
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
  5: {
    name: NetworkName.goerli,
    color: '#0975F6',
    chainId: 5,
    faucet: 'https://goerli-faucet.slock.it/',
    blockExplorer: 'https://goerli.etherscan.io/',
    rpcUrl: `https://goerli.infura.io/v3/${infuraId}`,
  },
  100: {
    name: NetworkName.xdai,
    color: '#48a9a6',
    chainId: 100,
    price: 1,
    gasPrice: 1000000000,
    rpcUrl: 'https://dai.poa.network',
    faucet: 'https://xdai-faucet.top/',
    blockExplorer: 'https://blockscout.com/poa/xdai/',
  },
  137: {
    name: NetworkName.matic,
    color: '#2bbdf7',
    chainId: 137,
    price: 1,
    gasPrice: 1000000000,
    rpcUrl: 'https://rpc-mainnet.maticvigil.com',
    faucet: 'https://faucet.matic.network/',
    blockExplorer: 'https://explorer-mainnet.maticvigil.com//',
  },
  80001: {
    name: NetworkName.mumbai,
    color: '#92D9FA',
    chainId: 80001,
    price: 1,
    gasPrice: 1000000000,
    rpcUrl: 'https://rpc-mumbai.maticvigil.com',
    faucet: 'https://faucet.matic.network/',
    blockExplorer: 'https://mumbai-explorer.matic.today/',
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
  NETWORKS_BY_NAME[process.env.REACT_APP_INFURA_NETWORK as NetworkName]
