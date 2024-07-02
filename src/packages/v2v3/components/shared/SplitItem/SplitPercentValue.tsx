import { formatSplitPercent } from 'packages/v2v3/utils/math'

export function SplitPercentValue({ percent }: { percent: number }) {
  const formattedPercent = formatSplitPercent(BigInt(percent))

  return <span>{formattedPercent}%</span>
}
