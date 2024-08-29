import { DiffedItem } from 'components/DiffedItem'
import { BigNumber } from 'ethers'
import { Split } from 'packages/v2v3/models/splits'
import {
  isFiniteDistributionLimit,
  isInfiniteDistributionLimit,
} from 'packages/v2v3/utils/fundingCycle'
import { formatSplitPercent } from 'packages/v2v3/utils/math'
import { splitAmountsAreEqual } from 'packages/v2v3/utils/v2v3Splits'
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

  const percentsEqual =
    splitProps.split.percent === diffSplitProps.split.percent

  const valuesEqual = isFiniteTotalValue
    ? splitAmountsAreEqual({
        split1: splitProps.split,
        split2: diffSplitProps.split,
        split1TotalValue: splitProps.totalValue,
        split2TotalValue: diffSplitProps.totalValue,
      })
    : percentsEqual

  if (valuesEqual) return <div className="mr-4">{newValue}</div>

  return (
    <div className="flex">
      <DiffedItem value={oldValue} diffStatus="old" />
      <DiffedItem value={newValue} diffStatus="new" />
    </div>
  )
}
