import { processUniqueSplits, v4GetProjectOwnerRemainderSplit } from 'packages/v4v5/utils/v4Splits'

import { DiffedSplitItem } from './DiffedSplitItem'
import { JBSplit as Split } from 'juice-sdk-core'
import { SplitProps } from 'packages/v4v5/components/SplitList/SplitItem'
import round from 'lodash/round'
import { useMemo } from 'react'
import useV4V5ProjectOwnerOf from 'packages/v4v5/hooks/useV4V5ProjectOwnerOf'

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
  const { data: projectOwnerAddress } = useV4V5ProjectOwnerOf()
  const ownerSplit = useMemo(() => {
    if (!projectOwnerAddress) return
    return v4GetProjectOwnerRemainderSplit(projectOwnerAddress as `0x${string}`, splits)
  }, [projectOwnerAddress, splits])

  const diffOwnerSplit = useMemo(() => {
    if (!diffSplits || !projectOwnerAddress || !showDiffs) return
    return v4GetProjectOwnerRemainderSplit(projectOwnerAddress as `0x${string}`, diffSplits)
  }, [projectOwnerAddress, diffSplits, showDiffs])

  const ownerSplitIsRemoved =
    !ownerSplit?.percent && diffOwnerSplit?.percent.value === 0n

  const roundedDiffOwnerSplitPercent = round((diffOwnerSplit?.percent.formatPercentage() || 0),
    JB_PERCENT_PRECISION,
  )
  const diffOwnerSplitHasPercent =
    diffOwnerSplit && roundedDiffOwnerSplitPercent !== 0

  const ownerSplitPercent = ownerSplit?.percent.value
  const ownerSplitIsNew = ownerSplitPercent && ownerSplitPercent > 0 && !diffOwnerSplitHasPercent
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
      {ownerSplit?.percent.value ? (
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
