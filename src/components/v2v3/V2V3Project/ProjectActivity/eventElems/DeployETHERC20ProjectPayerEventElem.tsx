import { t, Trans } from '@lingui/macro'
import { ActivityEvent } from 'components/activityEventElems/ActivityElement'
import FormattedAddress from 'components/FormattedAddress'
import RichNote from 'components/RichNote'
import { DeployETHERC20ProjectPayerEvent } from 'models/subgraph-entities/v2/deploy-eth-erc20-project-payer-event'

export default function DeployETHERC20ProjectPayerEventElem({
  event,
}: {
  event:
    | Pick<
        DeployETHERC20ProjectPayerEvent,
        'id' | 'timestamp' | 'txHash' | 'from' | 'address' | 'memo'
      >
    | undefined
}) {
  if (!event) return null

  return (
    <ActivityEvent
      event={event}
      header={t`Deployed a project payer address`}
      subject={
        <Trans>
          called by <FormattedAddress address={event.from} />
        </Trans>
      }
      extra={
        <div>
          <Trans>
            Address: <FormattedAddress address={event.address} />
          </Trans>
          <div className="mt-2">
            <RichNote note={event.memo} />
          </div>
        </div>
      }
    />
  )
}
