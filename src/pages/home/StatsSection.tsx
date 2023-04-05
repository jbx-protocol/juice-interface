import { Trans } from '@lingui/macro'
import USDAmount from 'components/currency/USDAmount'
import useSubgraphQuery from 'hooks/SubgraphQuery'
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
      <div className="font-display text-4xl font-medium text-juice-400 dark:text-juice-300 md:text-5xl">
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
      <div className="m-auto flex max-w-5xl flex-wrap justify-between gap-4 py-16 px-8">
        <Stat
          value={formattedNum(stats?.projectsCount)}
          label={<Trans>Projects created</Trans>}
          loading={isLoading}
        />
        <Stat
          value={
            <USDAmount amount={stats?.volumePaidUSD} precision={0} symbol="$" />
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
