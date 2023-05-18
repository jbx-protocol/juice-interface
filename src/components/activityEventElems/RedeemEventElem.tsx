import { plural, t, Trans } from '@lingui/macro'
import ETHAmount from 'components/currency/ETHAmount'
import RichNote from 'components/RichNote'
import { TokenAmount } from 'components/TokenAmount'
import { V1ProjectContext } from 'contexts/v1/Project/V1ProjectContext'
import { ProjectEventsQuery } from 'generated/graphql'
import { useContext } from 'react'
import { decodeJB721DelegateRedeemMetadata } from 'utils/nftRewards'
import { ActivityEvent } from './ActivityElement'

export default function RedeemEventElem({
  event,
}: {
  event: ProjectEventsQuery['projectEvents'][0]['redeemEvent']
}) {
  const { tokenSymbol } = useContext(V1ProjectContext)

  if (!event) return null

  const [, , redeemedTokenIds] = event.metadata
    ? decodeJB721DelegateRedeemMetadata(event.metadata) ?? []
    : []

  const redeemedTokens = (
    <TokenAmount amountWad={event.amount} tokenSymbol={tokenSymbol} />
  )

  return (
    <ActivityEvent
      event={event}
      header={t`Redeemed`}
      subject={
        <div className="text-base font-medium">
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
            <ETHAmount amount={event.returnAmount} /> reclaimed from project
          </Trans>
          {event.memo && <RichNote className="mt-4" note={event.memo} />}
        </div>
      }
    />
  )
}
