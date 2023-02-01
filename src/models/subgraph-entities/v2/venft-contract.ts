import { VeNftToken } from 'models/subgraph-entities/v2/venft-token'
import { subgraphEntityJsonArrayToKeyVal } from 'utils/graph'

import { Json, primitives } from '../../json'

export interface VeNftContract {
  address: string
  symbol: string
  uriResolver: string
  project: string
  projectId: number
  tokens: VeNftToken[]
}

export const parseVeNftContractJson = (
  j: Json<VeNftContract>,
): VeNftContract => ({
  ...primitives(j),
  ...subgraphEntityJsonArrayToKeyVal(j.tokens, 'veNftToken', 'tokens'),
})
