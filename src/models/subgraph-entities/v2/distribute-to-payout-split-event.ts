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

export interface DistributeToPayoutSplitEvent
  extends BaseEventEntity,
    BaseProjectEntity,
    TerminalEventEntity {
  domain: BigNumber
  group: BigNumber
  amount: BigNumber
  amountUSD: BigNumber
  preferClaimed: boolean
  preferAddToBalance: boolean
  percent: number
  splitProjectId: number
  beneficiary: string
  lockedUntil: number
  allocator: string
  distributePayoutsEvent: string
}

export type DistributeToPayoutSplitEventJson = Partial<
  Record<keyof DistributeToPayoutSplitEvent, string> &
    BaseEventEntityJson &
    BaseProjectEntityJson
>

export const parseDistributeToPayoutSplitEventJson = (
  j: DistributeToPayoutSplitEventJson,
): Partial<DistributeToPayoutSplitEvent> => ({
  ...parseTerminalEventEntity(j),
  ...parseBaseEventEntityJson(j),
  ...parseBaseProjectEntityJson(j),
  domain: j.domain ? BigNumber.from(j.domain) : undefined,
  group: j.group ? BigNumber.from(j.group) : undefined,
  amount: j.amount ? BigNumber.from(j.amount) : undefined,
  amountUSD: j.amountUSD ? BigNumber.from(j.amountUSD) : undefined,
  preferClaimed: !!j.preferClaimed,
  preferAddToBalance: !!j.preferAddToBalance,
  percent: j.percent ? parseInt(j.percent) : undefined,
  splitProjectId: j.splitProjectId ? parseInt(j.splitProjectId) : undefined,
  beneficiary: j.beneficiary,
  lockedUntil: j.lockedUntil ? parseInt(j.lockedUntil) : undefined,
  allocator: j.allocator,
  distributePayoutsEvent: j.distributePayoutsEvent,
})
