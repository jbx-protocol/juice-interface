import { BigNumber } from '@ethersproject/bignumber'
import {
  parseBigNumberKeyVals,
  subgraphEntityJsonArrayToKeyVal,
} from 'utils/graph'

import { Json, primitives } from '../../json'
import { Participant } from './participant'

export interface Wallet {
  id: string
  volume: BigNumber
  volumeUSD: BigNumber
  lastPaidTimestamp: number
  participants: Participant[]
}

export const parseWalletJson = (j: Json<Wallet>): Wallet => ({
  ...primitives(j),
  ...parseBigNumberKeyVals(j, ['volume', 'volumeUSD']),
  ...subgraphEntityJsonArrayToKeyVal(
    j.participants,
    'participant',
    'participants',
  ),
})
