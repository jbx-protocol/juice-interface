import { NetworkName } from 'models/network-name'

import { readNetwork } from 'constants/networks'
import { V1_PROJECT_IDS } from './projectIds'

const {
  PX_DAO,
  SVSPOOL002,
  FIDENZA420,
  SANTA_DAO,
  INFLATIONLESS_DAO,
  VOTING_DAO,
} = V1_PROJECT_IDS

const archivedProjectIdsByNetwork: Partial<Record<NetworkName, number[]>> = {
  [NetworkName.mainnet]: [
    PX_DAO,
    SVSPOOL002,
    FIDENZA420,
    SANTA_DAO,
    INFLATIONLESS_DAO,
    VOTING_DAO,
  ],
  [NetworkName.rinkeby]: [],
}

export const archivedProjectIds =
  archivedProjectIdsByNetwork[readNetwork.name] ?? []
