import { Trans } from '@lingui/macro'
import ETHAmount from 'components/currency/ETHAmount'
import EtherscanLink from 'components/EtherscanLink'
import FormattedAddress from 'components/FormattedAddress'
import RichNote from 'components/RichNote'
import { ThemeContext } from 'contexts/themeContext'
import { AddToBalanceEvent } from 'models/subgraph-entities/vX/add-to-balance-event'
import { useContext } from 'react'
import { formatHistoricalDate } from 'utils/format/formatDate'

import {
  contentLineHeight,
  primaryContentFontSize,
  smallHeaderStyle,
} from './styles'

export default function AddToBalanceEventElem({
  event,
}: {
  event:
    | Pick<
        AddToBalanceEvent,
        'amount' | 'timestamp' | 'caller' | 'note' | 'id' | 'txHash'
      >
    | undefined
}) {
  const {
    theme: { colors },
  } = useContext(ThemeContext)

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
            <Trans>Added to balance</Trans>
          </div>
          <div
            style={{
              lineHeight: contentLineHeight,
              fontSize: primaryContentFontSize,
            }}
          >
            <ETHAmount amount={event.amount} />
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
            <FormattedAddress
              address={event.caller}
              style={{ fontWeight: 400 }}
            />
          </div>
        </div>
      </div>

      {
        <div style={{ marginTop: 5 }}>
          <RichNote
            note={event.note ?? ''}
            style={{ color: colors.text.secondary }}
          />
        </div>
      }
    </div>
  )
}
