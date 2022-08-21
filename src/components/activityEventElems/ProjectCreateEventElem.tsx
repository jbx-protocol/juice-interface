import { t, Trans } from '@lingui/macro'
import FormattedAddress from 'components/FormattedAddress'
import { ProjectCreateEvent } from 'models/subgraph-entities/vX/project-create-event'
import { ActivityEvent } from './ActivityElement'

export default function ProjectCreateEventElem({
  event,
}: {
  event: Pick<ProjectCreateEvent, 'id' | 'caller' | 'timestamp' | 'txHash'>
}) {
  return (
    <ActivityEvent
      header={t`Created`}
      subject={
        <Trans>
          Project created by <FormattedAddress address={event.caller} />
        </Trans>
      }
      event={{ ...event, beneficiary: undefined }}
    />
  )
}
