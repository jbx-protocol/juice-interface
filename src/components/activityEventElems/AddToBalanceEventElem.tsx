import { Trans } from '@lingui/macro'
import ETHAmount from 'components/currency/ETHAmount'
import EtherscanLink from 'components/EtherscanLink'
import FormattedAddress from 'components/FormattedAddress'
import RichNote from 'components/RichNote'
import { AddToBalanceEvent } from 'models/subgraph-entities/vX/add-to-balance-event'
import { formatHistoricalDate } from 'utils/format/formatDate'

export default function AddToBalanceEventElem({
  event,
}: {
  event:
    | Pick<
        AddToBalanceEvent,
        'amount' | 'timestamp' | 'caller' | 'note' | 'id' | 'txHash'
      >
    | undefined
}) {
  if (!event) return null

  return (
    <div>
      <div className="flex content-between justify-between">
        <div>
          <div className="text-xs text-grey-400 dark:text-slate-200">
            <Trans>Added to balance</Trans>
          </div>
          <div className="text-base">
            <ETHAmount amount={event.amount} />
          </div>
        </div>

        <div className="text-right">
          {event.timestamp && (
            <div className="text-xs text-grey-400 dark:text-slate-200">
              {formatHistoricalDate(event.timestamp * 1000)}{' '}
              <EtherscanLink value={event.txHash} type="tx" />
            </div>
          )}
          <FormattedAddress
            className="text-xs font-normal leading-6 text-grey-400 dark:text-slate-200"
            address={event.caller}
          />
        </div>
      </div>

      {
        <div className="mt-1">
          <RichNote
            className="text-grey-900 dark:text-slate-100"
            note={event.note ?? ''}
          />
        </div>
      }
    </div>
  )
}
