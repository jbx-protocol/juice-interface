import { Trans } from '@lingui/macro'
import StatLine from 'components/Project/StatLine'
import TooltipLabel from 'components/TooltipLabel'
import { V2V3ProjectContext } from 'contexts/v2v3/V2V3ProjectContext'
import { useContext } from 'react'
import V2V3CurrencyAmount from 'components/v2v3/shared/V2V3CurrencyAmount'
import { MAX_DISTRIBUTION_LIMIT } from 'utils/v2v3/math'

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
      statLabel={<Trans>Distributed</Trans>}
      statLabelTip={
        <Trans>
          The amount distributed from the Juicebox balance in this funding
          cycle, out of the current distribution limit. No more than the
          distribution limit can be distributed in a single funding cycle. Any
          remaining ETH in Juicebox is overflow until the next cycle begins.
        </Trans>
      }
      statValue={
        distributionLimit?.gt(0) ? (
          <div className="text-sm font-medium uppercase text-black dark:text-slate-100">
            <V2V3CurrencyAmount
              amount={usedDistributionLimit}
              currency={distributionLimitCurrency}
            />{' '}
            <>
              /{' '}
              {distributionLimit.eq(MAX_DISTRIBUTION_LIMIT) ? (
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
                  The distribution limit for this funding cycle is 0, meaning
                  all funds in Juicebox are currently considered overflow.
                  Overflow can be redeemed by token holders, but not
                  distributed.
                </Trans>
              }
              label={<Trans>100% overflow</Trans>}
            />
          </div>
        )
      }
    />
  )
}
