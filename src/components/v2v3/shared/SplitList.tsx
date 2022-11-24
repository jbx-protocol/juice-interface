import { BigNumber } from '@ethersproject/bignumber'
import { Space } from 'antd'
import { Split } from 'models/splits'
import { useMemo } from 'react'
import { getProjectOwnerRemainderSplit } from 'utils/splits'
import { SplitItem } from './SplitItem'

export default function SplitList({
  splits,
  showSplitValues = false,
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
  showSplitValues?: boolean
  showFees?: boolean
  valueSuffix?: string | JSX.Element
  valueFormatProps?: { precision?: number }
  reservedRate?: number
}) {
  const ownerSplit = useMemo(() => {
    if (!projectOwnerAddress) return
    return getProjectOwnerRemainderSplit(projectOwnerAddress, splits)
  }, [projectOwnerAddress, splits])

  return (
    <Space direction="vertical" size={5} style={{ width: '100%' }}>
      {[...splits]
        .sort((a, b) => (a.percent < b.percent ? 1 : -1))
        .map(split => (
          <SplitItem
            split={split}
            showSplitValue={showSplitValues}
            currency={currency}
            totalValue={totalValue}
            projectOwnerAddress={projectOwnerAddress}
            valueSuffix={valueSuffix}
            valueFormatProps={valueFormatProps}
            reservedRate={reservedRate}
            showFees={showFees}
            key={`${split.beneficiary}-${split.projectId}-${split.percent}`}
          />
        ))}
      {ownerSplit?.percent ? (
        <SplitItem
          split={ownerSplit}
          showSplitValue={showSplitValues}
          currency={currency}
          totalValue={totalValue}
          projectOwnerAddress={projectOwnerAddress}
          valueSuffix={valueSuffix}
          valueFormatProps={valueFormatProps}
          reservedRate={reservedRate}
          showFees={showFees}
        />
      ) : null}
    </Space>
  )
}
