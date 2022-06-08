export type VeNftSummaryStats = {
  totalStaked: number
  totalStakedPeriod: number
}

export function useNFTGetSummaryStats() {
  const summaryStats: VeNftSummaryStats = {
    totalStaked: 1100,
    totalStakedPeriod: 86400 * 2,
  }

  return summaryStats
}
