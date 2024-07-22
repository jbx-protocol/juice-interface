import { SplitPortion } from 'juice-sdk-core'

export function SplitPercentValue({ percent }: { percent: bigint }) {
  const formattedPercent = new SplitPortion(percent).formatPercentage()

  return <span>{formattedPercent}%</span>
}
