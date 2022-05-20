import { NetworkName } from 'models/network-name'

import { readNetwork } from 'constants/networks'
import { V2_PROJECT_IDS } from './projectIds'

const { SUSTAIN_DAO_A, SUSTAIN_DAO_B } = V2_PROJECT_IDS

const V2ArchivedProjectIdsByNetwork: Partial<Record<NetworkName, number[]>> = {
  [NetworkName.mainnet]: [SUSTAIN_DAO_A, SUSTAIN_DAO_B],
  [NetworkName.rinkeby]: [],
}

export const V2ArchivedProjectIds =
  V2ArchivedProjectIdsByNetwork[readNetwork.name] ?? []
