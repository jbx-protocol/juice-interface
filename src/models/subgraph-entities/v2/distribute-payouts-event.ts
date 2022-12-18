import { BigNumber } from '@ethersproject/bignumber'

import {
  BaseEventEntity,
  BaseEventEntityJson,
  parseBaseEventEntityJson,
} from '../base/base-event-entity'
import {
  BaseProjectEntity,
  BaseProjectEntityJson,
  parseBaseProjectEntityJson,
} from '../base/base-project-entity'
import {
  parseTerminalEventEntity,
  TerminalEventEntity,
} from '../base/terminal-event'
import {
  DistributeToPayoutSplitEvent,
  DistributeToPayoutSplitEventJson,
  parseDistributeToPayoutSplitEventJson,
} from './distribute-to-payout-split-event'

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
  splitDistributions: Partial<DistributeToPayoutSplitEvent>[]
}

export type DistributePayoutsEventJson = Partial<
  Record<keyof Omit<DistributePayoutsEvent, 'splitDistributions'>, string> &
    BaseEventEntityJson &
    BaseProjectEntityJson
> & {
  splitDistributions: DistributeToPayoutSplitEventJson[]
}

export const parseDistributePayoutsEventJson = (
  j: DistributePayoutsEventJson,
): Partial<DistributePayoutsEvent> => ({
  ...parseTerminalEventEntity(j),
  ...parseBaseEventEntityJson(j),
  ...parseBaseProjectEntityJson(j),
  fundingCycleConfiguration: j.fundingCycleConfiguration
    ? BigNumber.from(j.fundingCycleConfiguration)
    : undefined,
  fundingCycleNumber: j.fundingCycleNumber
    ? parseInt(j.fundingCycleNumber)
    : undefined,
  beneficiary: j.beneficiary,
  amount: j.amount ? BigNumber.from(j.amount) : undefined,
  amountUSD: j.amountUSD ? BigNumber.from(j.amountUSD) : undefined,
  distributedAmount: j.distributedAmount
    ? BigNumber.from(j.distributedAmount)
    : undefined,
  distributedAmountUSD: j.distributedAmountUSD
    ? BigNumber.from(j.distributedAmountUSD)
    : undefined,
  beneficiaryDistributionAmount: j.beneficiaryDistributionAmount
    ? BigNumber.from(j.beneficiaryDistributionAmount)
    : undefined,
  beneficiaryDistributionAmountUSD: j.beneficiaryDistributionAmountUSD
    ? BigNumber.from(j.beneficiaryDistributionAmountUSD)
    : undefined,
  fee: j.fee ? BigNumber.from(j.fee) : undefined,
  feeUSD: j.feeUSD ? BigNumber.from(j.feeUSD) : undefined,
  memo: j.memo,
  splitDistributions: j.splitDistributions
    ? j.splitDistributions.map(parseDistributeToPayoutSplitEventJson)
    : undefined,
})
