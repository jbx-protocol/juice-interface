import { plural, t, Trans } from '@lingui/macro'
import ETHAmount from 'components/currency/ETHAmount'
import RichNote from 'components/RichNote'
import { V1ProjectContext } from 'contexts/v1/Project/V1ProjectContext'
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
        | 'caller'
        | 'txHash'
        | 'timestamp'
        | 'returnAmount'
        | 'terminal'
        | 'metadata'
        | 'memo'
      >
    | undefined
}) {
  const { tokenSymbol } = useContext(V1ProjectContext)

  if (!event) return null

  const [, , redeemedTokenIds] = event.metadata
    ? decodeJB721DelegateRedeemMetadata(event.metadata) ?? []
    : []

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
        <div
          style={{ fontSize: primaryContentFontSize }}
          className="font-medium"
        >
          {redeemedTokenIds && redeemedTokenIds.length > 0 ? (
            <div>
              <div>
                {plural(redeemedTokenIds.length, {
                  one: '# NFT',
                  other: '# NFTs',
                })}
              </div>
              <div className="text-xs font-normal text-grey-500 dark:text-grey-300">
                {redeemedTokens}
              </div>
            </div>
          ) : (
            <span>{redeemedTokens}</span>
          )}
        </div>
      }
      extra={
        <div className="text-grey-900 dark:text-slate-100">
          <Trans>
            <ETHAmount amount={event.returnAmount} /> overflow received
          </Trans>
          {event.memo && (
            <>
              <br />
              <RichNote note={event.memo} />
            </>
          )}
        </div>
      }
    />
  )
}
