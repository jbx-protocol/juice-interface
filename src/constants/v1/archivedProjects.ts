import { NetworkName } from 'models/network-name'

import { readNetwork } from 'constants/networks'
import { V1_PROJECT_IDS } from './projectIds'

const {
  PX_DAO,
  SVSPOOL002,
  FIDENZA420,
  MICHAEL_JACKSON,
  SANTA_DAO,
  INFLATIONLESS_DAO,
  VOTING_DAO,
  LUNAR_DAO,
  BLUECOLLARDS,
  CITYMONK,
  JUS_DAO,
  DEMU,
} = V1_PROJECT_IDS

const V1ArchivedProjectIdsByNetwork: Partial<Record<NetworkName, number[]>> = {
  [NetworkName.mainnet]: [
    PX_DAO,
    SVSPOOL002,
    FIDENZA420,
    MICHAEL_JACKSON,
    SANTA_DAO,
    INFLATIONLESS_DAO,
    VOTING_DAO,
    LUNAR_DAO,
    BLUECOLLARDS,
    CITYMONK,
    JUS_DAO,
    DEMU,
  ],
  [NetworkName.goerli]: [],
}

export const V1ArchivedProjectIds =
  V1ArchivedProjectIdsByNetwork[readNetwork.name] ?? []
