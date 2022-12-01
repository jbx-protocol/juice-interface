import EtherscanLink from 'components/EtherscanLink'
import FormattedAddress from 'components/FormattedAddress'
import { ProjectCreateEvent } from 'models/subgraph-entities/vX/project-create-event'
import { formatHistoricalDate } from 'utils/format/formatDate'

import { Trans } from '@lingui/macro'

export default function ProjectCreateEventElem({
  event,
}: {
  event: Pick<ProjectCreateEvent, 'id' | 'caller' | 'timestamp' | 'txHash'>
}) {
  return (
    <div className="flex content-between justify-between">
      <div>
        <div className="text-xs text-grey-400 dark:text-slate-200">Created</div>
        <div className="leading-6">
          <Trans>Project created by</Trans>{' '}
          <FormattedAddress className="font-normal" address={event.caller} />
        </div>
      </div>

      <div className="text-right">
        {event.timestamp && (
          <div className="text-xs text-grey-400 dark:text-slate-200">
            {formatHistoricalDate(event.timestamp * 1000)}{' '}
            <EtherscanLink value={event.txHash} type="tx" />
          </div>
        )}
      </div>
    </div>
  )
}
