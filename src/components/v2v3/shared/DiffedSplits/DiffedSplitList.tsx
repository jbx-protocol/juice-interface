import { useProjectContext } from 'components/ProjectDashboard/hooks'
import { BigNumber } from 'ethers'
import { Split } from 'models/splits'
import { useMemo } from 'react'
import {
  getProjectOwnerRemainderSplit,
  processUniqueSplits,
} from 'utils/splits'
import { formatSplitPercent } from 'utils/v2v3/math'
import { SplitProps } from '../SplitItem'
import { DiffedSplitItem } from './DiffedSplitItem'

type DiffedSplitListProps = {
  splits: Split[]
  diffSplits?: Split[]
  currency?: BigNumber
  oldCurrency?: BigNumber
  totalValue: BigNumber | undefined
  oldTotalValue?: BigNumber
  previousTotalValue?: BigNumber
  showFees?: boolean
  valueSuffix?: string | JSX.Element
  valueFormatProps?: { precision?: number }
  reservedRate?: number
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
  reservedRate,
  showDiffs,
}: DiffedSplitListProps) {
  const { projectOwnerAddress } = useProjectContext()
  const ownerSplit = useMemo(() => {
    if (!projectOwnerAddress) return
    return getProjectOwnerRemainderSplit(projectOwnerAddress, splits)
  }, [projectOwnerAddress, splits])

  const diffOwnerSplit = useMemo(() => {
    if (!diffSplits || !projectOwnerAddress || !showDiffs) return
    return getProjectOwnerRemainderSplit(projectOwnerAddress, diffSplits)
  }, [projectOwnerAddress, diffSplits, showDiffs])

  const ownerSplitIsRemoved =
    !ownerSplit?.percent && diffOwnerSplit?.percent === 0
  const diffOwnerSplitHasPercent =
    diffOwnerSplit &&
    parseFloat(formatSplitPercent(BigNumber.from(diffOwnerSplit.percent))) >=
      0.01
  const ownerSplitIsNew = ownerSplit?.percent && !diffOwnerSplitHasPercent

  const currencyHasDiff = Boolean(
    oldCurrency && currency && !oldCurrency.eq(currency),
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
    totalValue,
    projectOwnerAddress,
    valueSuffix,
    valueFormatProps,
    reservedRate,
    showFee: showFees,
  }
  return (
    <div className="flex flex-col gap-1.5">
      {uniqueSplits.map(split => {
        return (
          <DiffedSplitItem
            props={{
              split,
              ...splitProps,
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
