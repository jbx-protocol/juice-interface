import { BigNumber } from '@ethersproject/bignumber'
import { PV } from 'models/pv'
import { parseBigNumberKeyVals } from 'utils/graph'

import { Json, primitives } from '../../json'
import { BaseEventEntity } from '../base/base-event-entity'
import {
  BaseProjectEntity,
  parseBaseProjectEntityJson,
} from '../base/base-project-entity'
import { TerminalEventEntity } from '../base/terminal-event'

export interface AddToBalanceEvent
  extends BaseProjectEntity,
    BaseEventEntity,
    TerminalEventEntity {
  pv: PV
  fundingCycleId: BigNumber
  amount: BigNumber
  amountUSD: BigNumber
  note: string
}

export const parseAddToBalanceEventJson = (
  j: Json<AddToBalanceEvent>,
): AddToBalanceEvent => ({
  ...primitives(j),
  ...parseBaseProjectEntityJson(j),
  ...parseBigNumberKeyVals(j, ['fundingCycleId', 'amount', 'amountUSD']),
})
