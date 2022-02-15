import RichNote from 'components/shared/RichNote'
import CurrencySymbol from 'components/shared/CurrencySymbol'
import FormattedAddress from 'components/shared/FormattedAddress'
import Loading from 'components/shared/Loading'
import ProjectHandle from 'components/shared/ProjectHandle'

import { ThemeContext } from 'contexts/themeContext'
import useSubgraphQuery from 'hooks/SubgraphQuery'
import { useContext } from 'react'
import { formatHistoricalDate } from 'utils/formatDate'
import { formatWad } from 'utils/formatNumber'

import { V1_CURRENCY_ETH } from 'constants/v1/currency'

export default function Payments() {
  const {
    theme: { colors },
  } = useContext(ThemeContext)

  const { data: events, isLoading } = useSubgraphQuery({
    entity: 'payEvent',
    keys: [
      'amount',
      'beneficiary',
      'note',
      'timestamp',
      'id',
      { entity: 'project', keys: ['id'] },
    ],
    first: 20,
    orderDirection: 'desc',
    orderBy: 'timestamp',
  })

  return (
    <div>
      {events || !isLoading ? (
        <div>
          {events?.map(e => (
            <div
              key={e.id}
              style={{
                paddingTop: 10,
                paddingBottom: 20,
                marginBottom: 10,
                borderBottom: '1px solid ' + colors.stroke.tertiary,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                }}
              >
                <div
                  style={{ color: colors.text.action.primary, fontWeight: 500 }}
                >
                  {e.project?.id && (
                    <ProjectHandle projectId={e.project.id} link />
                  )}
                </div>
                <div
                  style={{ fontSize: '.7rem', color: colors.text.secondary }}
                >
                  {e.timestamp && formatHistoricalDate(e.timestamp * 1000)}
                </div>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                }}
              >
                <span style={{ fontSize: '1rem', fontWeight: 500 }}>
                  <CurrencySymbol currency={V1_CURRENCY_ETH} />
                  {formatWad(e.amount, { precision: 4 })}
                </span>
                <span>
                  <FormattedAddress address={e.beneficiary} />
                </span>
              </div>
              <div>
                <RichNote note={e.note} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <Loading />
      )}
    </div>
  )
}
