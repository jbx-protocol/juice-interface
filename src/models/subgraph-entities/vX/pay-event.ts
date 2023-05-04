import { BigNumber } from 'ethers'
import { PV } from 'models/pv'
import { parseBigNumberKeyVals } from 'utils/graph'

import { Json, primitives } from '../../json'
import { BaseEventEntity } from '../base/base-event-entity'
import {
  BaseProjectEntity,
  parseBaseProjectEntityJson,
} from '../base/base-project-entity'
import { TerminalEventEntity } from '../base/terminal-event'

export interface PayEvent
  extends BaseProjectEntity,
    BaseEventEntity,
    TerminalEventEntity {
  pv: PV
  fundingCycleId: BigNumber
  beneficiary: string
  amount: BigNumber
  amountUSD: BigNumber
  note: string
  feeFromV2Project?: number
}

export const parsePayEventJson = (j: Json<PayEvent>): PayEvent => ({
  ...primitives(j),
  ...parseBaseProjectEntityJson(j),
  ...parseBigNumberKeyVals(j, ['fundingCycleId', 'amount', 'amountUSD']),
})
