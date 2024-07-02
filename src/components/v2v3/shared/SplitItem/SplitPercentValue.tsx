import { formatSplitPercent } from 'utils/v2v3/math'

export function SplitPercentValue({ percent }: { percent: number }) {
  const formattedPercent = formatSplitPercent(BigInt(percent))

  return <span>{formattedPercent}%</span>
}
