import { t, Trans } from '@lingui/macro'
import ETHAmount from 'components/currency/ETHAmount'
import RichNote from 'components/RichNote'
import V2V3ProjectHandleLink from 'components/v2v3/shared/V2V3ProjectHandleLink'
import { PayEvent } from 'models/subgraph-entities/vX/pay-event'

import { ActivityEvent } from './ActivityElement'

export default function PayEventElem({
  event,
}: {
  event:
    | Pick<
        PayEvent,
        | 'amount'
        | 'timestamp'
        | 'beneficiary'
        | 'note'
        | 'id'
        | 'txHash'
        | 'feeFromV2Project'
        | 'terminal'
      >
    | undefined
}) {
  if (!event) return null
  return (
    <ActivityEvent
      event={event}
      header={t`Paid`}
      subject={<ETHAmount amount={event.amount} />}
      extra={
        event.feeFromV2Project ? (
          <Trans>
            Fee from{' '}
            <span>
              <V2V3ProjectHandleLink projectId={event.feeFromV2Project} />
            </span>
          </Trans>
        ) : (
          <RichNote
            className="text-grey-900 dark:text-slate-100"
            note={event.note ?? ''}
          />
        )
      }
    />
  )
}
