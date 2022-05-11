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

export interface PayEvent extends BaseProjectEntity, BaseEventEntity {
  fundingCycleId: BigNumber
  beneficiary: string
  amount: BigNumber
  note: string
}

export type PayEventJson = Partial<
  Record<keyof PayEvent, string> & BaseProjectEntityJson & BaseEventEntityJson
>

export const parsePayEventJson = (j: PayEventJson): Partial<PayEvent> => ({
  ...parseBaseProjectEntityJson(j),
  ...parseBaseEventEntityJson(j),
  fundingCycleId: j.fundingCycleId
    ? BigNumber.from(j.fundingCycleId)
    : undefined,
  beneficiary: j.beneficiary,
  amount: j.amount ? BigNumber.from(j.amount) : undefined,
  note: j.note,
})
