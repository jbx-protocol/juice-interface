import CurrencySymbol from 'components/shared/CurrencySymbol'
import EtherscanLink from 'components/shared/EtherscanLink'
import FormattedAddress from 'components/shared/FormattedAddress'
import { ThemeContext } from 'contexts/themeContext'
import { V1ProjectContext } from 'contexts/v1/projectContext'
import { RedeemEvent } from 'models/subgraph-entities/redeem-event'
import { useContext } from 'react'
import { formatHistoricalDate } from 'utils/formatDate'
import { formatWad } from 'utils/formatNumber'
import { tokenSymbolText } from 'utils/tokenSymbolText'

import { contentLineHeight, smallHeaderStyle } from './styles'

export default function RedeemEventElem({
  event,
}: {
  event:
    | Pick<
        RedeemEvent,
        | 'id'
        | 'amount'
        | 'beneficiary'
        | 'txHash'
        | 'timestamp'
        | 'returnAmount'
      >
    | undefined
}) {
  const {
    theme: { colors },
  } = useContext(ThemeContext)
  const { tokenSymbol } = useContext(V1ProjectContext)

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
          <div style={smallHeaderStyle(colors)}>Redeemed</div>
          <div
            style={{
              lineHeight: contentLineHeight,
              fontSize: '1rem',
            }}
          >
            {formatWad(event.amount, { precision: 0 })}{' '}
            {tokenSymbolText({
              tokenSymbol: tokenSymbol,
              capitalize: false,
              plural: true,
            })}
          </div>
        </div>

        <div>
          <div
            style={{
              ...smallHeaderStyle(colors),
              textAlign: 'right',
            }}
          >
            {event.timestamp && (
              <span>{formatHistoricalDate(event.timestamp * 1000)}</span>
            )}{' '}
            <EtherscanLink value={event.txHash} type="tx" />
          </div>
          <div
            style={{
              ...smallHeaderStyle(colors),
              lineHeight: contentLineHeight,
              textAlign: 'right',
            }}
          >
            <FormattedAddress address={event.beneficiary} />
          </div>
        </div>
      </div>

      <div style={{ color: colors.text.secondary }}>
        <CurrencySymbol currency="ETH" />
        {formatWad(event.returnAmount, { precision: 4 })} overflow received
      </div>
    </div>
  )
}
