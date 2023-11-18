import { t } from '@lingui/macro'
import ETHAmount from 'components/currency/ETHAmount'
import RichNote from 'components/RichNote/RichNote'

import { ProjectEventsQuery } from 'generated/graphql'
import { ActivityEvent } from './ActivityElement/ActivityElement'

export default function AddToBalanceEventElem({
  event,
  withProjectLink,
}: {
  event: ProjectEventsQuery['projectEvents'][0]['addToBalanceEvent']
  withProjectLink?: boolean
}) {
  if (!event) return null

  return (
    <ActivityEvent
      event={event}
      withProjectLink={withProjectLink}
      header={t`Transferred ETH to project`}
      subject={
        <span className="font-heading text-lg font-medium">
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
