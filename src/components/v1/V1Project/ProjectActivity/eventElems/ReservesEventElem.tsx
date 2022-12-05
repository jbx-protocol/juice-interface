import { Trans } from '@lingui/macro'
import { ActivityEvent } from 'components/activityEventElems/ActivityElement'
import FormattedAddress from 'components/FormattedAddress'
import { ThemeContext } from 'contexts/themeContext'
import { V1ProjectContext } from 'contexts/v1/projectContext'
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
        | 'caller'
        | 'beneficiary'
        | 'beneficiaryTicketAmount'
        | 'count'
      >
    | undefined
}) {
  const { tokenSymbol } = useContext(V1ProjectContext)
  const {
    theme: { colors },
  } = useContext(ThemeContext)

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
          Distributed reserved{' '}
          {tokenSymbolText({
            tokenSymbol,
            capitalize: false,
            plural: true,
          })}
        </Trans>
      }
      subject={
        <div className="font-medium text-black dark:text-slate-100">
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
            >
              <div style={{ fontWeight: 500, fontSize: '0.8rem' }}>
                <FormattedAddress address={e.modBeneficiary} />:
              </div>

              <div
                style={
                  distributeEvents.length > 1
                    ? { color: colors.text.secondary, fontSize: '0.8rem' }
                    : { fontWeight: 500 }
                }
              >
                {formatWad(e.modCut, { precision: 0 })}
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
            >
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
      }
    />
  )
}
