import { t, Trans } from '@lingui/macro'
import ETHAmount from 'components/currency/ETHAmount'
import RichNote from 'components/RichNote/RichNote'
import V2V3ProjectHandleLink from 'components/v2v3/shared/V2V3ProjectHandleLink'

import { ProjectEventsQuery } from 'generated/graphql'
import { ActivityEvent } from './ActivityElement/ActivityElement'

export default function PayEventElem({
  event,
  withProjectLink,
}: {
  event: ProjectEventsQuery['projectEvents'][0]['payEvent']
  withProjectLink?: boolean
}) {
  if (!event) return null

  return (
    <ActivityEvent
      event={event}
      withProjectLink={withProjectLink}
      header={t`Paid`}
      subject={
        <span className="font-heading text-lg">
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
