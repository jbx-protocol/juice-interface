import RichNote from 'components/shared/RichNote'
import FormattedAddress from 'components/shared/FormattedAddress'
import Loading from 'components/shared/Loading'
import V1ProjectHandle from 'components/v1/shared/V1ProjectHandle'

import { ThemeContext } from 'contexts/themeContext'
import useSubgraphQuery from 'hooks/SubgraphQuery'
import { useContext } from 'react'
import { formatHistoricalDate } from 'utils/formatDate'

import ETHAmount from 'components/shared/currency/ETHAmount'

export default function Payments() {
  const {
    theme: { colors },
  } = useContext(ThemeContext)

  const { data: events, isLoading } = useSubgraphQuery({
    entity: 'projectEvent',
    keys: ['payEvent', 'timestamp', 'id', { entity: 'project', keys: ['id'] }],
    where: { key: 'cv', value: 1 },
    first: 20,
    orderDirection: 'desc',
    orderBy: 'timestamp',
  })

  return (
    <div>
      {events || !isLoading ? (
        <div>
          {events?.map((e, i) => (
            <div
              key={e.id}
              style={{
                paddingTop: i === 0 ? 0 : 10,
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
                  {e.payEvent?.project?.projectId && (
                    <V1ProjectHandle projectId={e.payEvent.project.projectId} />
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
                  <ETHAmount amount={e.payEvent?.amount} precision={4} />
                </span>
                <span>
                  <FormattedAddress address={e.payEvent?.beneficiary} />
                </span>
              </div>
              <div>
                <RichNote note={e.payEvent?.note} />
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
