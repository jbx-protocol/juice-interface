import { VeNftToken } from 'models/subgraph-entities/v2/venft-token'
import { fromWad } from 'utils/formatNumber'

export type VeNftSummaryStats = {
  totalStaked: number
  totalStakedPeriod: number
}

export function useVeNftSummaryStats(userTokens: VeNftToken[] | undefined) {
  if (!userTokens) {
    return {
      totalStaked: 0,
      totalStakedPeriod: 0,
    }
  }

  const summaryStats: VeNftSummaryStats = {
    totalStaked: userTokens.reduce((acc, token) => {
      return acc + parseInt(fromWad(token.lockAmount))
    }, 0),
    totalStakedPeriod: userTokens.reduce((acc, token) => {
      return acc + token.lockDuration
    }, 0),
  }

  return summaryStats
}
