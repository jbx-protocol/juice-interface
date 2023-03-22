import { BigNumber } from '@ethersproject/bignumber'
import { PV } from 'models/pv'
import { parseBigNumberKeyVals } from 'utils/graph'

import { Json, primitives } from '../../json'
import { BaseEventEntity } from '../base/base-event-entity'
import {
  BaseProjectEntity,
  parseBaseProjectEntityJson
} from '../base/base-project-entity'
import { TerminalEventEntity } from '../base/terminal-event'

export interface RedeemEvent
  extends BaseProjectEntity,
    BaseEventEntity,
    TerminalEventEntity {
  pv: PV
  holder: string
  beneficiary: string
  amount: BigNumber
  returnAmount: BigNumber
  returnAmountUSD: BigNumber
  from: string
  memo: string
  metadata: string | undefined
}

export const parseRedeemEventJson = (j: Json<RedeemEvent>): RedeemEvent => ({
  ...primitives(j),
  ...parseBaseProjectEntityJson(j),
  ...parseBigNumberKeyVals(j, ['amount', 'returnAmount', 'returnAmountUSD']),
})
