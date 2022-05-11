import FormattedAddress from 'components/shared/FormattedAddress'
import { V1ProjectContext } from 'contexts/v1/projectContext'
import EtherscanLink from 'components/shared/EtherscanLink'

import { ThemeContext } from 'contexts/themeContext'
import useSubgraphQuery from 'hooks/SubgraphQuery'
import { PrintReservesEvent } from 'models/subgraph-entities/print-reserves-event'
import { useContext } from 'react'
import { formatWad } from 'utils/formatNumber'
import { tokenSymbolText } from 'utils/tokenSymbolText'

import { smallHeaderStyle } from '../styles'

export default function ReservesEventElem({
  printReservesEvent,
}: {
  printReservesEvent:
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
  const {
    theme: { colors },
  } = useContext(ThemeContext)
  const { tokenSymbol } = useContext(V1ProjectContext)

  const { data: distributeEvents } = useSubgraphQuery(
    {
      entity: 'distributeToTicketModEvent',
      keys: ['id', 'timestamp', 'txHash', 'modBeneficiary', 'modCut'],
      orderDirection: 'desc',
      orderBy: 'modCut',
      where: printReservesEvent?.id
        ? {
            key: 'printReservesEvent',
            value: printReservesEvent.id,
          }
        : undefined,
    },
    {},
  )

  if (!printReservesEvent) return null

  return (
    <div
      key={printReservesEvent.id}
      style={{
        marginBottom: 20,
        paddingBottom: 20,
        borderBottom: '1px solid ' + colors.stroke.tertiary,
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <div style={smallHeaderStyle(colors)}>
          Distributed reserved{' '}
          {tokenSymbolText({
            tokenSymbol: tokenSymbol,
            capitalize: false,
            plural: true,
          })}
        </div>

        <div style={{ textAlign: 'right' }}>
          <div style={smallHeaderStyle(colors)}>
            <EtherscanLink
              timestamp={printReservesEvent.timestamp}
              value={printReservesEvent.txHash}
              type="tx"
            />
          </div>
          <div style={smallHeaderStyle(colors)}>
            called by <FormattedAddress address={printReservesEvent.caller} />
          </div>
        </div>
      </div>

      <div style={{ marginTop: 5 }}>
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

        {printReservesEvent.beneficiaryTicketAmount?.gt(0) && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline',
            }}
          >
            <div style={{ fontWeight: 500 }}>
              <FormattedAddress address={printReservesEvent.beneficiary} />:
            </div>
            <div style={{ color: colors.text.secondary }}>
              {formatWad(printReservesEvent.beneficiaryTicketAmount, {
                precision: 0,
              })}
            </div>
          </div>
        )}
      </div>

      {distributeEvents?.length && distributeEvents?.length > 1 ? (
        <div
          style={{
            color: colors.text.primary,
            fontWeight: 500,
            textAlign: 'right',
          }}
        >
          {formatWad(printReservesEvent.count, { precision: 0 })}
        </div>
      ) : null}
    </div>
  )
}
