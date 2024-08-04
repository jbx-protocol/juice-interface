import { BigNumber } from 'ethers'
import { Split } from 'packages/v2v3/models/splits'
import { getProjectOwnerRemainderSplit, sortSplits } from 'packages/v2v3/utils/v2v3Splits'
import { useMemo } from 'react'
import { SplitItem, SplitProps } from './SplitItem'

export type V2V3SplitListProps = {
  splits: Split[]
  currency?: BigNumber
  totalValue: BigNumber | undefined
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
}: V2V3SplitListProps) {
  const ownerSplit = useMemo(() => {
    if (!projectOwnerAddress) return
    return getProjectOwnerRemainderSplit(projectOwnerAddress, splits)
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
