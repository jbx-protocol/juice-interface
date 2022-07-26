import { Trans } from '@lingui/macro'
import ETHAmount from 'components/currency/ETHAmount'
import { ThemeContext } from 'contexts/themeContext'
import useMobile from 'hooks/Mobile'
import useSubgraphQuery from 'hooks/SubgraphQuery'
import { useContext } from 'react'
import { formattedNum } from 'utils/formatNumber'

const Stat = ({
  value,
  label,
  loading,
}: {
  value: string | number | JSX.Element | undefined
  label: string | JSX.Element
  loading: boolean
}) => {
  const {
    theme: { colors },
  } = useContext(ThemeContext)
  const isMobile = useMobile()

  return (
    <div
      style={{
        textAlign: 'center',
        width: '100%',
        maxWidth: '200px',
        margin: '0 auto',
      }}
    >
      <div
        style={{
          fontSize: isMobile ? '1.8rem' : '2.5rem',
          fontWeight: 600,
          color: colors.text.brand.primary,
        }}
      >
        {loading ? '-' : value}
      </div>
      <div style={{ fontSize: '1rem' }}>{label}</div>
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
    <section
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        maxWidth: 1200,
        margin: '0 auto',
        padding: '4rem 2rem',
        flexWrap: 'wrap',
        gap: '1rem',
      }}
    >
      <Stat
        value={stats?.projectsCount}
        label={<Trans>Projects on Juicebox</Trans>}
        loading={isLoading}
      />
      <Stat
        value={<ETHAmount amount={stats?.volumePaid} />}
        label={<Trans>Raised on Juicebox</Trans>}
        loading={isLoading}
      />
      <Stat
        value={formattedNum(stats?.paymentsCount)}
        label={<Trans>Payments made</Trans>}
        loading={isLoading}
      />
    </section>
  )
}
