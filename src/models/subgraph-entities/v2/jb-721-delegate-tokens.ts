import { BigNumber } from '@ethersproject/bignumber'
import { JB721GovernanceType } from 'models/nftRewards'
import {
  parseBigNumberKeyVals,
  parseSubgraphEntitiesFromJson,
  subgraphEntityJsonToKeyVal,
} from 'utils/graph'

import { Json } from '../../json'
import { Participant } from '../vX/participant'
import { Project } from '../vX/project'

export interface JB721DelegateToken {
  id: string
  tokenId: string
  address: string
  tokenUri: string
  owner: Participant
  governanceType: JB721GovernanceType

  project: Project
  projectId: number
  name: string
  symbol: string

  floorPrice: BigNumber | null
  lockedUntil: BigNumber | null
}

export const parseJB721DelegateTokenJson = (
  j: Json<JB721DelegateToken>,
): JB721DelegateToken => ({
  ...j,
  ...subgraphEntityJsonToKeyVal(j.owner, 'participant', 'owner'),
  ...parseSubgraphEntitiesFromJson(j, ['project']),
  ...parseBigNumberKeyVals(j, ['floorPrice', 'lockedUntil']),
})
