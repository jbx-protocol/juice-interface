import { BigNumber } from 'ethers'
import { Split } from 'models/splits'
import { useMemo } from 'react'
import {
  getProjectOwnerRemainderSplit,
  processUniqueSplits,
} from 'utils/splits'
import { SplitProps } from '../SplitItem'
import { DiffedSplitItem } from './DiffedSplitItem'

type DiffedSplitListProps = {
  splits: Split[]
  diffSplits?: Split[]
  currency?: BigNumber
  totalValue: BigNumber | undefined
  previousTotalValue?: BigNumber
  projectOwnerAddress: string | undefined
  showAmounts?: boolean
  showFees?: boolean
  valueSuffix?: string | JSX.Element
  valueFormatProps?: { precision?: number }
  reservedRate?: number
  showDiffs?: boolean
}

export default function DiffedSplitList({
  splits,
  diffSplits,
  showAmounts = false,
  showFees = false,
  currency,
  totalValue,
  previousTotalValue,
  projectOwnerAddress,
  valueSuffix,
  valueFormatProps,
  reservedRate,
  showDiffs,
}: DiffedSplitListProps) {
  const ownerSplit = useMemo(() => {
    if (!projectOwnerAddress) return
    return getProjectOwnerRemainderSplit(projectOwnerAddress, splits)
  }, [projectOwnerAddress, splits])

  const diffOwnerSplit = useMemo(() => {
    if (!diffSplits || !projectOwnerAddress || !showDiffs) return
    return getProjectOwnerRemainderSplit(projectOwnerAddress, diffSplits)
  }, [projectOwnerAddress, diffSplits, showDiffs])

  const uniqueSplits = processUniqueSplits({
    oldTotalValue: previousTotalValue,
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
    showAmount: showAmounts,
  }

  return (
    <div className="flex flex-col gap-1">
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
              oldSplit: diffOwnerSplit,
            },
            ...splitProps,
          }}
        />
      ) : null}
    </div>
  )
}
