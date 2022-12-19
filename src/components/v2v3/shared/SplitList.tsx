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
  diffSplits,
  showAmounts = false,
  showFees = false,
  currency,
  totalValue,
  projectOwnerAddress,
  valueSuffix,
  valueFormatProps,
  reservedRate,
  showDiffs,
}: {
  splits: Split[]
  diffSplits?: Split[]
  currency?: BigNumber
  totalValue: BigNumber | undefined
  projectOwnerAddress: string | undefined
  showAmounts?: boolean
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

  const diffOwnerSplit = useMemo(() => {
    if (!diffSplits || !projectOwnerAddress || !showDiffs) return
    return getProjectOwnerRemainderSplit(projectOwnerAddress, diffSplits)
  }, [projectOwnerAddress, diffSplits, showDiffs])

  const uniqueSplits = processUniqueSplits({
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
    showFees,
    showAmount: showAmounts,
  }

  return (
    <Space direction="vertical" size={5} className="w-full">
      {[...uniqueSplits].map(split => {
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
            split: {
              ...ownerSplit,
              oldSplit: diffOwnerSplit,
            },
            ...splitProps,
          }}
        />
      ) : null}
    </Space>
  )
}
