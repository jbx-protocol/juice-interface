import { SplitPortion } from '@bananapus/nana-sdk-core'

export function SplitPercentValue({ percent }: { percent: SplitPortion }) {
  const formattedPercent = percent.formatPercentage()

  return <span>{formattedPercent}%</span>
}
