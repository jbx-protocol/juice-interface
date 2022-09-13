import { Trans } from '@lingui/macro'
import ETHAmount from 'components/currency/ETHAmount'
import EtherscanLink from 'components/EtherscanLink'
import FormattedAddress from 'components/FormattedAddress'
import { ThemeContext } from 'contexts/themeContext'
import { V1ProjectContext } from 'contexts/v1/projectContext'
import { RedeemEvent } from 'models/subgraph-entities/vX/redeem-event'
import { useContext } from 'react'
import { formatHistoricalDate } from 'utils/format/formatDate'
import { formatWad } from 'utils/format/formatNumber'
import { tokenSymbolText } from 'utils/tokenSymbolText'

import {
  contentLineHeight,
  primaryContentFontSize,
  smallHeaderStyle,
} from './styles'

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
          <div style={smallHeaderStyle(colors)}>
            <Trans>Redeemed</Trans>
          </div>
          <div
            style={{
              lineHeight: contentLineHeight,
              fontSize: primaryContentFontSize,
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
            <FormattedAddress
              address={event.beneficiary}
              style={{ fontWeight: 400 }}
            />
          </div>
        </div>
      </div>

      <div style={{ color: colors.text.secondary }}>
        <Trans>
          <ETHAmount amount={event.returnAmount} /> overflow received
        </Trans>
      </div>
    </div>
  )
}
