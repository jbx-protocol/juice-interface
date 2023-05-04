import { BigNumber } from 'ethers'
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
import { TerminalEventEntity } from '../base/terminal-event'
import { DistributeToPayoutSplitEvent } from './distribute-to-payout-split-event'

export interface DistributePayoutsEvent
  extends BaseEventEntity,
    BaseProjectEntity,
    TerminalEventEntity {
  fundingCycleConfiguration: BigNumber
  fundingCycleNumber: number
  beneficiary: string
  amount: BigNumber
  amountUSD: BigNumber
  distributedAmount: BigNumber
  distributedAmountUSD: BigNumber
  fee: BigNumber
  feeUSD: BigNumber
  beneficiaryDistributionAmount: BigNumber
  beneficiaryDistributionAmountUSD: BigNumber
  memo: string
  splitDistributions: DistributeToPayoutSplitEvent[]
}

export const parseDistributePayoutsEventJson = (
  j: Json<DistributePayoutsEvent>,
): DistributePayoutsEvent => ({
  ...primitives(j),
  ...parseBaseProjectEntityJson(j),
  ...parseBigNumberKeyVals(j, [
    'fundingCycleConfiguration',
    'amount',
    'amountUSD',
    'distributedAmount',
    'distributedAmountUSD',
    'beneficiaryDistributionAmount',
    'beneficiaryDistributionAmountUSD',
    'fee',
    'feeUSD',
  ]),
  ...subgraphEntityJsonArrayToKeyVal(
    j.splitDistributions,
    'distributeToPayoutSplitEvent',
    'splitDistributions',
  ),
})
