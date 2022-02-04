import { NetworkName } from 'models/network-name'
import { ProjectType } from 'models/project-type'

import { readNetwork } from 'constants/networks'
import { V1_PROJECT_IDS } from './projectIds'

const { SHARK_DAO, SVSPOOL002, DEFI_DAO, CONSTITUTION_DAO } = V1_PROJECT_IDS

const projectTypesByNetwork: Partial<
  Record<NetworkName, Record<number, ProjectType>>
> = {
  [NetworkName.mainnet]: {
    [SHARK_DAO]: 'bidpool',
    [SVSPOOL002]: 'bidpool',
    [DEFI_DAO]: 'bidpool',
    [CONSTITUTION_DAO]: 'bidpool',
  },
  [NetworkName.rinkeby]: {
    12: 'bidpool',
  },
}

export const projectTypes = projectTypesByNetwork[readNetwork.name] ?? {}
