import { Trans } from '@lingui/macro'
import ETHAmount from 'components/currency/ETHAmount'
import { LAYOUT_MAX_WIDTH_PX } from 'constants/styles/layouts'
import { ThemeContext } from 'contexts/themeContext'
import useMobile from 'hooks/Mobile'
import useSubgraphQuery from 'hooks/SubgraphQuery'
import { useContext } from 'react'
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
          color: colors.text.primary,
        }}
      >
        {loading ? '-' : value}
      </div>
      <div style={{ fontSize: '1rem' }}>{label}</div>
    </div>
  )
}

export function StatsSection() {
  const {
    theme: { colors },
    isDarkMode,
  } = useContext(ThemeContext)

  const { data: protocolLogs, isLoading } = useSubgraphQuery({
    entity: 'protocolLog',
    keys: ['erc20Count', 'paymentsCount', 'projectsCount', 'volumePaid'],
  })

  const stats = protocolLogs?.[0]

  return (
    <section
      style={{
        backgroundColor: isDarkMode ? colors.background.l1 : '#faf7f5',
      }}
    >
      <div
        style={{
          margin: 'auto',
          maxWidth: LAYOUT_MAX_WIDTH_PX,
          display: 'flex',
          justifyContent: 'space-between',
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
