import { readNetwork } from 'constants/networks'
import { NetworkName } from 'models/network-name'

const V3ArchivedProjectIdsByNetwork: Partial<Record<NetworkName, number[]>> = {
  [NetworkName.mainnet]: [],
  [NetworkName.rinkeby]: [],
}

export const V3ArchivedProjectIds =
  V3ArchivedProjectIdsByNetwork[readNetwork.name] ?? []
