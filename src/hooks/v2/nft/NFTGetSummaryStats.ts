import { VeNftToken } from 'models/v2/stakingNFT'

export type VeNftSummaryStats = {
  totalStaked: number
  totalStakedPeriod: number
}

export function useNFTGetSummaryStats(userTokens: VeNftToken[]) {
  const summaryStats: VeNftSummaryStats = {
    totalStaked: userTokens.reduce((acc, token) => {
      return acc + token.lockInfo.amount.toNumber()
    }, 0),
    totalStakedPeriod: userTokens.reduce((acc, token) => {
      return acc + token.lockInfo.duration
    }, 0),
  }

  return summaryStats
}
