import { NetworkName } from 'models/network-name'
import { ProjectType } from 'models/project-type'

import { readNetwork } from 'constants/networks'
import { V1_PROJECT_IDS } from './projectIds'

const { SHARK_DAO, SVSPOOL002, DEFI_DAO, CONSTITUTION_DAO } = V1_PROJECT_IDS

const PROJECT_TYPES_BY_NETWORK: Partial<
  Record<NetworkName, Record<number, ProjectType>>
> = {
  [NetworkName.mainnet]: {
    [SHARK_DAO]: 'bidpool',
    [SVSPOOL002]: 'bidpool',
    [DEFI_DAO]: 'bidpool',
    [CONSTITUTION_DAO]: 'bidpool',
  },
}

export const PROJECT_TYPES = PROJECT_TYPES_BY_NETWORK[readNetwork.name] ?? {}
