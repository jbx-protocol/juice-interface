import { BigNumber } from '@ethersproject/bignumber'
import {
  parseBigNumberKeyVals,
  subgraphEntityJsonArrayToKeyVal,
} from 'utils/graph'

import { Json, primitives } from '../../json'
import {
  BaseProjectEntity,
  parseBaseProjectEntityJson,
} from '../base/base-project-entity'
import { Participant } from './participant'

export interface Wallet extends BaseProjectEntity {
  totalPaid: BigNumber
  totalPaidUSD: BigNumber
  lastPaidTimestamp: number
  participants: Participant[]
}

export const parseWalletJson = (j: Json<Wallet>): Wallet => ({
  ...primitives(j),
  ...parseBaseProjectEntityJson(j),
  ...parseBigNumberKeyVals(j, ['totalPaid', 'totalPaidUSD']),
  ...subgraphEntityJsonArrayToKeyVal(
    j.participants,
    'participant',
    'participants',
  ),
})
