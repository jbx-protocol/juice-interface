import EtherscanLink from 'components/EtherscanLink'
import FormattedAddress from 'components/FormattedAddress'

import { ThemeContext } from 'contexts/themeContext'
import useSubgraphQuery from 'hooks/SubgraphQuery'
import { useContext } from 'react'
import { formatHistoricalDate } from 'utils/format/formatDate'

import { Trans } from '@lingui/macro'
import {
  contentLineHeight,
  primaryContentFontSize,
  smallHeaderStyle,
} from 'components/activityEventElems/styles'
import ETHAmount from 'components/currency/ETHAmount'
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
        | 'beneficiaryDistributionAmount'
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
    keys: [
      'id',
      'timestamp',
      'txHash',
      'amount',
      'beneficiary',
      'splitProjectId',
    ],
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
          alignContent: 'space-between',
        }}
      >
        <div>
          <div style={smallHeaderStyle(colors)}>
            <Trans>Distributed funds</Trans>
          </div>
          {distributePayoutsEvents?.length ? (
            <div
              style={{
                lineHeight: contentLineHeight,
                fontSize: primaryContentFontSize,
              }}
            >
              <ETHAmount amount={event.distributedAmount} />
            </div>
          ) : null}
        </div>

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
            <Trans>
              called by <FormattedAddress address={event.caller} />
            </Trans>
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
              {e.splitProjectId ? (
                <span>Project {e.splitProjectId}</span>
              ) : (
                <FormattedAddress address={e.beneficiary} />
              )}
              :
            </div>

            <div style={{ color: colors.text.secondary }}>
              <ETHAmount amount={e.amount} />
            </div>
          </div>
        ))}

        {event.beneficiaryDistributionAmount?.gt(0) && (
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
              <ETHAmount amount={event.beneficiaryDistributionAmount} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
