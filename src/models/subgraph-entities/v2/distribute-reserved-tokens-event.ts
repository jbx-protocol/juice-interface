import { BigNumber } from '@ethersproject/bignumber'
import {
  parseBigNumberKeyVals,
  subgraphEntityJsonArrayToKeyVal,
} from 'utils/graph'

import { Json, primitives } from '../../json'
import { BaseEventEntity } from '../base/base-event-entity'
import {
  BaseProjectEntity,
  parseBaseProjectEntityJson,
} from '../base/base-project-entity'
import { DistributeToReservedTokenSplitEvent } from './distribute-to-reserved-token-split-event'

export interface DistributeReservedTokensEvent
  extends BaseEventEntity,
    BaseProjectEntity {
  fundingCycleNumber: number
  beneficiary: string
  tokenCount: BigNumber
  beneficiaryTokenCount: BigNumber
  memo: string
  splitDistributions: DistributeToReservedTokenSplitEvent[]
}

export const parseDistributeReservedTokensEventJson = (
  j: Json<DistributeReservedTokensEvent>,
): DistributeReservedTokensEvent => ({
  ...primitives(j),
  ...parseBaseProjectEntityJson(j),
  ...parseBigNumberKeyVals(j, ['tokenCount', 'beneficiaryTokenCount']),
  ...subgraphEntityJsonArrayToKeyVal(
    j.splitDistributions,
    'distributeToReservedTokenSplitEvent',
    'splitDistributions',
  ),
})
