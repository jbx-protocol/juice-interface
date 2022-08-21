import { Trans } from '@lingui/macro'
import ETHAmount from 'components/currency/ETHAmount'
import { ThemeContext } from 'contexts/themeContext'
import { V1ProjectContext } from 'contexts/v1/projectContext'
import { RedeemEvent } from 'models/subgraph-entities/vX/redeem-event'
import { useContext } from 'react'
import { formatWad } from 'utils/formatNumber'
import { tokenSymbolText } from 'utils/tokenSymbolText'

import { ActivityEvent } from './ActivityElement'

import { primaryContentFontSize } from './styles'

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
    <ActivityEvent
      header="Redeemed"
      subject={
        <div style={{ fontSize: primaryContentFontSize }}>
          {formatWad(event.amount, { precision: 0 })}{' '}
          {tokenSymbolText({
            tokenSymbol: tokenSymbol,
            capitalize: false,
            plural: true,
          })}
        </div>
      }
      extra={
        <div style={{ color: colors.text.secondary }}>
          <Trans>
            <ETHAmount amount={event.returnAmount} /> overflow received
          </Trans>
        </div>
      }
      event={{ ...event, beneficiary: undefined }}
    />
  )
}
