import { BigNumber } from 'ethers'
import { useMemo } from 'react'

export function useProjectTrendingPercentageIncrease({
  totalVolume,
  trendingVolume,
}: {
  totalVolume: BigNumber
  trendingVolume: BigNumber
}): number {
  const percentageGain = useMemo(() => {
    const preTrendingVolume = totalVolume?.sub(trendingVolume)

    if (!preTrendingVolume?.gt(0)) return Infinity

    const percentGain = trendingVolume
      .mul(10000)
      .div(preTrendingVolume)
      .toNumber()

    let percentRounded: number

    // If percentGain > 1, round to int
    if (percentGain >= 100) {
      percentRounded = Math.round(percentGain / 100)
      // If 0.1 <= percentGain < 1, round to 1dp
    } else if (percentGain >= 10) {
      percentRounded = Math.round(percentGain / 10) / 10
      // If percentGain < 0.1, round to 2dp
    } else {
      percentRounded = percentGain / 100
    }

    return percentRounded
  }, [totalVolume, trendingVolume])

  return percentageGain
}
