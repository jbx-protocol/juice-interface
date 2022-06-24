import { Trans } from '@lingui/macro'
import ETHAmount from 'components/shared/currency/ETHAmount'
import { ThemeContext } from 'contexts/themeContext'
import useSubgraphQuery from 'hooks/SubgraphQuery'
import { useContext } from 'react'
import { formattedNum } from 'utils/formatNumber'

const Stat = ({
  value,
  label,
}: {
  value: string | number | JSX.Element | undefined
  label: string | JSX.Element
}) => {
  const {
    theme: { colors },
  } = useContext(ThemeContext)
  return (
    <div style={{ textAlign: 'center', width: '100%', maxWidth: '200px' }}>
      <div
        style={{
          fontSize: '2.5rem',
          fontWeight: 600,
          color: colors.text.brand.primary,
        }}
      >
        {value}
      </div>
      <div style={{ fontSize: '1rem' }}>{label}</div>
    </div>
  )
}

export function StatsSection() {
  const { data: protocolLogs } = useSubgraphQuery({
    entity: 'protocolLog',
    keys: ['erc20Count', 'paymentsCount', 'projectsCount', 'volumePaid'],
  })

  const stats = protocolLogs?.[0]

  return (
    <section
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        maxWidth: 1200,
        margin: '0 auto',
        padding: '4rem 2rem',
      }}
    >
      <Stat
        value={stats?.projectsCount}
        label={<Trans>Projects on Juicebox</Trans>}
      />
      <Stat
        value={<ETHAmount amount={stats?.volumePaid} />}
        label={<Trans>Raised on Juicebox</Trans>}
      />
      <Stat
        value={formattedNum(stats?.paymentsCount)}
        label={<Trans>Payments made</Trans>}
      />
    </section>
  )
}
