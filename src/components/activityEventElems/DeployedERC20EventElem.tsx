import { DeployedERC20Event } from 'models/subgraph-entities/vX/deployed-erc20-event'

import { ActivityEvent } from './ActivityElement/ActivityElement'

import { primaryContentFontSize } from './styles'

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
      header="Deployed ERC20 token"
      subject={
        <div style={{ fontSize: primaryContentFontSize }}>{event.symbol}</div>
      }
      event={{ ...event, beneficiary: undefined }}
    />
  )
}
