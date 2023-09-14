import { NetworkName } from 'models/networkName'
import { readNetwork } from './networks'

const PROJECT_IDS = {
  METAKEYS_COPYCAT: 564, // copycat of 563
}

// List of delisted projects
const V2_BLOCKLISTED_PROJECT_IDS_BY_NETWORK: Partial<
  Record<NetworkName, number[]>
> = {
  [NetworkName.mainnet]: [PROJECT_IDS.METAKEYS_COPYCAT],
}

export const V2_BLOCKLISTED_PROJECT_IDS =
  V2_BLOCKLISTED_PROJECT_IDS_BY_NETWORK[readNetwork.name] ?? []
