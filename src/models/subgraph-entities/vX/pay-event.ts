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

export interface PayEvent
  extends BaseProjectEntity,
    BaseEventEntity,
    TerminalEventEntity {
  fundingCycleId: BigNumber
  beneficiary: string
  amount: BigNumber
  note: string
  feeFromV2Project?: number
}

export type PayEventJson = Partial<
  Record<keyof PayEvent, string> & BaseProjectEntityJson & BaseEventEntityJson
>

export const parsePayEventJson = (j: PayEventJson): Partial<PayEvent> => ({
  ...parseTerminalEventEntity(j),
  ...parseBaseProjectEntityJson(j),
  ...parseBaseEventEntityJson(j),
  fundingCycleId: j.fundingCycleId
    ? BigNumber.from(j.fundingCycleId)
    : undefined,
  beneficiary: j.beneficiary,
  amount: j.amount ? BigNumber.from(j.amount) : undefined,
  note: j.note,
  feeFromV2Project: j.feeFromV2Project
    ? parseInt(j.feeFromV2Project)
    : undefined,
})
