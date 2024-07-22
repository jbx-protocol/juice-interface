import { sortSplits, v4GetProjectOwnerRemainderSplit } from "packages/v4/utils/v4Splits"
import { useMemo } from "react"
import { Hash } from "viem"
import { V4Split } from "../../models/v4Split"
import { SplitItem, SplitProps } from "./SplitItem"

export type SplitListProps = {
  splits: V4Split[]
  currency?: bigint
  totalValue: bigint | undefined
  projectOwnerAddress: string | undefined
  showAmounts?: boolean
  showFees?: boolean
  valueSuffix?: string | JSX.Element
  valueFormatProps?: { precision?: number }
  reservedRate?: number
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
  reservedRate,
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
    reservedRate,
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
      {ownerSplit?.percent ? (
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
