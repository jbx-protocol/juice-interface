import CurrencySymbol from 'components/shared/CurrencySymbol'
import { FCNumber } from 'components/shared/FCNumber'
import { ProjectContext } from 'contexts/projectContext'
import { ThemeContext } from 'contexts/themeContext'
import { parseTapEventJson, TapEvent } from 'models/subgraph-entities/tap-event'
import { useContext, useEffect, useMemo, useState } from 'react'
import { formatHistoricalDate } from 'utils/formatDate'
import { formatWad } from 'utils/formatNumber'
import { querySubgraph, trimHexZero } from 'utils/graph'

import { contentLineHeight, smallHeaderStyle } from './styles'

export function TapActivity({
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
  const [tapEvents, setTapEvents] = useState<TapEvent[]>([])
  const { projectId } = useContext(ProjectContext)
  const {
    theme: { colors },
  } = useContext(ThemeContext)

  useEffect(() => {
    setLoading(true)

    querySubgraph(
      {
        entity: 'tapEvent',
        keys: ['amount', 'fundingCycleId', 'timestamp'],
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
      },
      res => {
        if (!res) return

        const newEvents = [...tapEvents]
        newEvents.push(...res.tapEvents.map(e => parseTapEventJson(e)))
        setTapEvents(newEvents)
        setLoading(false)
        setCount(newEvents.length)
      },
    )
  }, [pageNumber, pageSize, projectId])

  return useMemo(
    () => (
      <div>
        {tapEvents.map(e => (
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
                <div style={smallHeaderStyle(colors)}>Withdrew</div>
                <div
                  style={{
                    lineHeight: contentLineHeight,
                    fontSize: '1rem',
                    marginRight: 10,
                    color: colors.text.primary,
                  }}
                >
                  <CurrencySymbol currency={0} />
                  {formatWad(e.amount)}
                </div>
              </div>

              <div>
                {e.timestamp && (
                  <div
                    style={{
                      ...smallHeaderStyle(colors),
                      textAlign: 'right',
                      color: colors.text.secondary,
                    }}
                  >
                    {formatHistoricalDate(e.timestamp * 1000)}
                  </div>
                )}
                <div
                  style={{
                    ...smallHeaderStyle(colors),
                    color: colors.text.secondary,
                    textAlign: 'right',
                    marginTop: 5,
                  }}
                >
                  cycle #<FCNumber fundingCycleID={e.fundingCycleId} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    ),
    [tapEvents, colors],
  )
}
