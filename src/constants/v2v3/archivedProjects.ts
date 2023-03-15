import { NetworkName } from 'models/networkName'

import { readNetwork } from 'constants/networks'
import { V2V3_PROJECT_IDS } from './projectIds'

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
  PROJECT_445,
} = V2V3_PROJECT_IDS

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
    PROJECT_445,
  ],
  [NetworkName.goerli]: [],
}

export const V2ArchivedProjectIds =
  V2ArchivedProjectIdsByNetwork[readNetwork.name] ?? []
