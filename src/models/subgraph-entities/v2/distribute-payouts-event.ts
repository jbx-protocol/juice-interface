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

export interface DistributePayoutsEvent
  extends BaseEventEntity,
    BaseProjectEntity {
  fundingCycleConfiguration: BigNumber
  fundingCycleNumber: number
  beneficiary: string
  amount: BigNumber
  distributedAmount: BigNumber
  fee: BigNumber
  beneficiaryDistributionAmount: BigNumber
  memo: string
}

export type DistributePayoutsEventJson = Partial<
  Record<keyof DistributePayoutsEvent, string> &
    BaseEventEntityJson &
    BaseProjectEntityJson
>

export const parseDistributePayoutsEventJson = (
  j: DistributePayoutsEventJson,
): Partial<DistributePayoutsEvent> => ({
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
  distributedAmount: j.distributedAmount
    ? BigNumber.from(j.distributedAmount)
    : undefined,
  beneficiaryDistributionAmount: j.distributedAmount
    ? BigNumber.from(j.distributedAmount)
    : undefined,
  fee: j.fee ? BigNumber.from(j.fee) : undefined,
  memo: j.memo,
})
