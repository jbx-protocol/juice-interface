import { t } from '@lingui/macro'
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
        | 'amount'
        | 'timestamp'
        | 'caller'
        | 'note'
        | 'id'
        | 'txHash'
        | 'terminal'
      >
    | undefined
}) {
  if (!event) return null

  return (
    <ActivityEvent
      event={event}
      header={t`Transferred ETH to project`}
      subject={
        <span className="text-base font-medium">
          <ETHAmount amount={event.amount} />
        </span>
      }
      extra={
        <RichNote
          note={event.note ?? ''}
          className="text-grey-900 dark:text-slate-100"
        />
      }
    />
  )
}
