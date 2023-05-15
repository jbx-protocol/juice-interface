import { t, Trans } from '@lingui/macro'
import EthereumAddress from 'components/EthereumAddress'
import RichNote from 'components/RichNote'
import { ProjectEventsQuery } from 'generated/graphql'

import { ActivityEvent } from '../ActivityElement'

export default function DeployETHERC20ProjectPayerEventElem({
  event,
}: {
  event:
    | ProjectEventsQuery['projectEvents'][0]['deployETHERC20ProjectPayerEvent']
}) {
  if (!event) return null

  return (
    <ActivityEvent
      event={event}
      header={t`Deployed a project payer address`}
      subject={
        <Trans>
          from <EthereumAddress address={event.from} />
        </Trans>
      }
      extra={
        <div>
          <Trans>
            Address: <EthereumAddress address={event.address} />
          </Trans>
          {event.memo && (
            <div className="mt-2">
              <RichNote note={event.memo} />
            </div>
          )}
        </div>
      }
    />
  )
}
