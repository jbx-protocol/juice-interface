import axios, { AxiosResponse } from 'axios'
import CurrencySymbol from 'components/shared/CurrencySymbol'
import FormattedAddress from 'components/shared/FormattedAddress'
import { subgraphUrl } from 'constants/subgraphs'
import { ProjectContext } from 'contexts/projectContext'
import { ThemeContext } from 'contexts/themeContext'
import {
  parseRedeemEventJson,
  RedeemEvent,
  RedeemEventJson,
} from 'models/subgraph-entities/redeem-event'
import { useContext, useEffect, useMemo, useState } from 'react'
import { formatHistoricalDate } from 'utils/formatDate'
import { formatWad } from 'utils/formatNumber'
import { formatGraphQuery, trimHexZero } from 'utils/graph'

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
    console.log('asdf load redeem')
    setLoading(true)

    axios
      .post(
        subgraphUrl,
        {
          query: formatGraphQuery({
            entity: 'redeemEvent',
            keys: ['amount', 'beneficiary', 'id', 'returnAmount', 'timestamp'],
            first: pageSize,
            skip: pageNumber * pageSize,
            orderDirection: 'desc',
            orderBy: 'timestamp',
            where: projectId
              ? {
                  key: 'project',
                  value: trimHexZero(projectId.toHexString()),
                }
              : undefined,
          }),
        },
        { headers: { 'Content-Type': 'application/json' } },
      )
      .then(
        (res: AxiosResponse<{ data: { redeemEvents: RedeemEventJson[] } }>) => {
          const newEvents = [...redeemEvents]
          newEvents.push(
            ...res.data?.data?.redeemEvents.map(e => parseRedeemEventJson(e)),
          )
          setRedeemEvents(newEvents)
          setLoading(false)
          setCount(newEvents.length)
        },
      )
      .catch(err => {
        console.log('Error getting redeem events', err)
        setLoading(false)
      })
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
                    marginRight: 10,
                    color: colors.text.primary,
                  }}
                >
                  {formatWad(e.amount)} {tokenSymbol ?? 'tokens'}
                </div>
              </div>

              <div>
                {e.timestamp && (
                  <div
                    style={{
                      ...smallHeaderStyle,
                      textAlign: 'right',
                      color: colors.text.secondary,
                    }}
                  >
                    {formatHistoricalDate(e.timestamp * 1000)}
                  </div>
                )}
                <div
                  style={{
                    ...smallHeaderStyle,
                    color: colors.text.secondary,
                    marginTop: '.3rem',
                    lineHeight: contentLineHeight,
                    textAlign: 'right',
                  }}
                >
                  <FormattedAddress address={e.beneficiary} />
                </div>
              </div>
            </div>

            <div
              style={{
                ...smallHeaderStyle,
                color: colors.text.secondary,
                marginTop: 5,
              }}
            >
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
