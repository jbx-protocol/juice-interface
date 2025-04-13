import { BigNumber } from '@ethersproject/bignumber'
import { formatSplitPercent } from 'packages/v2v3/utils/math'

export function SplitPercentValue({ percent }: { percent: number }) {
  const formattedPercent = formatSplitPercent(BigNumber.from(percent))

  return <span>{formattedPercent}%</span>
}
