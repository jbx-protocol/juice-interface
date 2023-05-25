import { Trans } from '@lingui/macro'
import ETHAmount from 'components/currency/ETHAmount'
import USDAmount from 'components/currency/USDAmount'
import { useProtocolLogQuery } from 'generated/graphql'
import { client } from 'lib/apollo/client'
import Link from 'next/link'
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
  return (
    <div className="my-0 mx-auto flex flex-col gap-4 text-center">
      <div className="font-display text-4xl font-medium text-bluebs-500 md:text-5xl">
        {loading ? '-' : value}
      </div>
      <div className="font-body text-base text-grey-900 dark:text-slate-100">
        {label}
      </div>
    </div>
  )
}

export function StatsSection() {
  const { data, loading } = useProtocolLogQuery({
    client,
  })

  const stats = data?.protocolLog

  return (
    <section className="bg-smoke-50 dark:bg-slate-700">
      <div className="m-auto flex max-w-5xl flex-wrap justify-between gap-8 py-10 px-8 md:gap-4">
        <Stat
          value={formattedNum(stats?.projectsCount)}
          label={<Trans>Projects created</Trans>}
          loading={loading}
        />
        <Stat
          value={
            <Link href="/activity" className="text-current">
              <USDAmount
                amount={stats?.volumeUSD}
                precision={0}
                symbol="$"
                tooltipContent={
                  <ETHAmount amount={stats?.volume} hideTooltip />
                }
                className="gradient-animation bg-gradient-to-r from-bluebs-500 via-grape-400 to-juice-500 bg-clip-text font-display transition-colors hover:text-transparent"
              />
            </Link>
          }
          label={<Trans>Total raised</Trans>}
          loading={loading}
        />
        <Stat
          value={formattedNum(stats?.paymentsCount)}
          label={<Trans>Payments made</Trans>}
          loading={loading}
        />
      </div>
    </section>
  )
}
