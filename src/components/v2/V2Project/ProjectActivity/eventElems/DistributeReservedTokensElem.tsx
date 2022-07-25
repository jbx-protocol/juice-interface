import { Trans } from '@lingui/macro'
import {
  contentLineHeight,
  primaryContentFontSize,
  smallHeaderStyle,
} from 'components/activityEventElems/styles'
import EtherscanLink from 'components/EtherscanLink'
import FormattedAddress from 'components/FormattedAddress'
import { ThemeContext } from 'contexts/themeContext'
import { V1ProjectContext } from 'contexts/v1/projectContext'
import useSubgraphQuery from 'hooks/SubgraphQuery'
import { DistributeReservedTokensEvent } from 'models/subgraph-entities/v2/distribute-reserved-tokens-event'
import { useContext } from 'react'
import { formatHistoricalDate } from 'utils/formatDate'
import { formatWad } from 'utils/formatNumber'
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
  const {
    theme: { colors },
  } = useContext(ThemeContext)
  const { tokenSymbol } = useContext(V1ProjectContext)

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
                lineHeight: contentLineHeight,
                fontSize: primaryContentFontSize,
              }}
            >
              {formatWad(event.tokenCount, { precision: 0 })}{' '}
              {tokenSymbolText({
                tokenSymbol: tokenSymbol,
                capitalize: false,
                plural: true,
              })}
            </div>
          ) : null}
        </div>

        <div>
          <div style={{ ...smallHeaderStyle(colors), textAlign: 'right' }}>
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
    </div>
  )
}
