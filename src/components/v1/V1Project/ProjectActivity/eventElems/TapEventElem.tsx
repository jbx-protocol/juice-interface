import EtherscanLink from 'components/EtherscanLink'
import FormattedAddress from 'components/FormattedAddress'
import V1ProjectHandle from 'components/v1/shared/V1ProjectHandle'

import useSubgraphQuery from 'hooks/SubgraphQuery'
import { TapEvent } from 'models/subgraph-entities/v1/tap-event'
import { formatHistoricalDate } from 'utils/format/formatDate'

import { Trans } from '@lingui/macro'
import ETHAmount from 'components/currency/ETHAmount'
import { classNames } from 'utils/classNames'

export default function TapEventElem({
  event,
}: {
  event:
    | Pick<
        TapEvent,
        | 'id'
        | 'timestamp'
        | 'txHash'
        | 'caller'
        | 'beneficiary'
        | 'beneficiaryTransferAmount'
        | 'netTransferAmount'
      >
    | undefined
}) {
  const { data: payoutEvents } = useSubgraphQuery(
    event?.id
      ? {
          entity: 'distributeToPayoutModEvent',
          keys: [
            'id',
            'timestamp',
            'txHash',
            'modProjectId',
            'modBeneficiary',
            'modCut',
            {
              entity: 'tapEvent',
              keys: ['id'],
            },
          ],
          orderDirection: 'desc',
          orderBy: 'modCut',
          where: {
            key: 'tapEvent',
            value: event.id,
          },
        }
      : null,
  )

  if (!event) return null

  return (
    <div>
      <div className="flex content-between justify-between">
        <div>
          <div className="text-xs text-grey-400 dark:text-slate-200">
            <Trans>Distributed funds</Trans>
          </div>
          {payoutEvents?.length ? (
            <div className="font-medium text-black dark:text-slate-100">
              <ETHAmount amount={event.netTransferAmount} />
            </div>
          ) : null}
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
        {payoutEvents?.map(e => (
          <div
            className="flex content-between items-baseline text-sm"
            key={e.id}
          >
            <div className="font-medium">
              {e.modProjectId?.gt(0) ? (
                <span>
                  <V1ProjectHandle projectId={e.modProjectId} />
                </span>
              ) : (
                <FormattedAddress address={e.modBeneficiary} />
              )}
              :
            </div>

            <div className="text-grey-500 dark:text-grey-300">
              <ETHAmount amount={e.modCut} />
            </div>
          </div>
        ))}

        {event.beneficiaryTransferAmount?.gt(0) && (
          <div
            className={classNames(
              'flex items-baseline justify-between',
              payoutEvents?.length && payoutEvents.length > 1 ? 'text-sm' : '',
            )}
          >
            <div className="font-medium">
              <FormattedAddress address={event.beneficiary} />:
            </div>
            <div
              className={classNames(
                payoutEvents?.length && payoutEvents.length > 1
                  ? 'text-grey-500 dark:text-grey-300'
                  : 'font-medium',
              )}
            >
              <ETHAmount amount={event.beneficiaryTransferAmount} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
