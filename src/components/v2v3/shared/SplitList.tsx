import { BigNumber } from '@ethersproject/bignumber'
import { Space } from 'antd'
import { Split } from 'models/splits'
import { useMemo } from 'react'
import { getProjectOwnerRemainderSplit, sortSplits } from 'utils/splits'
import { SplitItem, SplitProps } from './SplitItem'

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
}: {
  splits: Split[]
  currency?: BigNumber
  totalValue: BigNumber | undefined
  projectOwnerAddress: string | undefined
  showAmounts?: boolean
  showFees?: boolean
  valueSuffix?: string | JSX.Element
  valueFormatProps?: { precision?: number }
  reservedRate?: number
}) {
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
    showFees,
    showAmount: showAmounts,
  }

  return (
    <Space direction="vertical" size={5} className="w-full">
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
    </Space>
  )
}
