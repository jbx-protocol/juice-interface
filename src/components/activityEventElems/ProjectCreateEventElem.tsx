import { t, Trans } from '@lingui/macro'

import { ProjectEventsQuery } from 'generated/graphql'
import { ActivityEvent } from './ActivityElement'

export default function ProjectCreateEventElem({
  event,
}: {
  event: ProjectEventsQuery['projectEvents'][0]['projectCreateEvent']
}) {
  return (
    <ActivityEvent
      header={t`Created`}
      subject={<Trans>Project created 🎉</Trans>}
      event={event}
    />
  )
}
