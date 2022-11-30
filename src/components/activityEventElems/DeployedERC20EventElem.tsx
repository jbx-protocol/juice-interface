import { Trans } from '@lingui/macro'
import EtherscanLink from 'components/EtherscanLink'
import { DeployedERC20Event } from 'models/subgraph-entities/vX/deployed-erc20-event'
import { formatHistoricalDate } from 'utils/format/formatDate'

export default function DeployedERC20EventElem({
  event,
}: {
  event:
    | Pick<DeployedERC20Event, 'symbol' | 'id' | 'timestamp' | 'txHash'>
    | undefined
}) {
  if (!event) return null

  return (
    <div className="flex content-between justify-between">
      <div>
        <div className="text-xs text-grey-400 dark:text-slate-200">
          <Trans>Deployed ERC20 token</Trans>
        </div>
        <div className="text-base">{event.symbol}</div>
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
