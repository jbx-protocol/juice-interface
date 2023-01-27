import DiffedSplitList from 'components/v2v3/shared/DiffedSplits/DiffedSplitList'
import { V2V3ProjectContext } from 'contexts/v2v3/V2V3ProjectContext'
import { useContext } from 'react'
import { V2V3_CURRENCY_USD } from 'utils/v2v3/currency'
import { MAX_DISTRIBUTION_LIMIT } from 'utils/v2v3/math'
import PayoutSplitsCard, { PayoutSplitsCardProps } from '../PayoutSplitsCard'

export function DiffedPayoutSplitsCard({
  hideDistributeButton,
  payoutSplits,
  distributionLimitCurrency,
  distributionLimit,
  fundingCycleDuration,
}: PayoutSplitsCardProps) {
  const { projectOwnerAddress, payoutSplits: diffPayoutSplits } =
    useContext(V2V3ProjectContext)

  return (
    <PayoutSplitsCard
      hideDistributeButton={hideDistributeButton}
      payoutSplits={payoutSplits}
      distributionLimitCurrency={distributionLimitCurrency}
      distributionLimit={distributionLimit}
      fundingCycleDuration={fundingCycleDuration}
      value={
        payoutSplits ? (
          <DiffedSplitList
            splits={payoutSplits}
            diffSplits={diffPayoutSplits}
            currency={distributionLimitCurrency}
            totalValue={distributionLimit}
            projectOwnerAddress={projectOwnerAddress}
            showAmounts={!distributionLimit?.eq(MAX_DISTRIBUTION_LIMIT)}
            valueFormatProps={{
              precision: distributionLimitCurrency?.eq(V2V3_CURRENCY_USD)
                ? 2
                : 4,
            }}
            showDiffs
          />
        ) : undefined
      }
    />
  )
}
