import { readNetwork } from 'constants/networks'
import { NetworkName } from 'models/network-name'
import { ProjectType } from 'models/project-type'

const projectTypesByNetwork: Partial<Record<
  NetworkName,
  Record<number, ProjectType>
>> = {
  [NetworkName.mainnet]: {
    7: 'bidpool', // @sharkdao
    28: 'bidpool', // @svs002
    31: 'bidpool', // @defidao
  },
  [NetworkName.rinkeby]: {
    12: 'bidpool', // @rinkebydao
  },
}

export const projectTypes = projectTypesByNetwork[readNetwork.name] ?? {}
