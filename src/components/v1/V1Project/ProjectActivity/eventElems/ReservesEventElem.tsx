import { Trans } from '@lingui/macro'
import { ActivityEvent } from 'components/activityEventElems/ActivityElement'
import EthereumAddress from 'components/EthereumAddress'
import { V1ProjectContext } from 'contexts/v1/Project/V1ProjectContext'
import useSubgraphQuery from 'hooks/SubgraphQuery'
import { PrintReservesEvent } from 'models/subgraph-entities/v1/print-reserves-event'
import { useContext } from 'react'
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
        | 'from'
        | 'beneficiary'
        | 'beneficiaryTicketAmount'
        | 'count'
      >
    | undefined
}) {
  const { tokenSymbol } = useContext(V1ProjectContext)

  // Load individual DistributeToTicketMod events, emitted by internal transactions of the PrintReserves transaction
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
    <ActivityEvent
      event={event}
      header={
        <Trans>
          Sent reserved{' '}
          {tokenSymbolText({
            tokenSymbol,
            capitalize: false,
            plural: true,
          })}
        </Trans>
      }
      subject={
        <div className="text-base font-medium text-grey-900 dark:text-slate-100">
          {formatWad(event.count, { precision: 0 })}{' '}
          {tokenSymbolText({
            tokenSymbol,
            capitalize: false,
            plural: parseInt(fromWad(event.count) || '0') !== 1,
          })}
        </div>
      }
      extra={
        <div>
          {distributeEvents?.map(e => (
            <div
              key={e.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
              }}
              className="text-sm"
            >
              <div>
                <EthereumAddress
                  className="text-grey-900 dark:text-slate-100"
                  address={e.modBeneficiary}
                />
                :
              </div>
              <div className="text-grey-500 dark:text-grey-300">
                {formatWad(e.modCut, { precision: 0 })}{' '}
                {tokenSymbolText({
                  tokenSymbol,
                  capitalize: false,
                  plural: true,
                })}
              </div>
            </div>
          ))}

          {event.beneficiaryTicketAmount?.gt(0) && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
              }}
              className="text-sm"
            >
              <div>
                <EthereumAddress
                  className="text-grey-900 dark:text-slate-100"
                  address={event.beneficiary}
                />
                :
              </div>
              <div className="text-grey-500 dark:text-grey-300">
                {formatWad(event.beneficiaryTicketAmount, {
                  precision: 0,
                })}{' '}
                {tokenSymbolText({
                  tokenSymbol,
                  capitalize: false,
                  plural: true,
                })}
              </div>
            </div>
          )}
        </div>
      }
    />
  )
}
