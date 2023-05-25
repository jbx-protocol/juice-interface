import { Trans } from '@lingui/macro'
import StatLine from 'components/Project/StatLine'
import TooltipLabel from 'components/TooltipLabel'
import { DISTRIBUTION_LIMIT_EXPLANATION } from 'components/strings'
import V2V3CurrencyAmount from 'components/v2v3/shared/V2V3CurrencyAmount'
import { V2V3ProjectContext } from 'contexts/v2v3/Project/V2V3ProjectContext'
import { useContext } from 'react'
import { isInfiniteDistributionLimit } from 'utils/v2v3/fundingCycle'

export default function DistributedRatio() {
  const {
    distributionLimit,
    usedDistributionLimit,
    distributionLimitCurrency,
    loading: { distributionLimitLoading },
  } = useContext(V2V3ProjectContext)

  return (
    <StatLine
      loading={distributionLimitLoading}
      statLabel={<Trans>Payouts</Trans>}
      statLabelTip={DISTRIBUTION_LIMIT_EXPLANATION}
      statValue={
        distributionLimit?.gt(0) ? (
          <div className="text-sm font-medium uppercase text-black dark:text-slate-100">
            <V2V3CurrencyAmount
              amount={usedDistributionLimit}
              currency={distributionLimitCurrency}
            />{' '}
            <>
              /{' '}
              {isInfiniteDistributionLimit(distributionLimit) ? (
                <Trans>NO LIMIT</Trans>
              ) : (
                <V2V3CurrencyAmount
                  amount={distributionLimit}
                  currency={distributionLimitCurrency}
                />
              )}
            </>
          </div>
        ) : (
          <div className="text-right text-sm font-medium uppercase text-grey-400 dark:text-slate-200">
            <TooltipLabel
              tip={
                <Trans>
                  No payouts are scheduled for this cycle. All ETH is available
                  for redemption (subject to the redemption rate).
                </Trans>
              }
              label={<Trans>No payouts</Trans>}
            />
          </div>
        )
      }
    />
  )
}
