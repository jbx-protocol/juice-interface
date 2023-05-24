import { t, Trans } from '@lingui/macro'
import ETHAmount from 'components/currency/ETHAmount'
import RichNote from 'components/RichNote'
import V2V3ProjectHandleLink from 'components/v2v3/shared/V2V3ProjectHandleLink'

import { ProjectEventsQuery } from 'generated/graphql'
import { ActivityEvent } from './ActivityElement'

export default function PayEventElem({
  event,
}: {
  event: ProjectEventsQuery['projectEvents'][0]['payEvent']
}) {
  if (!event) return null

  return (
    <ActivityEvent
      event={event}
      header={t`Paid`}
      subject={
        <span className="text-base font-medium">
          <ETHAmount amount={event.amount} />
        </span>
      }
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
