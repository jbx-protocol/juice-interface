import { Trans } from '@lingui/macro'
import EtherscanLink from 'components/EtherscanLink'
import FormattedAddress from 'components/FormattedAddress'
import { V1ProjectContext } from 'contexts/v1/projectContext'
import useSubgraphQuery from 'hooks/SubgraphQuery'
import { PrintReservesEvent } from 'models/subgraph-entities/v1/print-reserves-event'
import { useContext } from 'react'
import { classNames } from 'utils/classNames'
import { formatHistoricalDate } from 'utils/format/formatDate'
import { formatWad, fromWad } from 'utils/format/formatNumber'
import { tokenSymbolText } from 'utils/tokenSymbolText'

export default function ReservesEventElem({
  event,
}: {
  event:
    | Pick<
        PrintReservesEvent,
        | 'id'
        | 'timestamp'
        | 'txHash'
        | 'caller'
        | 'beneficiary'
        | 'beneficiaryTicketAmount'
        | 'count'
      >
    | undefined
}) {
  const { tokenSymbol } = useContext(V1ProjectContext)

  const { data: distributeEvents } = useSubgraphQuery(
    event?.id
      ? {
          entity: 'distributeToTicketModEvent',
          keys: ['id', 'timestamp', 'txHash', 'modBeneficiary', 'modCut'],
          orderDirection: 'desc',
          orderBy: 'modCut',
          where: {
            key: 'printReservesEvent',
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
            <Trans>
              Distributed reserved{' '}
              {tokenSymbolText({
                tokenSymbol,
                capitalize: false,
                plural: true,
              })}
            </Trans>
          </div>
          {distributeEvents?.length ? (
            <div className="font-medium text-black dark:text-slate-100">
              {formatWad(event.count, { precision: 0 })}{' '}
              {tokenSymbolText({
                tokenSymbol,
                capitalize: false,
                plural: parseInt(fromWad(event.count) || '0') !== 1,
              })}
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
        {distributeEvents?.map(e => (
          <div className="flex items-baseline justify-between" key={e.id}>
            <div className="text-sm font-medium">
              <FormattedAddress address={e.modBeneficiary} />:
            </div>

            <div
              className={classNames(
                distributeEvents.length > 1
                  ? 'text-sm text-grey-500 dark:text-grey-300'
                  : 'font-medium',
              )}
            >
              {formatWad(e.modCut, { precision: 0 })}
            </div>
          </div>
        ))}

        {event.beneficiaryTicketAmount?.gt(0) && (
          <div className="flex items-baseline justify-between">
            <div className="font-medium">
              <FormattedAddress address={event.beneficiary} />:
            </div>
            <div className="text-grey-500 dark:text-grey-300">
              {formatWad(event.beneficiaryTicketAmount, {
                precision: 0,
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
