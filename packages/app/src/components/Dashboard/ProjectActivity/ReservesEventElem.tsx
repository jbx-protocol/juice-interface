import { LinkOutlined } from '@ant-design/icons'
import FormattedAddress from 'components/shared/FormattedAddress'
import { ThemeContext } from 'contexts/themeContext'
import {
  DistributeToTicketModEvent,
  parseDistributeToTicketModEvent,
} from 'models/subgraph-entities/distribute-to-ticket-mod-event'
import { PrintReservesEvent } from 'models/subgraph-entities/print-reserves-event'
import { useContext, useEffect, useState } from 'react'
import { formatHistoricalDate } from 'utils/formatDate'
import { formatWad } from 'utils/formatNumber'
import { querySubgraph } from 'utils/graph'

import { smallHeaderStyle } from '../styles'
import { ProjectContext } from 'contexts/projectContext'

export default function ReservesEventElem({
  printReservesEvent,
}: {
  printReservesEvent: PrintReservesEvent | undefined
}) {
  const [distributeEvents, setDistributeEvents] =
    useState<DistributeToTicketModEvent[]>()
  const {
    theme: { colors },
  } = useContext(ThemeContext)
  const { tokenSymbol } = useContext(ProjectContext)

  useEffect(() => {
    querySubgraph(
      {
        entity: 'distributeToTicketModEvent',
        keys: ['timestamp', 'txHash', 'modBeneficiary', 'modCut'],
        orderDirection: 'desc',
        orderBy: 'modCut',
        where: printReservesEvent?.id
          ? {
              key: 'printReservesEvent',
              value: printReservesEvent.id,
            }
          : undefined,
      },
      res => {
        if (!res) return

        setDistributeEvents(
          res.distributeToTicketModEvents.map(e =>
            parseDistributeToTicketModEvent(e),
          ),
        )
      },
    )
  }, [printReservesEvent])

  if (!printReservesEvent) return null

  return (
    <div
      style={{
        marginBottom: 20,
        paddingBottom: 20,
        borderBottom: '1px solid ' + colors.stroke.tertiary,
      }}
      key={printReservesEvent.id}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <div style={smallHeaderStyle(colors)}>
          Distributed reserved {tokenSymbol ?? 'tokens'}
        </div>

        <div
          style={{
            ...smallHeaderStyle(colors),
            color: colors.text.secondary,
          }}
        >
          {printReservesEvent.timestamp && (
            <span>
              {formatHistoricalDate(printReservesEvent.timestamp * 1000)}
            </span>
          )}{' '}
          <a
            className="quiet"
            href={`https://etherscan.io/tx/${printReservesEvent.txHash}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <LinkOutlined />
          </a>
        </div>
      </div>

      <div style={{ marginTop: 5 }}>
        {distributeEvents?.map(e => (
          <div
            key={e.modBeneficiary + (e.modPercent?.toString() ?? '')}
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
              {formatWad(e.modCut, { decimals: 0 })}
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
                decimals: 0,
              })}
            </div>
          </div>
        )}
      </div>

      {distributeEvents?.length && distributeEvents?.length > 1 && (
        <div
          style={{
            color: colors.text.primary,
            fontWeight: 500,
            textAlign: 'right',
          }}
        >
          {formatWad(printReservesEvent.count, { decimals: 0 })}
        </div>
      )}
    </div>
  )
}
