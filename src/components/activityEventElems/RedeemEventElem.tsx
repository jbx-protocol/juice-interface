import { plural, t, Trans } from '@lingui/macro'
import ETHAmount from 'components/currency/ETHAmount'
import { ThemeContext } from 'contexts/themeContext'
import { V1ProjectContext } from 'contexts/v1/projectContext'
import { RedeemEvent } from 'models/subgraph-entities/vX/redeem-event'
import { useContext } from 'react'
import { formatWad } from 'utils/format/formatNumber'
import { decodeJB721DelegateRedeemMetadata } from 'utils/nftRewards'
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
        | 'terminal'
        | 'metadata'
      >
    | undefined
}) {
  const { tokenSymbol } = useContext(V1ProjectContext)
  const {
    theme: { colors },
  } = useContext(ThemeContext)

  if (!event) return null

  const [, , redeemedTokenIds] = decodeJB721DelegateRedeemMetadata(
    event.metadata,
  )

  const redeemedTokens = `${formatWad(event.amount, {
    precision: 0,
  })} ${tokenSymbolText({
    tokenSymbol: tokenSymbol,
    capitalize: false,
    plural: true,
  })}`

  return (
    <ActivityEvent
      event={event}
      header={t`Redeemed`}
      subject={
        <div style={{ fontSize: primaryContentFontSize }}>
          {redeemedTokenIds.length > 0 ? (
            <div>
              <div>
                {plural(redeemedTokenIds.length, {
                  one: '# NFT',
                  other: '# NFTs',
                })}
              </div>
              <div className="text-xs text-grey-500 dark:text-grey-300">
                {redeemedTokens}
              </div>
            </div>
          ) : (
            <span>{redeemedTokens}</span>
          )}
        </div>
      }
      extra={
        <div style={{ color: colors.text.secondary }}>
          <Trans>
            <ETHAmount amount={event.returnAmount} /> overflow received
          </Trans>
        </div>
      }
    />
  )
}
