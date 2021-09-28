import { LinkOutlined } from '@ant-design/icons'
import CurrencySymbol from 'components/shared/CurrencySymbol'
import FormattedAddress from 'components/shared/FormattedAddress'
import { ProjectContext } from 'contexts/projectContext'
import { ThemeContext } from 'contexts/themeContext'
import {
  parseRedeemEventJson,
  RedeemEvent,
} from 'models/subgraph-entities/redeem-event'
import { useContext, useEffect, useMemo, useState } from 'react'
import { formatHistoricalDate } from 'utils/formatDate'
import { formatWad } from 'utils/formatNumber'
import { querySubgraph } from 'utils/graph'

import { contentLineHeight, smallHeaderStyle } from './styles'

export function RedeemActivity({
  pageNumber,
  pageSize,
  setLoading,
  setCount,
}: {
  pageNumber: number
  pageSize: number
  setLoading: (loading: boolean) => void
  setCount: (count: number) => void
}) {
  const [redeemEvents, setRedeemEvents] = useState<RedeemEvent[]>([])
  const { projectId, tokenSymbol } = useContext(ProjectContext)
  const {
    theme: { colors },
  } = useContext(ThemeContext)

  useEffect(() => {
    setLoading(true)

    querySubgraph(
      {
        entity: 'redeemEvent',
        keys: [
          'amount',
          'beneficiary',
          'id',
          'returnAmount',
          'timestamp',
          'txHash',
        ],
        first: pageSize,
        skip: pageNumber * pageSize,
        orderDirection: 'desc',
        orderBy: 'timestamp',
        where: projectId
          ? {
              key: 'project',
              value: projectId.toString(),
            }
          : undefined,
      },
      res => {
        if (!res) return

        const newEvents = [...redeemEvents]
        newEvents.push(...res.redeemEvents.map(e => parseRedeemEventJson(e)))
        setRedeemEvents(newEvents)
        setLoading(false)
        setCount(newEvents.length)
      },
    )
  }, [pageNumber, pageSize, projectId])

  return useMemo(
    () => (
      <div>
        {redeemEvents.map(e => (
          <div
            style={{
              marginBottom: 20,
              paddingBottom: 20,
              borderBottom: '1px solid ' + colors.stroke.tertiary,
            }}
            key={e.id}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignContent: 'space-between',
              }}
            >
              <div>
                <div style={smallHeaderStyle(colors)}>Redeemed</div>
                <div
                  style={{
                    lineHeight: contentLineHeight,
                    fontSize: '1rem',
                  }}
                >
                  {formatWad(e.amount)} {tokenSymbol ?? 'tokens'}
                </div>
              </div>

              <div>
                <div
                  style={{
                    ...smallHeaderStyle(colors),
                    textAlign: 'right',
                  }}
                >
                  {e.timestamp && (
                    <span>{formatHistoricalDate(e.timestamp * 1000)}</span>
                  )}{' '}
                  <a
                    className="quiet"
                    href={`https://etherscan.io/tx/${e.txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <LinkOutlined />
                  </a>
                </div>
                <div
                  style={{
                    ...smallHeaderStyle(colors),
                    lineHeight: contentLineHeight,
                    textAlign: 'right',
                  }}
                >
                  <FormattedAddress address={e.beneficiary} />
                </div>
              </div>
            </div>

            <div style={{ color: colors.text.secondary }}>
              <CurrencySymbol currency={0} />
              {formatWad(e.returnAmount)} overflow received
            </div>
          </div>
        ))}
      </div>
    ),
    [redeemEvents, colors, tokenSymbol],
  )
}
