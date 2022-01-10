import { NetworkName } from 'models/network-name'

export const indexedProjectERC20s: Partial<Record<NetworkName, number[]>> = {
  [NetworkName.mainnet]: [1, 2, 7, 8],
  [NetworkName.rinkeby]: [1, 4, 12, 20],
}
