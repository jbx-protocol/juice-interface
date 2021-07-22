import { BigNumber } from '@ethersproject/bignumber'
import axios, { AxiosResponse } from 'axios'
import CurrencySymbol from 'components/shared/CurrencySymbol'
import { subgraphUrl } from 'constants/subgraphs'
import { ThemeContext } from 'contexts/themeContext'
import { PayEvent } from 'models/events/pay-event'
import { CSSProperties, useContext, useEffect, useState } from 'react'
import { formatDate } from 'utils/formatDate'
import { formatWad } from 'utils/formatNumber'
import { formatGraphQuery } from 'utils/graph'

export default function PayEvents({
  projectId,
}: {
  projectId: BigNumber | undefined
}) {
  const { colors } = useContext(ThemeContext).theme
  const [events, setEvents] = useState<PayEvent[]>()

  useEffect(() => {
    axios
      .post(
        subgraphUrl,
        {
          query: formatGraphQuery<PayEvent>({
            entity: 'payEvent',
            keys: [
              'amount',
              'beneficiary',
              'caller',
              'fundingCycleId',
              'id',
              'note',
              'timestamp',
            ],
            first: 100,
            orderDirection: 'desc',
            orderBy: 'timestamp',
            where: projectId
              ? {
                  key: 'projectId',
                  value: projectId.toString(),
                }
              : undefined,
          }),
        },
        { headers: { 'Content-Type': 'application/json' } },
      )
      .then((res: AxiosResponse<{ data: { payEvents: PayEvent[] } }>) =>
        setEvents(res.data?.data?.payEvents),
      )
      .catch(err => console.log('Error getting pay events', err))
  }, [projectId])

  const smallHeaderStyle: CSSProperties = {
    fontSize: '.7rem',
    color: colors.text.tertiary,
  }

  const contentLineHeight = 1.5

  return (
    <div>
      {events?.length ? (
        events.map((event, i) => (
          <div
            style={{
              marginBottom: 20,
              paddingBottom: 20,
              borderBottom: '1px solid ' + colors.stroke.tertiary,
            }}
            key={i}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignContent: 'space-between',
              }}
            >
              <div>
                <div style={smallHeaderStyle}>Received</div>
                <div
                  style={{
                    lineHeight: contentLineHeight,
                    fontSize: '1rem',
                    marginRight: 10,
                    color: colors.text.primary,
                  }}
                >
                  <CurrencySymbol currency={0} />
                  {formatWad(event.amount)}
                </div>
              </div>

              <div>
                <div
                  style={{
                    ...smallHeaderStyle,
                    textAlign: 'right',
                    color: colors.text.secondary,
                  }}
                >
                  {formatDate(BigNumber.from(event.timestamp).mul(1000))}
                </div>
                <div
                  style={{
                    ...smallHeaderStyle,
                    color: colors.text.secondary,
                    marginTop: '.3rem',
                    lineHeight: contentLineHeight,
                  }}
                >
                  {event.caller}
                </div>
              </div>
            </div>

            {event.note && (
              <div style={{ color: colors.text.secondary, marginTop: 5 }}>
                "{event.note}"
              </div>
            )}
          </div>
        ))
      ) : (
        <div
          style={{
            color: colors.text.secondary,
            paddingTop: 20,
            borderTop: '1px solid ' + colors.stroke.tertiary,
          }}
        >
          No activity yet
        </div>
      )}
    </div>
  )
}
