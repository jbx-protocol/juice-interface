import { BigNumber } from '@ethersproject/bignumber'
import { DiffedItem } from 'components/v2v3/shared/DiffedItem'
import { formatSplitPercent } from 'utils/v2v3/math'

export function DiffedSplitPercent({
  percent,
  oldPercent,
}: {
  percent: number
  oldPercent?: number
}) {
  const formattedPercent = formatSplitPercent(BigNumber.from(percent))
  const formattedOldPercent = oldPercent
    ? formatSplitPercent(BigNumber.from(oldPercent))
    : '0'
  const _percent = <span>{formattedPercent}%</span>
  if (!oldPercent || formattedPercent === formattedOldPercent) return _percent

  const _oldPercent = <span>{formattedOldPercent}%</span>

  return (
    <div className="flex">
      <DiffedItem value={_oldPercent} diffStatus="old" />
      <DiffedItem value={_percent} diffStatus="new" />
    </div>
  )
}
