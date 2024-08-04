import { SplitPortion } from 'juice-sdk-core'

export function SplitPercentValue({ percent }: { percent: SplitPortion }) {
  const formattedPercent = percent.formatPercentage()

  return <span>{formattedPercent}%</span>
}
