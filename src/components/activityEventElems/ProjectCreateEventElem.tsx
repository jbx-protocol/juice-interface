import { t, Trans } from '@lingui/macro'

import { ProjectEventsQuery } from 'generated/graphql'
import { ActivityEvent } from './ActivityElement/ActivityElement'

export default function ProjectCreateEventElem({
  event,
  withProjectLink,
}: {
  event: ProjectEventsQuery['projectEvents'][0]['projectCreateEvent']
  withProjectLink?: boolean
}) {
  return (
    <ActivityEvent
      header={t`Created`}
      withProjectLink={withProjectLink}
      subject={<Trans>Project created 🎉</Trans>}
      event={event}
    />
  )
}
