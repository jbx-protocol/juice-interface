import { Trans } from '@lingui/macro'
import ETHAmount from 'components/currency/ETHAmount'
import EtherscanLink from 'components/EtherscanLink'
import FormattedAddress from 'components/FormattedAddress'
import RichNote from 'components/RichNote'
import { ThemeContext } from 'contexts/themeContext'
import { V1ProjectContext } from 'contexts/v1/projectContext'
import { PayEvent } from 'models/subgraph-entities/vX/pay-event'
import { useCallback, useContext } from 'react'
import { formatHistoricalDate } from 'utils/formatDate'

import V2ProjectHandle from '../v2/shared/V2ProjectHandle'

import {
  contentLineHeight,
  primaryContentFontSize,
  smallHeaderStyle,
} from './styles'

// Maps a project id to an internal map of payment event overrides.
const payEventOverrides = new Map<number, Map<string, string>>([
  [
    10,
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
        | 'amount'
        | 'timestamp'
        | 'beneficiary'
        | 'note'
        | 'id'
        | 'txHash'
        | 'feeFromV2Project'
      >
    | undefined
}) {
  const { projectId } = useContext(V1ProjectContext)

  const {
    theme: { colors },
  } = useContext(ThemeContext)

  const usePayEventOverrides = projectId && payEventOverrides.has(projectId)

  const formatPayEventOverride = useCallback(
    (e: Partial<PayEvent>) => {
      if (!projectId) {
        return e.note
      }

      let override
      payEventOverrides
        .get(projectId)
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
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignContent: 'space-between',
        }}
      >
        <div>
          <div style={smallHeaderStyle(colors)}>
            <Trans>Paid</Trans>
          </div>
          <div
            style={{
              lineHeight: contentLineHeight,
              fontSize: primaryContentFontSize,
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

      {event.feeFromV2Project ? (
        <div style={{ marginTop: 5 }}>
          <Trans>
            Fee from{' '}
            <span>
              <V2ProjectHandle projectId={event.feeFromV2Project} />
            </span>
          </Trans>
        </div>
      ) : (
        <div style={{ marginTop: 5 }}>
          <RichNote
            note={
              (usePayEventOverrides
                ? formatPayEventOverride(event)
                : event.note) ?? ''
            }
          />
        </div>
      )}
    </div>
  )
}
