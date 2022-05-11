import CurrencySymbol from 'components/shared/CurrencySymbol'
import FormattedAddress from 'components/shared/FormattedAddress'
import V1ProjectHandle from 'components/v1/shared/V1ProjectHandle'
import EtherscanLink from 'components/shared/EtherscanLink'

import { ThemeContext } from 'contexts/themeContext'
import useSubgraphQuery from 'hooks/SubgraphQuery'
import { TapEvent } from 'models/subgraph-entities/tap-event'
import { useContext } from 'react'
import { formatWad } from 'utils/formatNumber'

import { smallHeaderStyle } from '../styles'

export default function TapEventElem({
  tapEvent,
}: {
  tapEvent:
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

  const { data: payoutEvents } = useSubgraphQuery({
    entity: 'distributeToPayoutModEvent',
    keys: [
      'id',
      'timestamp',
      'txHash',
      'modProjectId',
      'modBeneficiary',
      'modCut',
    ],
    orderDirection: 'desc',
    orderBy: 'modCut',
    where: tapEvent?.id
      ? {
          key: 'tapEvent',
          value: tapEvent.id,
        }
      : undefined,
  })

  if (!tapEvent) return null

  return (
    <div
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
        <div style={smallHeaderStyle(colors)}>Withdrawn</div>

        <div
          style={{
            textAlign: 'right',
          }}
        >
          <div style={smallHeaderStyle(colors)}>
            <EtherscanLink
              timestamp={tapEvent.timestamp}
              value={tapEvent.txHash}
              type="tx"
            />
          </div>
          <div style={smallHeaderStyle(colors)}>
            called by <FormattedAddress address={tapEvent.caller} />
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
              fontSize: '0.8rem',
            }}
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
              <CurrencySymbol currency="ETH" />
              {formatWad(e.modCut, { precision: 4 })}
            </div>
          </div>
        ))}

        {tapEvent.beneficiaryTransferAmount?.gt(0) && (
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
              <FormattedAddress address={tapEvent.beneficiary} />:
            </div>
            <div
              style={
                payoutEvents?.length && payoutEvents.length > 1
                  ? { color: colors.text.secondary }
                  : { fontWeight: 500 }
              }
            >
              <CurrencySymbol currency="ETH" />
              {formatWad(tapEvent.beneficiaryTransferAmount, { precision: 4 })}
            </div>
          </div>
        )}
      </div>

      {payoutEvents?.length && payoutEvents.length > 1 ? (
        <div
          style={{
            color: colors.text.primary,
            fontWeight: 500,
            textAlign: 'right',
          }}
        >
          <CurrencySymbol currency="ETH" />
          {formatWad(tapEvent.netTransferAmount, { precision: 4 })}
        </div>
      ) : null}
    </div>
  )
}
