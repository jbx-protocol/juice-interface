import { BigNumber } from 'ethers'
import { Split } from 'models/splits'
import { isInfiniteDistributionLimit } from 'utils/v2v3/fundingCycle'
import { formatSplitPercent } from 'utils/v2v3/math'
import { DiffedItem } from '../../DiffedItem'
import { SplitProps } from '../../SplitItem'
import { SplitAmountValue } from '../../SplitItem/SplitAmountValue'

export function DiffedSplitValue({
  splitProps,
  diffSplit,
}: {
  splitProps: SplitProps
  diffSplit?: Split
}) {
  const diffSplitProps: SplitProps | undefined = diffSplit
    ? {
        split: diffSplit,
        totalValue: diffSplit.totalValue,
        projectOwnerAddress: splitProps.projectOwnerAddress,
        currency: splitProps.currency,
      }
    : undefined

  // const limitHasBecomeInfinite = isFiniteDistributionLimit(diffSplit?.totalValue) && isInfiniteDistributionLimit(splitProps.totalValue)
  // const limitHasBecomeFinite = isInfiniteDistributionLimit(diffSplit?.totalValue) && isFiniteDistributionLimit(splitProps.totalValue)
  const newValue = isInfiniteDistributionLimit(splitProps?.totalValue) ? (
    <>{formatSplitPercent(BigNumber.from(splitProps.split.percent))}%</>
  ) : (
    <SplitAmountValue props={splitProps} />
  )

  if (!diffSplitProps) return newValue

  const oldValue =
    diffSplit && isInfiniteDistributionLimit(diffSplit?.totalValue) ? (
      <>{formatSplitPercent(BigNumber.from(diffSplit.percent))}%</>
    ) : (
      <SplitAmountValue props={diffSplitProps} />
    )

  return (
    <div className="flex">
      <DiffedItem value={oldValue} diffStatus="old" />
      <DiffedItem value={newValue} diffStatus="new" />
    </div>
  )
}
