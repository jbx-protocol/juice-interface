import { t } from '@lingui/macro'
import { BurnEvent } from 'models/subgraph-entities/vX/burn-event'
import { formatWad } from 'utils/format/formatNumber'
import { tokenSymbolText } from 'utils/tokenSymbolText'

import { ActivityEvent } from './ActivityElement'

export default function BurnEventElem({
  event,
  tokenSymbol,
}: {
  event:
    | Pick<BurnEvent, 'amount' | 'timestamp' | 'caller' | 'id' | 'txHash'>
    | undefined
  tokenSymbol: string | undefined
}) {
  if (!event) return null
  return (
    <ActivityEvent
      event={event}
      header={t`Burned`}
      subject={
        <span className="text-base font-medium">
          {formatWad(event.amount)}{' '}
          {tokenSymbolText({
            tokenSymbol,
          })}
        </span>
      }
    />
  )
}
