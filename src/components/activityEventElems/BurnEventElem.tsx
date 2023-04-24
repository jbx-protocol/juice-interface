import { t } from '@lingui/macro'
import { BurnEvent } from 'models/subgraph-entities/vX/burn-event'

import { TokenAmount } from 'components/TokenAmount'
import { ActivityEvent } from './ActivityElement'

export default function BurnEventElem({
  event,
  tokenSymbol,
}: {
  event:
    | Pick<BurnEvent, 'amount' | 'timestamp' | 'from' | 'id' | 'txHash'>
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
          <TokenAmount amountWad={event.amount} tokenSymbol={tokenSymbol} />
        </span>
      }
    />
  )
}
