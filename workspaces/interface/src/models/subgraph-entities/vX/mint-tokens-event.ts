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

export interface MintTokensEvent extends BaseEventEntity, BaseProjectEntity {
  beneficiary: string
  amount: BigNumber
  memo: string
}

export type MintTokensEventJson = Partial<
  Record<keyof MintTokensEvent, string> &
    BaseEventEntityJson &
    BaseProjectEntityJson
>

export const parseMintTokensEventJson = (
  j: MintTokensEventJson,
): Partial<MintTokensEvent> => ({
  ...parseBaseEventEntityJson(j),
  ...parseBaseProjectEntityJson(j),
  beneficiary: j.beneficiary,
  amount: j.amount ? BigNumber.from(j.amount) : undefined,
  memo: j.memo,
})
