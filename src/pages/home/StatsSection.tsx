import { Trans } from '@lingui/macro'
import ETHAmount from 'components/currency/ETHAmount'
import useMobile from 'hooks/Mobile'
import useSubgraphQuery from 'hooks/SubgraphQuery'
import { classNames } from 'utils/classNames'
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
  const isMobile = useMobile()

  return (
    <div className="my-0 mx-auto flex w-full max-w-[200px] flex-col gap-2 text-center">
      <div
        className={classNames(
          'font-semibold text-juice-400 dark:text-juice-300',
          isMobile ? 'text-4xl' : 'text-5xl',
        )}
      >
        {loading ? '-' : value}
      </div>
      <div className="text-base">{label}</div>
    </div>
  )
}

export function StatsSection() {
  const { data: protocolLogs, isLoading } = useSubgraphQuery({
    entity: 'protocolLog',
    keys: ['erc20Count', 'paymentsCount', 'projectsCount', 'volumePaid'],
  })

  const stats = protocolLogs?.[0]

  return (
    <section className="bg-smoke-50 dark:bg-slate-600">
      <div className="m-auto flex max-w-5xl flex-wrap justify-between gap-4 py-16 px-8">
        <Stat
          value={stats?.projectsCount}
          label={<Trans>Projects on Juicebox</Trans>}
          loading={isLoading}
        />
        <Stat
          value={<ETHAmount amount={stats?.volumePaid} precision={0} />}
          label={<Trans>Raised on Juicebox</Trans>}
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
