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

export interface RedeemEvent
  extends BaseProjectEntity,
    BaseEventEntity,
    TerminalEventEntity {
  id: string
  holder: string
  beneficiary: string
  amount: BigNumber
  returnAmount: BigNumber
  caller: string
  metadata: string
}

export type RedeemEventJson = Partial<
  Record<keyof RedeemEvent, string> &
    BaseProjectEntityJson &
    BaseEventEntityJson
>

export const parseRedeemEventJson = (
  j: RedeemEventJson,
): Partial<RedeemEvent> => ({
  ...parseTerminalEventEntity(j),
  ...parseBaseEventEntityJson(j),
  ...parseBaseProjectEntityJson(j),
  id: j.id,
  holder: j.holder,
  beneficiary: j.beneficiary,
  amount: j.amount ? BigNumber.from(j.amount) : undefined,
  returnAmount: j.returnAmount ? BigNumber.from(j.returnAmount) : undefined,
  caller: j.caller,
  metadata: j.metadata,
})
