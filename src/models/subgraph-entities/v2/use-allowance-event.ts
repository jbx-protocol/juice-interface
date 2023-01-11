import { BigNumber } from '@ethersproject/bignumber'

import {
  BaseProjectEntityJson,
  parseBaseProjectEntityJson,
} from '../base/base-project-entity'

import {
  BaseEventEntity,
  BaseEventEntityJson,
  parseBaseEventEntityJson,
} from '../base/base-event-entity'
import { BaseProjectEntity } from '../base/base-project-entity'

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

export type UseAllowanceEventJson = Partial<
  Record<keyof UseAllowanceEvent, string> &
    BaseEventEntityJson &
    BaseProjectEntityJson
>

export const parseUseAllowanceEventJson = (
  j: UseAllowanceEventJson,
): Partial<UseAllowanceEvent> => ({
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
  netDistributedamount: j.netDistributedamount
    ? BigNumber.from(j.netDistributedamount)
    : undefined,
  netDistributedamountUSD: j.netDistributedamountUSD
    ? BigNumber.from(j.netDistributedamountUSD)
    : undefined,
  memo: j.memo,
})
