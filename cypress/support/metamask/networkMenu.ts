export type NetworkMenuType = 'ethereum' | 'ropsten' | 'kovan' | 'rinkeby' | 'goerli'

export const NetworkMenu: Record<NetworkMenuType, {name: string, index: number}> = {
  ethereum: {
    name: 'Ethereum Mainnet',
    index: 3
  },
  ropsten: {
    name: 'Ropsten Test Network',
    index: 4
  },
  kovan: {
    name: 'Kovan Test Network',
    index: 5
  },
  rinkeby: {
    name: 'Rinkeby Test Network',
    index: 6
  },
  goerli: {
    name: 'Goerli Test Network',
    index: 7
  }
}