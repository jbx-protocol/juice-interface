import ETHAmount from 'components/shared/ETHAmount'
import EtherscanLink from 'components/shared/EtherscanLink'
import FormattedAddress from 'components/shared/FormattedAddress'
import RichNote from 'components/shared/RichNote'
import { ThemeContext } from 'contexts/themeContext'
import { V1ProjectContext } from 'contexts/v1/projectContext'
import { PayEvent } from 'models/subgraph-entities/pay-event'
import { useCallback, useContext } from 'react'
import { formatHistoricalDate } from 'utils/formatDate'
import { contentLineHeight, smallHeaderStyle } from '../styles'

// Maps a project id to an internal map of payment event overrides.
let payEventOverrides = new Map<string, Map<string, string>>([
  [
    '10',
    new Map<string, string>([
      ['Minted WikiToken for Page ID', 'WikiToken minted'],
    ]),
  ],
])

export default function PayEventElem({
  event,
}: {
  event:
    | Pick<
        PayEvent,
        'amount' | 'timestamp' | 'beneficiary' | 'note' | 'id' | 'txHash'
      >
    | undefined
}) {
  const { projectId } = useContext(V1ProjectContext)

  const {
    theme: { colors },
  } = useContext(ThemeContext)

  const usePayEventOverrides =
    projectId && payEventOverrides.has(projectId.toString())

  const formatPayEventOverride = useCallback(
    (e: Partial<PayEvent>) => {
      if (!projectId) {
        return e.note
      }

      let override
      payEventOverrides
        .get(projectId.toString())
        ?.forEach((value: string, key: string) => {
          if (e.note?.includes(key)) {
            override = value
            return
          }
        })

      return override ? override : e.note
    },
    [projectId],
  )

  if (!event) return null

  return (
    <div
      key={event.id}
      style={{
        marginBottom: 20,
        paddingBottom: 20,
        borderBottom: '1px solid ' + colors.stroke.tertiary,
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignContent: 'space-between',
        }}
      >
        <div>
          <div style={smallHeaderStyle(colors)}>Paid</div>
          <div
            style={{
              lineHeight: contentLineHeight,
              fontSize: '1rem',
            }}
          >
            <ETHAmount amount={event.amount} precision={4} />
          </div>
        </div>

        <div style={{ textAlign: 'right' }}>
          {event.timestamp && (
            <div style={smallHeaderStyle(colors)}>
              {formatHistoricalDate(event.timestamp * 1000)}{' '}
              <EtherscanLink value={event.txHash} type="tx" />
            </div>
          )}
          <div
            style={{
              ...smallHeaderStyle(colors),
              lineHeight: contentLineHeight,
            }}
          >
            <FormattedAddress address={event.beneficiary} />
          </div>
        </div>
      </div>

      <div style={{ marginTop: 5 }}>
        <RichNote
          note={
            (usePayEventOverrides
              ? formatPayEventOverride(event)
              : event.note) ?? ''
          }
        />
      </div>
    </div>
  )
}
