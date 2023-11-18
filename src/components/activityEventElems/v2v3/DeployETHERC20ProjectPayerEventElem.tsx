import { t, Trans } from '@lingui/macro'
import EthereumAddress from 'components/EthereumAddress'
import RichNote from 'components/RichNote/RichNote'
import { ProjectEventsQuery } from 'generated/graphql'

import { PV_V2 } from 'constants/pv'
import { ActivityEvent } from '../ActivityElement/ActivityElement'

export default function DeployETHERC20ProjectPayerEventElem({
  event,
  withProjectLink,
}: {
  event:
    | ProjectEventsQuery['projectEvents'][0]['deployETHERC20ProjectPayerEvent']
  withProjectLink?: boolean
}) {
  if (!event) return null

  return (
    <ActivityEvent
      event={event}
      header={t`Deployed a project payer address`}
      withProjectLink={withProjectLink}
      pv={PV_V2}
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
