import { BigNumber } from 'ethers'
import { PV } from 'models/pv'
import {
  parseBigNumberKeyVals,
  parseSubgraphEntitiesFromJson,
} from 'utils/graph'

import { Json, primitives } from '../../json'
import {
  BaseProjectEntity,
  parseBaseProjectEntityJson,
} from '../base/base-project-entity'
import { Wallet } from './wallet'

export interface Participant extends BaseProjectEntity {
  pv: PV
  wallet: Wallet
  volume: BigNumber
  volumeUSD: BigNumber
  balance: BigNumber
  stakedBalance: BigNumber
  erc20Balance: BigNumber
  lastPaidTimestamp: number
}

export const parseParticipantJson = (j: Json<Participant>): Participant => ({
  ...primitives(j),
  ...parseBaseProjectEntityJson(j),
  ...parseSubgraphEntitiesFromJson(j, ['wallet']),
  ...parseBigNumberKeyVals(j, [
    'volume',
    'volumeUSD',
    'balance',
    'stakedBalance',
    'erc20Balance',
  ]),
})
