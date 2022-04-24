import CurrencySymbol from 'components/shared/CurrencySymbol'
import FormattedAddress from 'components/shared/FormattedAddress'
import V1ProjectHandle from 'components/v1/shared/V1ProjectHandle'
import EtherscanLink from 'components/shared/EtherscanLink'

import { ThemeContext } from 'contexts/themeContext'
import useSubgraphQuery from 'hooks/SubgraphQuery'
import { useContext } from 'react'
import { formatHistoricalDate } from 'utils/formatDate'
import { formatWad } from 'utils/formatNumber'

import { Trans } from '@lingui/macro'
import { smallHeaderStyle } from 'components/shared/activityEventElems/styles'
import { DistributePayoutsEvent } from 'models/subgraph-entities/v2/distribute-payouts-event'

export default function DistributePayoutsElem({
  event,
}: {
  event:
    | Pick<
        DistributePayoutsEvent,
        | 'id'
        | 'timestamp'
        | 'txHash'
        | 'caller'
        | 'beneficiary'
        | 'distributedAmount'
        | 'memo'
      >
    | undefined
}) {
  const {
    theme: { colors },
  } = useContext(ThemeContext)

  const { data: distributePayoutsEvents } = useSubgraphQuery({
    entity: 'distributeToPayoutSplitEvent',
    keys: ['id', 'timestamp', 'txHash', 'amount', 'beneficiary', 'projectId'],
    orderDirection: 'desc',
    orderBy: 'amount',
    where: event?.id
      ? {
          key: 'distributePayoutsEvent',
          value: event.id,
        }
      : undefined,
  })

  if (!event) return null

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <div style={smallHeaderStyle(colors)}>Distributed funds</div>

        <div
          style={{
            textAlign: 'right',
          }}
        >
          <div style={smallHeaderStyle(colors)}>
            {event.timestamp && (
              <span>{formatHistoricalDate(event.timestamp * 1000)}</span>
            )}{' '}
            <EtherscanLink value={event.txHash} type="tx" />
          </div>
          <div style={smallHeaderStyle(colors)}>
            <Trans>called by</Trans> <FormattedAddress address={event.caller} />
          </div>
        </div>
      </div>

      <div style={{ marginTop: 5 }}>
        {distributePayoutsEvents?.map(e => (
          <div
            key={e.id}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline',
              fontSize: '0.8rem',
            }}
          >
            <div style={{ fontWeight: 500 }}>
              {e.projectId ? (
                <span>
                  <V1ProjectHandle projectId={e.projectId} />
                </span>
              ) : (
                <FormattedAddress address={e.beneficiary} />
              )}
              :
            </div>

            <div style={{ color: colors.text.secondary }}>
              <CurrencySymbol currency="ETH" />
              {formatWad(e.amount, { precision: 4 })}
            </div>
          </div>
        ))}

        {event.distributedAmount?.gt(0) && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline',
              fontSize: distributePayoutsEvents?.length ? '0.8rem' : undefined,
            }}
          >
            <div style={{ fontWeight: 500 }}>
              <FormattedAddress address={event.beneficiary} />:
            </div>
            <div
              style={
                distributePayoutsEvents?.length
                  ? { color: colors.text.secondary }
                  : { fontWeight: 500 }
              }
            >
              <CurrencySymbol currency="ETH" />
              {formatWad(event.distributedAmount, { precision: 4 })}
            </div>
          </div>
        )}
      </div>

      {distributePayoutsEvents?.length ? (
        <div
          style={{
            color: colors.text.primary,
            fontWeight: 500,
            textAlign: 'right',
          }}
        >
          <CurrencySymbol currency="ETH" />
          {formatWad(event.distributedAmount, { precision: 4 })}
        </div>
      ) : null}
    </div>
  )
}
