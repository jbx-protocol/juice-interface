import { NetworkName } from 'models/networkName'
import { getSubgraphIdForProject } from 'utils/graph'
import { readNetwork } from './networks'
import { PV_V2 } from './pv'

const PROJECT_IDS = {
  METAKEYS_COPYCAT: 564, // copycat of 563
  RS_COPYCAT: 676, // copycat of 618
}

// List of delisted projects
const V2_BLOCKLISTED_PROJECT_IDS_BY_NETWORK: Partial<
  Record<NetworkName, number[]>
> = {
  [NetworkName.mainnet]: [PROJECT_IDS.METAKEYS_COPYCAT, PROJECT_IDS.RS_COPYCAT],
}

export const V2_BLOCKLISTED_PROJECT_IDS =
  V2_BLOCKLISTED_PROJECT_IDS_BY_NETWORK[readNetwork.name] ?? []

export const V2_BLOCKLISTED_PROJECTS = V2_BLOCKLISTED_PROJECT_IDS.map(
  projectId => getSubgraphIdForProject(PV_V2, projectId),
)
