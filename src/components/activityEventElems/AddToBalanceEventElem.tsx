import ETHAmount from 'components/currency/ETHAmount'
import RichNote from 'components/RichNote'
import { AddToBalanceEvent } from 'models/subgraph-entities/vX/add-to-balance-event'

import { ActivityEvent } from './ActivityElement'

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
  if (!event) return null

  return (
    <ActivityEvent
      event={event}
      header="Added to balance"
      subject={<ETHAmount amount={event.amount} />}
      extra={
        <RichNote
          note={event.note ?? ''}
          className="text-grey-900 dark:text-slate-100"
        />
      }
    />
  )
}
