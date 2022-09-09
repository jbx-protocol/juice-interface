import { BigNumber } from '@ethersproject/bignumber'
import { Split } from 'models/v2/splits'
import { useMemo } from 'react'
import { getProjectOwnerRemainderSplit } from 'utils/v2/splits'

import SplitItem from './SplitItem'

export default function SplitList({
  splits,
  showSplitValues = false,
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
  valueSuffix?: string | JSX.Element
  valueFormatProps?: { precision?: number }
  reservedRate?: number
}) {
  const ownerSplit = useMemo(() => {
    if (!projectOwnerAddress) return
    return getProjectOwnerRemainderSplit(projectOwnerAddress, splits)
  }, [projectOwnerAddress, splits])

  return (
    <div>
      {[...splits]
        .sort((a, b) => (a.percent < b.percent ? 1 : -1))
        .map(split => (
          <div
            key={`${split.beneficiary}-${split.percent}`}
            style={{ marginBottom: 5 }}
          >
            <SplitItem
              split={split}
              showSplitValue={showSplitValues}
              currency={currency}
              totalValue={totalValue}
              projectOwnerAddress={projectOwnerAddress}
              valueSuffix={valueSuffix}
              valueFormatProps={valueFormatProps}
              reservedRate={reservedRate}
            />
          </div>
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
        />
      ) : null}
    </div>
  )
}
