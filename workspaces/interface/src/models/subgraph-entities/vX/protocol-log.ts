import { BigNumber } from '@ethersproject/bignumber'

export type ProtocolLog = {
  id: '1' // Only one entity exists
  projectsCount: number
  volumePaid: BigNumber
  volumeRedeemed: BigNumber
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
  'volumePaid' | 'volumeRedeemed' | 'v1' | 'v2'
> & {
  volumePaid: string
  volumeRedeemed: string
  v1: Partial<Omit<ProtocolLogJson, 'v1' | 'v2'>>
  v2: Partial<Omit<ProtocolLogJson, 'v1' | 'v2'>>
}

export const parseProtocolLogJson = (
  json: Partial<ProtocolLogJson>,
): Partial<ProtocolLog> => ({
  ...json,
  volumePaid: json.volumePaid ? BigNumber.from(json.volumePaid) : undefined,
  volumeRedeemed: json.volumeRedeemed
    ? BigNumber.from(json.volumeRedeemed)
    : undefined,
  v1: json.v1 ? parseProtocolLogJson(json.v1) : undefined,
  v2: json.v2 ? parseProtocolLogJson(json.v2) : undefined,
})
