import { t } from '@lingui/macro'
import { DeployedERC20Event } from 'models/subgraph-entities/vX/deployed-erc20-event'
import { ActivityEvent } from './ActivityElement/ActivityElement'

export default function DeployedERC20EventElem({
  event,
}: {
  event:
    | Pick<DeployedERC20Event, 'symbol' | 'id' | 'timestamp' | 'txHash'>
    | undefined
}) {
  if (!event) return null
  return (
    <ActivityEvent
      header={t`Deployed ERC20 token`}
      subject={<div className="text-base">{event.symbol}</div>}
      event={{ ...event, beneficiary: undefined, caller: undefined }}
    />
  )
}
