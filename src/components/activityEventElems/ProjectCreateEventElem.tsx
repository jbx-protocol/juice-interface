import { t, Trans } from '@lingui/macro'
import { ProjectCreateEvent } from 'models/subgraph-entities/vX/project-create-event'

import { ActivityEvent } from './ActivityElement'

export default function ProjectCreateEventElem({
  event,
}: {
  event: Pick<ProjectCreateEvent, 'id' | 'from' | 'timestamp' | 'txHash'>
}) {
  return (
    <ActivityEvent
      header={t`Created`}
      subject={<Trans>Project created 🎉</Trans>}
      event={{ ...event, beneficiary: undefined }}
    />
  )
}
