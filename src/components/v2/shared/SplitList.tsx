import { BigNumber } from '@ethersproject/bignumber'
import { Split } from 'models/v2/splits'
import { SPLITS_TOTAL_PERCENT } from 'utils/v2/math'

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
  const totalSplitPercentage =
    splits?.reduce((sum, split) => sum + split.percent, 0) ?? 0
  const ownerPercentage = SPLITS_TOTAL_PERCENT - totalSplitPercentage

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
      {ownerPercentage && reservedRate ? (
        <SplitItem
          split={{
            beneficiary: projectOwnerAddress,
            percent: ownerPercentage,
            preferClaimed: undefined,
            lockedUntil: undefined,
            projectId: undefined,
            allocator: undefined,
          }}
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
