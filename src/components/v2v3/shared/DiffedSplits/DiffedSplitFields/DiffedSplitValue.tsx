import { BigNumber } from 'ethers'
import { Split } from 'models/splits'
import { splitAmountsAreEqual } from 'utils/splits'
import {
  isFiniteDistributionLimit,
  isInfiniteDistributionLimit,
} from 'utils/v2v3/fundingCycle'
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

  const newValue = isInfiniteDistributionLimit(splitProps?.totalValue) ? (
    <>{formatSplitPercent(BigNumber.from(splitProps.split.percent))}%</>
  ) : (
    <SplitAmountValue props={splitProps} hideTooltip />
  )

  if (!diffSplitProps) return newValue

  const oldValue =
    diffSplit && isInfiniteDistributionLimit(diffSplit?.totalValue) ? (
      <>{formatSplitPercent(BigNumber.from(diffSplit.percent))}%</>
    ) : (
      <SplitAmountValue
        props={{
          ...diffSplitProps,
          currency: splitProps.oldCurrency,
        }}
        hideTooltip
      />
    )

  const isFiniteTotalValue =
    isFiniteDistributionLimit(splitProps.totalValue) &&
    isFiniteDistributionLimit(diffSplitProps.totalValue)

  const amountsAreEqual = isFiniteTotalValue
    ? splitAmountsAreEqual({
        split1: splitProps.split,
        split2: diffSplitProps.split,
        split1TotalValue: splitProps.totalValue,
        split2TotalValue: diffSplitProps.totalValue,
      })
    : false

  if (amountsAreEqual) return newValue

  return (
    <div className="flex">
      <DiffedItem value={oldValue} diffStatus="old" />
      <DiffedItem value={newValue} diffStatus="new" />
    </div>
  )
}
