import { BigNumber } from '@ethersproject/bignumber'
import { formatSplitPercent } from 'utils/v2v3/math'

export function SplitPercentValue({ percent }: { percent: number }) {
  const formattedPercent = formatSplitPercent(BigNumber.from(percent))

  return <span>{formattedPercent}%</span>
}
