import EtherscanLink from 'components/EtherscanLink'
import FormattedAddress from 'components/FormattedAddress'
import V1ProjectHandle from 'components/v1/shared/V1ProjectHandle'

import { ThemeContext } from 'contexts/themeContext'
import useSubgraphQuery from 'hooks/SubgraphQuery'
import { TapEvent } from 'models/subgraph-entities/v1/tap-event'
import { useContext } from 'react'
import { formatHistoricalDate } from 'utils/formatDate'

import { Trans } from '@lingui/macro'
import { smallHeaderStyle } from 'components/activityEventElems/styles'
import ETHAmount from 'components/currency/ETHAmount'

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
  const {
    theme: { colors },
  } = useContext(ThemeContext)

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
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignContent: 'space-between',
        }}
      >
        <div>
          <div style={smallHeaderStyle(colors)} className="text-xs">
            <Trans>Distributed funds</Trans>
          </div>
          {payoutEvents?.length ? (
            <div
              style={{
                color: colors.text.primary,
                fontWeight: 500,
              }}
            >
              <ETHAmount amount={event.netTransferAmount} />
            </div>
          ) : null}
        </div>

        <div
          style={{
            textAlign: 'right',
          }}
        >
          <div style={smallHeaderStyle(colors)} className="text-xs">
            {event.timestamp && (
              <span>{formatHistoricalDate(event.timestamp * 1000)}</span>
            )}{' '}
            <EtherscanLink value={event.txHash} type="tx" />
          </div>
          <div style={smallHeaderStyle(colors)} className="text-xs">
            <Trans>
              called by <FormattedAddress address={event.caller} />
            </Trans>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 5 }}>
        {payoutEvents?.map(e => (
          <div
            key={e.id}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline',
            }}
            className="text-xs"
          >
            <div style={{ fontWeight: 500 }}>
              {e.modProjectId?.gt(0) ? (
                <span>
                  <V1ProjectHandle projectId={e.modProjectId} />
                </span>
              ) : (
                <FormattedAddress address={e.modBeneficiary} />
              )}
              :
            </div>

            <div style={{ color: colors.text.secondary }}>
              <ETHAmount amount={e.modCut} />
            </div>
          </div>
        ))}

        {event.beneficiaryTransferAmount?.gt(0) && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline',
              fontSize:
                payoutEvents?.length && payoutEvents.length > 1
                  ? '0.8rem'
                  : undefined,
            }}
          >
            <div style={{ fontWeight: 500 }}>
              <FormattedAddress address={event.beneficiary} />:
            </div>
            <div
              style={
                payoutEvents?.length && payoutEvents.length > 1
                  ? { color: colors.text.secondary }
                  : { fontWeight: 500 }
              }
            >
              <ETHAmount amount={event.beneficiaryTransferAmount} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
