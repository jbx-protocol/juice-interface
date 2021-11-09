import { NetworkName } from 'models/network-name'

export const archivedProjectIds: Partial<Record<NetworkName, number[]>> = {
  [NetworkName.mainnet]: [
    11, // @pxdao
    27, // @svspool002
    32, // @fidenza420
  ],
  [NetworkName.rinkeby]: [],
}
