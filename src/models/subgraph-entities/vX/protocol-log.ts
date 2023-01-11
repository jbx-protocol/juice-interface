import { BigNumber } from '@ethersproject/bignumber'

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

  v1: Partial<Omit<ProtocolLog, 'v1' | 'v2'>>
  v2: Partial<Omit<ProtocolLog, 'v1' | 'v2'>>
}

export type ProtocolLogJson = Omit<
  ProtocolLog,
  | 'volumePaid'
  | 'volumeRedeemed'
  | 'volumePaidUSD'
  | 'volumeRedeemedUSD'
  | 'v1'
  | 'v2'
> & {
  volumePaid: string
  volumeRedeemed: string
  volumePaidUSD: string
  volumeRedeemedUSD: string
  v1: Partial<Omit<ProtocolLogJson, 'v1' | 'v2'>>
  v2: Partial<Omit<ProtocolLogJson, 'v1' | 'v2'>>
}

export const parseProtocolLogJson = (
  json: Partial<ProtocolLogJson>,
): Partial<ProtocolLog> => ({
  ...json,
  volumePaid: json.volumePaid ? BigNumber.from(json.volumePaid) : undefined,
  volumePaidUSD: json.volumePaidUSD
    ? BigNumber.from(json.volumePaidUSD)
    : undefined,
  volumeRedeemed: json.volumeRedeemed
    ? BigNumber.from(json.volumeRedeemed)
    : undefined,
  volumeRedeemedUSD: json.volumeRedeemedUSD
    ? BigNumber.from(json.volumeRedeemedUSD)
    : undefined,
  v1: json.v1 ? parseProtocolLogJson(json.v1) : undefined,
  v2: json.v2 ? parseProtocolLogJson(json.v2) : undefined,
})
