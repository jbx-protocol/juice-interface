import { Trans } from '@lingui/macro'
import { smallHeaderStyle } from 'components/activityEventElems/styles'
import EtherscanLink from 'components/EtherscanLink'
import FormattedAddress from 'components/FormattedAddress'
import { ThemeContext } from 'contexts/themeContext'
import { V1ProjectContext } from 'contexts/v1/projectContext'
import useSubgraphQuery from 'hooks/SubgraphQuery'
import { PrintReservesEvent } from 'models/subgraph-entities/v1/print-reserves-event'
import { useContext } from 'react'
import { formatHistoricalDate } from 'utils/formatDate'
import { formatWad, fromWad } from 'utils/formatNumber'
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
  const {
    theme: { colors },
  } = useContext(ThemeContext)
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
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignContent: 'space-between',
        }}
      >
        <div>
          <div style={smallHeaderStyle(colors)}>
            <Trans>
              Distributed reserved{' '}
              {tokenSymbolText({
                tokenSymbol: tokenSymbol,
                capitalize: false,
                plural: true,
              })}
            </Trans>
          </div>
          {distributeEvents?.length ? (
            <div
              style={{
                color: colors.text.primary,
                fontWeight: 500,
              }}
            >
              {formatWad(event.count, { precision: 0 })}{' '}
              {tokenSymbolText({
                tokenSymbol: tokenSymbol,
                capitalize: false,
                plural: parseInt(fromWad(event.count) || '0') !== 1,
              })}
            </div>
          ) : null}
        </div>

        <div style={{ textAlign: 'right' }}>
          <div style={smallHeaderStyle(colors)}>
            {event.timestamp && (
              <span>{formatHistoricalDate(event.timestamp * 1000)}</span>
            )}{' '}
            <EtherscanLink value={event.txHash} type="tx" />
          </div>
          <div style={smallHeaderStyle(colors)}>
            <Trans>
              called by <FormattedAddress address={event.caller} />
            </Trans>
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

        {event.beneficiaryTicketAmount?.gt(0) && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline',
            }}
          >
            <div style={{ fontWeight: 500 }}>
              <FormattedAddress address={event.beneficiary} />:
            </div>
            <div style={{ color: colors.text.secondary }}>
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
