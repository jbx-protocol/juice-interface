import { processUniqueSplits, v4GetProjectOwnerRemainderSplit } from 'packages/v4/utils/v4Splits'

import { JBSplit as Split } from 'juice-sdk-core'
import round from 'lodash/round'
import { SplitProps } from 'packages/v4/components/SplitList/SplitItem'
import useV4ProjectOwnerOf from 'packages/v4/hooks/useV4ProjectOwnerOf'
import { useMemo } from 'react'
import { DiffedSplitItem } from './DiffedSplitItem'

const JB_PERCENT_PRECISION = 2

type DiffedSplitListProps = {
  splits: Split[]
  diffSplits?: Split[]
  currency?: bigint
  oldCurrency?: bigint
  totalValue: bigint | undefined
  oldTotalValue?: bigint
  previousTotalValue?: bigint
  showFees?: boolean
  valueSuffix?: string | JSX.Element
  valueFormatProps?: { precision?: number }
  reservedPercent?: number
  showDiffs?: boolean
}

export default function DiffedSplitList({
  splits,
  diffSplits,
  showFees = false,
  currency,
  oldCurrency,
  totalValue,
  previousTotalValue,
  valueSuffix,
  valueFormatProps,
  reservedPercent,
  showDiffs,
}: DiffedSplitListProps) {
  const { data: projectOwnerAddress } = useV4ProjectOwnerOf()
  const ownerSplit = useMemo(() => {
    if (!projectOwnerAddress) return
    return v4GetProjectOwnerRemainderSplit(projectOwnerAddress, splits)
  }, [projectOwnerAddress, splits])

  const diffOwnerSplit = useMemo(() => {
    if (!diffSplits || !projectOwnerAddress || !showDiffs) return
    return v4GetProjectOwnerRemainderSplit(projectOwnerAddress, diffSplits)
  }, [projectOwnerAddress, diffSplits, showDiffs])

  const ownerSplitIsRemoved =
    !ownerSplit?.percent && diffOwnerSplit?.percent.value === 0n

  const roundedDiffOwnerSplitPercent = round((diffOwnerSplit?.percent.formatPercentage() || 0),
    JB_PERCENT_PRECISION,
  )
  const diffOwnerSplitHasPercent =
    diffOwnerSplit && roundedDiffOwnerSplitPercent !== 0

  const ownerSplitIsNew = ownerSplit?.percent && !diffOwnerSplitHasPercent

  const currencyHasDiff = Boolean(
    oldCurrency && currency && (oldCurrency !== currency),
  )
  const uniqueSplits = processUniqueSplits({
    oldTotalValue: previousTotalValue,
    newTotalValue: totalValue,
    allSplitsChanged: currencyHasDiff,
    oldSplits: showDiffs ? diffSplits : undefined,
    newSplits: splits,
  })

  const splitProps: Omit<SplitProps, 'split'> = {
    currency,
    oldCurrency,
    totalValue,
    projectOwnerAddress,
    valueSuffix,
    valueFormatProps,
    reservedPercent,
    showFee: showFees,
  }
  return (
    <div className="flex flex-col gap-1.5">
      {uniqueSplits.map(split => {
        const splitIsRemoved = split.oldSplit === true
        return (
          <DiffedSplitItem
            props={{
              split,
              ...splitProps,
              totalValue: splitIsRemoved ? previousTotalValue : totalValue,
            }}
            key={`${split.beneficiary}-${split.projectId}-${split.percent}`}
          />
        )
      })}
      {ownerSplit?.percent ? (
        <DiffedSplitItem
          props={{
            split: {
              ...ownerSplit,
              oldSplit: ownerSplitIsRemoved
                ? true
                : ownerSplitIsNew
                ? false
                : diffOwnerSplit,
            },
            ...splitProps,
          }}
        />
      ) : null}
    </div>
  )
}
