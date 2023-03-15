import { BigNumber } from '@ethersproject/bignumber'
import { PV } from 'models/pv'
import { parseBigNumberKeyVals } from 'utils/graph'

import { Json, primitives } from '../../json'
import {
  BaseProjectEntity,
  parseBaseProjectEntityJson,
} from '../base/base-project-entity'

export interface Participant extends BaseProjectEntity {
  pv: PV
  wallet: string
  totalPaid: BigNumber
  totalPaidUSD: BigNumber
  balance: BigNumber
  stakedBalance: BigNumber
  unstakedBalance: BigNumber
  lastPaidTimestamp: number
}

export const parseParticipantJson = (j: Json<Participant>): Participant => ({
  ...primitives(j),
  ...parseBaseProjectEntityJson(j),
  ...parseBigNumberKeyVals(j, [
    'totalPaid',
    'totalPaidUSD',
    'balance',
    'stakedBalance',
    'unstakedBalance',
  ]),
})
