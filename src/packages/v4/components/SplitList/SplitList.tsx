import { JBSplit } from 'juice-sdk-core'
import {
  sortSplits,
  v4GetProjectOwnerRemainderSplit,
} from 'packages/v4/utils/v4Splits'
import { useMemo } from 'react'
import { Hash } from 'viem'
import { SplitItem, SplitProps } from './SplitItem'
export type SplitListProps = {
  splits: JBSplit[]
  currency?: bigint
  totalValue: bigint | undefined
  projectOwnerAddress: string | undefined
  showAmounts?: boolean
  showFees?: boolean
  valueSuffix?: string | JSX.Element
  valueFormatProps?: { precision?: number }
  reservedPercent?: number
  dontApplyFeeToAmounts?: boolean
}

export default function SplitList({
  splits,
  showAmounts = false,
  showFees = false,
  currency,
  totalValue,
  projectOwnerAddress,
  valueSuffix,
  valueFormatProps,
  reservedPercent,
  dontApplyFeeToAmounts,
}: SplitListProps) {
  const ownerSplit = useMemo(() => {
    if (!projectOwnerAddress) return
    return v4GetProjectOwnerRemainderSplit(projectOwnerAddress as Hash, splits)
  }, [projectOwnerAddress, splits])

  const splitProps: Omit<SplitProps, 'split'> = {
    currency,
    totalValue,
    projectOwnerAddress,
    valueSuffix,
    valueFormatProps,
    reservedPercent,
    showFee: showFees,
    showAmount: showAmounts,
    dontApplyFeeToAmount: dontApplyFeeToAmounts,
  }

  return (
    <div className="flex flex-col gap-3">
      {sortSplits(splits).map(split => {
        return (
          <SplitItem
            props={{
              split,
              ...splitProps,
            }}
            key={`${split.beneficiary}-${split.projectId}-${split.percent}`}
          />
        )
      })}
      {ownerSplit && ownerSplit.percent.toFloat() > 0 ? (
        <SplitItem
          props={{
            split: { ...ownerSplit },
            ...splitProps,
          }}
        />
      ) : null}
    </div>
  )
}
