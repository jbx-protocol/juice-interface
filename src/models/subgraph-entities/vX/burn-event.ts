import { BigNumber } from '@ethersproject/bignumber'
import { PV } from 'models/pv'
import { parseBigNumberKeyVals } from 'utils/graph'

import { Json, primitives } from '../../json'
import { BaseEventEntity } from '../base/base-event-entity'
import {
  BaseProjectEntity,
  parseBaseProjectEntityJson,
} from '../base/base-project-entity'

export interface BurnEvent extends BaseProjectEntity, BaseEventEntity {
  pv: PV
  holder: string
  amount: BigNumber
  stakedAmount: BigNumber
  unstakedAmount: BigNumber
}

export const parseBurnEventJson = (j: Json<BurnEvent>): BurnEvent => ({
  ...primitives(j),
  ...parseBaseProjectEntityJson(j),
  ...parseBigNumberKeyVals(j, ['amount', 'stakedAmount', 'unstakedAmount']),
})
