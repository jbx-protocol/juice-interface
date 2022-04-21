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

export interface DistributeReservedTokensEvent
  extends BaseEventEntity,
    BaseProjectEntity {
  fundingCycleNumber: number
  beneficiary: string
  tokenCount: BigNumber
  beneficiaryTokenCount: BigNumber
  memo: string
}

export type DistributeReservedTokensEventJson = Partial<
  Record<keyof DistributeReservedTokensEvent, string> &
    BaseEventEntityJson &
    BaseProjectEntityJson
>

export const parseDistributeReservedTokensEventJson = (
  j: DistributeReservedTokensEventJson,
): Partial<DistributeReservedTokensEvent> => ({
  ...parseBaseEventEntityJson(j),
  ...parseBaseProjectEntityJson(j),
  fundingCycleNumber: j.fundingCycleNumber
    ? parseInt(j.fundingCycleNumber)
    : undefined,
  beneficiary: j.beneficiary,
  tokenCount: j.tokenCount ? BigNumber.from(j.tokenCount) : undefined,
  beneficiaryTokenCount: j.beneficiaryTokenCount
    ? BigNumber.from(j.beneficiaryTokenCount)
    : undefined,
  memo: j.memo,
})
