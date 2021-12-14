import { NetworkName } from 'models/network-name'

import { readNetwork } from 'constants/networks'

const archivedProjectIdsByNetwork: Partial<Record<NetworkName, number[]>> = {
  [NetworkName.mainnet]: [
    11, // @pxdao
    27, // @svspool002
    32, // @fidenza420
    180, // @inflationlessdao
  ],
  [NetworkName.rinkeby]: [],
}

export const archivedProjectIds =
  archivedProjectIdsByNetwork[readNetwork.name] ?? []
