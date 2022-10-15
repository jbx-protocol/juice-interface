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

export interface AddToBalanceEvent extends BaseProjectEntity, BaseEventEntity {
  fundingCycleId: BigNumber
  caller: string
  amount: BigNumber
  note?: string
}

export type AddToBalanceEventJson = Partial<
  Record<keyof AddToBalanceEvent, string> &
    BaseProjectEntityJson &
    BaseEventEntityJson
>

export const parseAddToBalanceEventJson = (
  j: AddToBalanceEventJson,
): Partial<AddToBalanceEvent> => ({
  ...parseBaseProjectEntityJson(j),
  ...parseBaseEventEntityJson(j),
  fundingCycleId: j.fundingCycleId
    ? BigNumber.from(j.fundingCycleId)
    : undefined,
  caller: j.caller,
  amount: j.amount ? BigNumber.from(j.amount) : undefined,
  note: j.note ? j.note : undefined,
})
