import { t } from '@lingui/macro'
import { ProjectEventsQuery } from 'generated/graphql'
import { ActivityEvent } from './ActivityElement/ActivityElement'

export default function DeployedERC20EventElem({
  event,
}: {
  event: ProjectEventsQuery['projectEvents'][0]['deployedERC20Event']
}) {
  if (!event) return null
  return (
    <ActivityEvent
      header={t`Deployed ERC20 token`}
      subject={<div className="text-base">{event.symbol}</div>}
      event={{ ...event, beneficiary: undefined }}
    />
  )
}
