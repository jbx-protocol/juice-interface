import { BigNumber } from '@ethersproject/bignumber'
import { Split } from 'models/v2/splits'

import SplitItem from './SplitItem'

export default function SplitList({
  splits,
  showSplitValues = false,
  distributionLimitCurrency,
  distributionLimit,
  projectOwnerAddress,
}: {
  splits: Split[]
  distributionLimitCurrency: BigNumber | undefined
  distributionLimit: BigNumber | undefined
  projectOwnerAddress: string | undefined
  showSplitValues?: boolean
}) {
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
              showValue={showSplitValues}
              distributionLimitCurrency={distributionLimitCurrency}
              distributionLimit={distributionLimit}
              projectOwnerAddress={projectOwnerAddress}
            />
          </div>
        ))}
    </div>
  )
}
