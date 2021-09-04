import { LinkOutlined } from '@ant-design/icons'
import CurrencySymbol from 'components/shared/CurrencySymbol'
import FormattedAddress from 'components/shared/FormattedAddress'
import ProjectHandle from 'components/shared/ProjectHandle'
import { ThemeContext } from 'contexts/themeContext'
import {
  DistributeToPayoutModEvent,
  parseDistributeToPayoutModEvent,
} from 'models/subgraph-entities/distribute-to-payout-mod-event copy'
import { TapEvent } from 'models/subgraph-entities/tap-event'
import { useContext, useEffect, useState } from 'react'
import { formatHistoricalDate } from 'utils/formatDate'
import { formatWad } from 'utils/formatNumber'
import { querySubgraph } from 'utils/graph'

import { smallHeaderStyle } from '../styles'

export default function TapEventElem({
  tapEvent,
}: {
  tapEvent: TapEvent | undefined
}) {
  const [payoutEvents, setPayoutEvents] =
    useState<DistributeToPayoutModEvent[]>()
  const {
    theme: { colors },
  } = useContext(ThemeContext)

  useEffect(() => {
    querySubgraph(
      {
        entity: 'distributeToPayoutModEvent',
        keys: [
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
      },
      res => {
        if (!res) return

        setPayoutEvents(
          res.distributeToPayoutModEvents.map(e =>
            parseDistributeToPayoutModEvent(e),
          ),
        )
      },
    )
  }, [tapEvent])

  if (!tapEvent) return null

  return (
    <div
      style={{
        marginBottom: 20,
        paddingBottom: 20,
        borderBottom: '1px solid ' + colors.stroke.tertiary,
      }}
      key={tapEvent.id}
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
            ...smallHeaderStyle(colors),
            color: colors.text.secondary,
          }}
        >
          {tapEvent.timestamp && (
            <span>{formatHistoricalDate(tapEvent.timestamp * 1000)}</span>
          )}{' '}
          <a
            className="quiet"
            href={`https://etherscan.io/tx/${tapEvent.txHash}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <LinkOutlined />
          </a>
        </div>
      </div>

      <div style={{ marginTop: 5 }}>
        {payoutEvents?.map(e => (
          <div
            key={
              e.modBeneficiary +
              (e.modProjectId?.toString() ?? '') +
              (e.modPercent?.toString() ?? '')
            }
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline',
            }}
          >
            <div style={{ fontSize: '0.8rem', fontWeight: 500 }}>
              {e.modProjectId?.gt(0) ? (
                <span>
                  <ProjectHandle link projectId={e.modProjectId} />
                </span>
              ) : (
                <FormattedAddress address={e.modBeneficiary} />
              )}
              :
            </div>

            <div
              style={
                payoutEvents?.length && payoutEvents.length > 1
                  ? { color: colors.text.secondary, fontSize: '0.8rem' }
                  : { fontWeight: 500 }
              }
            >
              <CurrencySymbol currency={0} />
              {formatWad(e.modCut, { padEnd: 6 })}
            </div>
          </div>
        ))}

        {tapEvent.beneficiaryTransferAmount?.gt(0) && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline',
            }}
          >
            <div style={{ fontWeight: 500 }}>
              <FormattedAddress address={tapEvent.beneficiary} />:
            </div>
            <div style={{ color: colors.text.secondary }}>
              <CurrencySymbol currency={0} />
              {formatWad(tapEvent.beneficiaryTransferAmount, { padEnd: 6 })}
            </div>
          </div>
        )}
      </div>

      {payoutEvents?.length && payoutEvents.length > 1 && (
        <div
          style={{
            color: colors.text.primary,
            fontWeight: 500,
            textAlign: 'right',
          }}
        >
          <CurrencySymbol currency={0} />
          {formatWad(tapEvent.netTransferAmount)}
        </div>
      )}
    </div>
  )
}
