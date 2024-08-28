import { DiffedItem } from 'components/DiffedItem'
import { JBSplit } from 'juice-sdk-core'

import { SplitProps } from 'packages/v4/components/SplitList/SplitItem'
import { SplitAmountValue } from 'packages/v4/components/SplitList/SplitItem/SplitAmountValue'
import { isFinitePayoutLimit, isInfinitePayoutLimit } from 'packages/v4/utils/fundingCycle'
import { splitAmountsAreEqual } from 'packages/v4/utils/v4Splits'

export function DiffedSplitValue({
  splitProps,
  diffSplit,
}: {
  splitProps: SplitProps
  diffSplit?: JBSplit & { totalValue?: bigint }
}) {
  const diffSplitProps: SplitProps | undefined = diffSplit
    ? {
        split: diffSplit,
        totalValue: diffSplit.totalValue,
        projectOwnerAddress: splitProps.projectOwnerAddress,
        currency: splitProps.currency,
      }
    : undefined

  const newValue = isInfinitePayoutLimit(splitProps?.totalValue) ? (
    <>{splitProps.split.percent.formatPercentage()}%</>
  ) : (
    <SplitAmountValue props={splitProps} hideTooltip />
  )

  if (!diffSplitProps) return newValue

  const oldValue =
    diffSplit && isInfinitePayoutLimit(diffSplit?.totalValue) ? (
      <>{diffSplit.percent.formatPercentage()}%</>
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
    isFinitePayoutLimit(splitProps.totalValue) &&
    isFinitePayoutLimit(diffSplitProps.totalValue)

  const percentsEqual =
    splitProps.split.percent === diffSplitProps.split.percent

  const valuesEqual = isFiniteTotalValue
    ? splitAmountsAreEqual({
        split1: splitProps.split,
        split2: diffSplitProps.split,
        split1TotalValue: splitProps.totalValue ?? 0n,
        split2TotalValue: diffSplitProps.totalValue ?? 0n,
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
