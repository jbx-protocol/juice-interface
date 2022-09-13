import { NetworkName } from 'models/network-name'

import { readNetwork } from 'constants/networks'
import { V2_PROJECT_IDS } from './projectIds'

const {
  SUSTAIN_DAO_A,
  SUSTAIN_DAO_B,
  JUS_DAO,
  ELONS_GAMES,
  INVESTORS_EDGE_DAO,
  DANGER_ZONE_DAO,
  FALLEN_DAO,
  WEB3_COOL_KIDS,
  SCHIZO_DAO,
} = V2_PROJECT_IDS

const V2ArchivedProjectIdsByNetwork: Partial<Record<NetworkName, number[]>> = {
  [NetworkName.mainnet]: [
    SUSTAIN_DAO_A,
    SUSTAIN_DAO_B,
    JUS_DAO,
    ELONS_GAMES,
    INVESTORS_EDGE_DAO,
    DANGER_ZONE_DAO,
    FALLEN_DAO,
    WEB3_COOL_KIDS,
    SCHIZO_DAO,
  ],
  [NetworkName.rinkeby]: [
    83, // AngelDAO
    63, // CauseFund.coin
  ],
}

export const V2ArchivedProjectIds =
  V2ArchivedProjectIdsByNetwork[readNetwork.name] ?? []
