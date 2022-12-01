import { Trans } from '@lingui/macro'
import EtherscanLink from 'components/EtherscanLink'
import FormattedAddress from 'components/FormattedAddress'
import RichNote from 'components/RichNote'
import { DeployETHERC20ProjectPayerEvent } from 'models/subgraph-entities/v2/deploy-eth-erc20-project-payer-event'
import { formatHistoricalDate } from 'utils/format/formatDate'

export default function DeployETHERC20ProjectPayerEventElem({
  event,
}: {
  event:
    | Pick<
        DeployETHERC20ProjectPayerEvent,
        'id' | 'timestamp' | 'txHash' | 'caller' | 'address' | 'memo'
      >
    | undefined
}) {
  if (!event) return null

  return (
    <div>
      <div className="flex justify-between">
        <div className="text-xs text-grey-400 dark:text-slate-200">
          <Trans>Created Payment Address</Trans>
        </div>

        <div className="text-right">
          <div className="text-xs text-grey-400 dark:text-slate-200">
            {event.timestamp && (
              <span>{formatHistoricalDate(event.timestamp * 1000)}</span>
            )}{' '}
            <EtherscanLink value={event.txHash} type="tx" />
          </div>
          <div className="text-xs text-grey-400 dark:text-slate-200">
            <Trans>
              called by <FormattedAddress address={event.caller} />
            </Trans>
          </div>
        </div>
      </div>

      <div className="mt-1">
        <Trans>
          Address: <FormattedAddress address={event.address} />
        </Trans>
      </div>

      {event.memo && (
        <div className="mt-1">
          <RichNote note={event.memo} />
        </div>
      )}
    </div>
  )
}
