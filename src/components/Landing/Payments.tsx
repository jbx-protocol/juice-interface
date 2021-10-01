import { useContext, useEffect, useState } from 'react'
import { querySubgraph } from 'utils/graph'
import { parsePayEventJson, PayEvent } from 'models/subgraph-entities/pay-event'
import Loading from 'components/shared/Loading'
import ProjectHandle from 'components/shared/ProjectHandle'
import { formatHistoricalDate } from 'utils/formatDate'
import { formatWad } from 'utils/formatNumber'
import CurrencySymbol from 'components/shared/CurrencySymbol'
import RichNote from 'components/Dashboard/ProjectActivity/RichNote'
import { ThemeContext } from 'contexts/themeContext'
import FormattedAddress from 'components/shared/FormattedAddress'

export default function Payments() {
  const [events, setEvents] = useState<PayEvent[]>([])
  const [loading, setLoading] = useState<boolean>()

  const {
    theme: { colors },
  } = useContext(ThemeContext)

  useEffect(() => {
    setLoading(true)

    querySubgraph(
      {
        entity: 'payEvent',
        keys: [
          'amount',
          'beneficiary',
          'note',
          'timestamp',
          { entity: 'project', keys: ['id'] },
        ],
        first: 20,
        orderDirection: 'desc',
        orderBy: 'timestamp',
      },
      res => {
        if (!res) return

        setEvents(res.payEvents.map(e => parsePayEventJson(e)))
        setLoading(false)
      },
    )
  }, [])

  return (
    <div>
      {loading ? (
        <Loading />
      ) : (
        <div>
          {events.map(e => (
            <div
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
                  {e.project && <ProjectHandle projectId={e.project} link />}
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
                  <CurrencySymbol currency={0} />
                  {formatWad(e.amount)}
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
      )}
    </div>
  )
}
