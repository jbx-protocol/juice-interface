import { subgraphEntityJsonToKeyVal } from 'utils/graph'

import { Json } from '../../json'
import { Participant } from '../vX/participant'

// TODO incomplete type, add the rest of the fields.
export interface JB721DelegateToken {
  tokenId: string
  address: string
  tokenUri: string
  owner: Participant
}

export const parseJB721DelegateTokenJson = (
  j: Json<JB721DelegateToken>,
): JB721DelegateToken => ({
  ...j,
  ...subgraphEntityJsonToKeyVal(j.owner, 'participant', 'owner'),
})
