import { Trans } from '@lingui/macro'
import ETHAmount from 'components/currency/ETHAmount'
import USDAmount from 'components/currency/USDAmount'
import { FEATURE_FLAGS } from 'constants/featureFlags'
import useSubgraphQuery from 'hooks/SubgraphQuery'
import Link from 'next/link'
import { featureFlagEnabled } from 'utils/featureFlags'
import { formattedNum } from 'utils/format/formatNumber'

const Stat = ({
  value,
  label,
  loading,
}: {
  value: string | number | JSX.Element | undefined
  label: string | JSX.Element
  loading: boolean
}) => {
  const newLandingEnabled = featureFlagEnabled(FEATURE_FLAGS.NEW_LANDING_PAGE)

  const textColorClass = newLandingEnabled
    ? 'text-bluebs-500'
    : 'text-juice-400 dark:text-juice-300'

  return (
    <div className="my-0 mx-auto flex flex-col gap-4 text-center">
      <div
        className={`font-display text-4xl font-medium md:text-5xl ${textColorClass}`}
      >
        {loading ? '-' : value}
      </div>
      <div className="font-body text-base text-grey-900 dark:text-slate-100">
        {label}
      </div>
    </div>
  )
}

export function StatsSection() {
  const { data: protocolLogs, isLoading } = useSubgraphQuery({
    entity: 'protocolLog',
    keys: [
      'erc20Count',
      'paymentsCount',
      'projectsCount',
      'volumePaid',
      'volumePaidUSD',
    ],
  })

  const stats = protocolLogs?.[0]

  return (
    <section className="bg-smoke-50 dark:bg-slate-700">
      <div className="m-auto flex max-w-5xl flex-wrap justify-between gap-8 py-16 px-8 md:gap-4">
        <Stat
          value={formattedNum(stats?.projectsCount)}
          label={<Trans>Projects created</Trans>}
          loading={isLoading}
        />
        <Stat
          value={
            <Link href="/activity">
              <a className="text-current">
                <USDAmount
                  amount={stats?.volumePaidUSD}
                  precision={0}
                  symbol="$"
                  tooltipContent={
                    <ETHAmount amount={stats?.volumePaid} hideTooltip />
                  }
                  className="gradient-animation bg-gradient-to-r from-bluebs-500 via-grape-400 to-juice-500 bg-clip-text font-display transition-colors hover:text-transparent"
                />
              </a>
            </Link>
          }
          label={<Trans>Total raised</Trans>}
          loading={isLoading}
        />
        <Stat
          value={formattedNum(stats?.paymentsCount)}
          label={<Trans>Payments made</Trans>}
          loading={isLoading}
        />
      </div>
    </section>
  )
}
