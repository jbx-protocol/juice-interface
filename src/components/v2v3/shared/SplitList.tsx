import { BigNumber } from '@ethersproject/bignumber'
import { Space } from 'antd'
import { Split } from 'models/splits'
import { useMemo } from 'react'
import {
  getProjectOwnerRemainderSplit,
  processUniqueSplits,
} from 'utils/splits'
import { SplitItem, SplitProps } from './SplitItem'

export default function SplitList({
  splits,
  oldSplits,
  showFees = false,
  currency,
  totalValue,
  projectOwnerAddress, //X
  valueSuffix,
  valueFormatProps,
  reservedRate,
  showDiffs,
}: {
  splits: Split[]
  oldSplits?: Split[]
  currency?: BigNumber
  totalValue: BigNumber | undefined
  projectOwnerAddress: string | undefined
  showFees?: boolean
  valueSuffix?: string | JSX.Element
  valueFormatProps?: { precision?: number }
  reservedRate?: number
  showDiffs?: boolean
}) {
  const ownerSplit = useMemo(() => {
    if (!projectOwnerAddress) return
    return getProjectOwnerRemainderSplit(projectOwnerAddress, splits)
  }, [projectOwnerAddress, splits])

  const oldOwnerSplit = useMemo(() => {
    if (!oldSplits || !projectOwnerAddress) return
    return getProjectOwnerRemainderSplit(projectOwnerAddress, oldSplits)
  }, [projectOwnerAddress, oldSplits])

  const uniqueSplits = processUniqueSplits({
    oldSplits: showDiffs ? oldSplits : undefined,
    newSplits: splits,
  })

  const splitProps: Omit<SplitProps, 'split'> = {
    currency,
    totalValue,
    projectOwnerAddress,
    valueSuffix,
    valueFormatProps,
    reservedRate,
    showFees,
  }

  return (
    <Space direction="vertical" size={5} className="w-full">
      {[...uniqueSplits].map(split => {
        return (
          <SplitItem
            split={split}
            {...splitProps}
            key={`${split.beneficiary}-${split.projectId}-${split.percent}`}
          />
        )
      })}
      {ownerSplit?.percent ? (
        <SplitItem
          split={{
            ...ownerSplit,
            oldSplit: oldOwnerSplit,
          }}
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
