import { BigNumber } from '@ethersproject/bignumber'
import {
  parseBigNumberKeyVals,
  subgraphEntityJsonArrayToKeyVal,
} from 'utils/graph'

import { Json, primitives } from '../../json'
import { Participant } from './participant'

export interface Wallet {
  id: string
  totalPaid: BigNumber
  totalPaidUSD: BigNumber
  lastPaidTimestamp: number
  participants: Participant[]
}

export const parseWalletJson = (j: Json<Wallet>): Wallet => ({
  ...primitives(j),
  ...parseBigNumberKeyVals(j, ['totalPaid', 'totalPaidUSD']),
  ...subgraphEntityJsonArrayToKeyVal(
    j.participants,
    'participant',
    'participants',
  ),
})
