import { Trans } from '@lingui/macro'
import { ActivityEvent } from 'components/activityEventElems/ActivityElement'
import FormattedAddress from 'components/FormattedAddress'
import { ThemeContext } from 'contexts/themeContext'
import { V1ProjectContext } from 'contexts/v1/projectContext'
import useSubgraphQuery from 'hooks/SubgraphQuery'
import { DistributeReservedTokensEvent } from 'models/subgraph-entities/v2/distribute-reserved-tokens-event'
import { useContext } from 'react'
import { formatWad, fromWad } from 'utils/format/formatNumber'
import { tokenSymbolText } from 'utils/tokenSymbolText'

export default function DistributeReservedTokensEventElem({
  event,
}: {
  event:
    | Pick<
        DistributeReservedTokensEvent,
        | 'id'
        | 'timestamp'
        | 'txHash'
        | 'caller'
        | 'beneficiary'
        | 'beneficiaryTokenCount'
        | 'tokenCount'
      >
    | undefined
}) {
  const { tokenSymbol } = useContext(V1ProjectContext)
  const {
    theme: { colors },
  } = useContext(ThemeContext)

  // Load individual DistributeToReservedTokenSplit events, emitted by internal transactions of the DistributeReservedTokens transaction
  const { data: distributeEvents } = useSubgraphQuery(
    {
      entity: 'distributeToReservedTokenSplitEvent',
      keys: [
        'id',
        'timestamp',
        'txHash',
        'beneficiary',
        'tokenCount',
        'projectId',
      ],
      orderDirection: 'desc',
      orderBy: 'tokenCount',
      where: event?.id
        ? {
            key: 'distributeReservedTokensEvent',
            value: event.id,
          }
        : undefined,
    },
    {},
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
        <div>
          {formatWad(event.tokenCount, { precision: 0 })}{' '}
          {tokenSymbolText({
            tokenSymbol,
            capitalize: false,
            plural: parseInt(fromWad(event.tokenCount) || '0') !== 1,
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
                <FormattedAddress address={e.beneficiary} />:
              </div>

              <div
                style={
                  distributeEvents.length > 1
                    ? { color: colors.text.secondary, fontSize: '0.8rem' }
                    : { fontWeight: 500 }
                }
              >
                {formatWad(e.tokenCount, { precision: 0 })}
              </div>
            </div>
          ))}

          {event.beneficiaryTokenCount?.gt(0) && (
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
                {formatWad(event.beneficiaryTokenCount, {
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
