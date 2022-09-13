import { useVeNftUserTokens } from 'hooks/veNft/VeNftUserTokens'
import { fromWad } from 'utils/format/formatNumber'

export type VeNftSummaryStats = {
  totalLocked: number
  totalLockedPeriod: number
}

export function useVeNftSummaryStats() {
  const { data: userTokens } = useVeNftUserTokens()
  if (!userTokens) {
    return {
      totalLocked: 0,
      totalLockedPeriod: 0,
    }
  }

  const summaryStats: VeNftSummaryStats = {
    totalLocked: userTokens.reduce((acc, token) => {
      return acc + parseInt(fromWad(token.lockAmount))
    }, 0),
    totalLockedPeriod: userTokens.reduce((acc, token) => {
      return acc + token.lockDuration
    }, 0),
  }

  return summaryStats
}
