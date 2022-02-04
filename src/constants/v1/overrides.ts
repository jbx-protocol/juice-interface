import { NetworkName } from 'models/network-name'

import { V1_PROJECT_IDS } from './projectIds'

// IDs of projects with pay disabled
export const disablePayOverrides: Partial<Record<NetworkName, Set<number>>> = {
  [NetworkName.mainnet]: new Set([
    V1_PROJECT_IDS.PONZI_DAO,
    V1_PROJECT_IDS.CONSTITUTION_DAO,
  ]),
}
