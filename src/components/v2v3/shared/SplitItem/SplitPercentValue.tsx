import { BigNumber } from '@ethersproject/bignumber'
import { DiffedItem } from 'components/v2v3/V2V3Project/V2V3FundingCycleSection/FundingCycleDetails/DiffedItem'
import { formatSplitPercent } from 'utils/v2v3/math'

export function SplitPercentValue({
  percent,
  oldPercent,
}: {
  percent: number
  oldPercent?: number
}) {
  const formattedPercent = formatSplitPercent(BigNumber.from(percent))
  const _percent = <>{formattedPercent}%</>
  if (!oldPercent || oldPercent === percent) return _percent

  const formattedOldPercent = formatSplitPercent(BigNumber.from(oldPercent))
  const _oldPercent = <>{formattedOldPercent}%</>

  return (
    <div className="flex">
      <DiffedItem value={_oldPercent} diffStatus="old" />
      <DiffedItem value={_percent} diffStatus="new" />
    </div>
  )
}
