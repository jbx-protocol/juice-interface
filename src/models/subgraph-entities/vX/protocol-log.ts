import { BigNumber } from '@ethersproject/bignumber'
import { parseBigNumberKeyVals, subgraphEntityJsonToKeyVal } from 'utils/graph'

import { Json } from '../../json'

export type ProtocolLog = {
  id: '1' // Only one entity exists
  projectsCount: number
  volumePaid: BigNumber
  volumePaidUSD: BigNumber
  volumeRedeemed: BigNumber
  volumeRedeemedUSD: BigNumber
  paymentsCount: number
  redeemCount: number
  erc20Count: number
  trendingLastUpdatedTimestamp: number
  oldestTrendingPayEvent: string

  v1?: Omit<ProtocolLog, 'v1' | 'v2'>
  v2?: Omit<ProtocolLog, 'v1' | 'v2'>
}

export const parseProtocolLogJson = (j: Json<ProtocolLog>): ProtocolLog => ({
  ...j,
  id: '1',
  ...parseBigNumberKeyVals(j, [
    'volumePaid',
    'volumeRedeemed',
    'volumePaidUSD',
    'volumeRedeemedUSD',
  ]),
  ...subgraphEntityJsonToKeyVal(j.v1, 'protocolLog', 'v1'),
  ...subgraphEntityJsonToKeyVal(j.v2, 'protocolLog', 'v2'),
})
