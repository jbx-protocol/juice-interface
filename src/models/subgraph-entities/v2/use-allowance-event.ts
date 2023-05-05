import { BigNumber } from 'ethers'
import { parseBigNumberKeyVals } from 'utils/graph'

import { Json, primitives } from '../../json'
import { BaseEventEntity } from '../base/base-event-entity'
import {
  BaseProjectEntity,
  parseBaseProjectEntityJson,
} from '../base/base-project-entity'

export interface UseAllowanceEvent extends BaseEventEntity, BaseProjectEntity {
  fundingCycleConfiguration: BigNumber
  fundingCycleNumber: number
  beneficiary: string
  amount: BigNumber
  amountUSD: BigNumber
  distributedAmount: BigNumber
  distributedAmountUSD: BigNumber
  netDistributedamount: BigNumber
  netDistributedamountUSD: BigNumber
  memo: string
}

export const parseUseAllowanceEventJson = (
  j: Json<UseAllowanceEvent>,
): UseAllowanceEvent => ({
  ...primitives(j),
  ...parseBaseProjectEntityJson(j),
  ...parseBigNumberKeyVals(j, [
    'fundingCycleConfiguration',
    'amount',
    'amountUSD',
    'distributedAmount',
    'distributedAmountUSD',
    'netDistributedamount',
    'netDistributedamountUSD',
  ]),
})
