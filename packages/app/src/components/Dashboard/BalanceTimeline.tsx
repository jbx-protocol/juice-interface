import { Select } from 'antd'
import CurrencySymbol from 'components/shared/CurrencySymbol'
import Loading from 'components/shared/Loading'
import { readProvider } from 'constants/readProvider'
import { ProjectContext } from 'contexts/projectContext'
import { ThemeContext } from 'contexts/themeContext'
import EthDater from 'ethereum-block-by-date'
import { parseProjectJson } from 'models/subgraph-entities/project'
import { parseTapEventJson } from 'models/subgraph-entities/tap-event'
import moment from 'moment'
import {
  CSSProperties,
  SVGProps,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { fromWad } from 'utils/formatNumber'
import { querySubgraph, trimHexZero } from 'utils/graph'

const now = moment.now() - 5 * 60 * 1000 // 5 min ago

const daysToMillis = (days: number) => days * 24 * 60 * 60 * 1000

type Duration = 1 | 7 | 30 | 90 | 365
type EventRef = {
  timestamp: number
  balance?: number
  tapped?: number
  previousBalance?: number
}
type BlockRef = { block: number; timestamp: number }

export default function BalanceTimeline({ height }: { height: number }) {
  const [events, setEvents] = useState<EventRef[]>([])
  const [blockRefs, setBlockRefs] = useState<BlockRef[]>([])
  const [loading, setLoading] = useState<boolean>()
  const [domain, setDomain] = useState<[number, number]>()
  const [duration, setDuration] = useState<Duration>(30)
  const { projectId } = useContext(ProjectContext)
  const {
    theme: { colors },
  } = useContext(ThemeContext)

  const dateStringForBlockTime = (timestamp: number) =>
    moment(timestamp * 1000).format(duration > 1 ? 'M/DD' : 'h:mma')

  // Get references to timestamp of blocks in interval
  useEffect(() => {
    if (!duration) return

    setLoading(true)
    setEvents([])
    setDomain(undefined)

    // Get number of most recent block, and block at start of duration window
    new EthDater(readProvider)
      .getEvery(
        'days',
        moment(now - daysToMillis(duration)).toISOString(),
        moment(now).toISOString(),
        duration,
        false,
      )
      .then((res: BlockRef[]) => {
        const newBlockRefs: BlockRef[] = [res[0]]
        const blocksCount = 40

        // Create mock block history data assuming consistent mining intervals
        for (let i = 0; i < blocksCount; i++) {
          newBlockRefs.push({
            block: Math.round(
              ((res[1].block - res[0].block) / blocksCount) * i + res[0].block,
            ),
            timestamp: Math.round(
              ((res[1].timestamp - res[0].timestamp) / blocksCount) * i +
                res[0].timestamp,
            ),
          })
        }

        setBlockRefs(newBlockRefs)
      })
  }, [duration])

  useEffect(() => {
    const loadEvents = async () => {
      const newEvents: EventRef[] = []
      const promises: Promise<void>[] = []
      let max: number | undefined = undefined
      let min: number | undefined = undefined

      if (!blockRefs.length) return

      // Query balance of project for interval blocks
      for (let i = 0; i < blockRefs.length; i++) {
        const blockRef = blockRefs[i]

        promises.push(
          querySubgraph(
            {
              entity: 'project',
              keys: ['currentBalance'],
              block: { number: blockRef.block },
              where: projectId
                ? {
                    key: 'id',
                    value: trimHexZero(projectId.toHexString()),
                  }
                : undefined,
            },
            res => {
              newEvents.push({
                timestamp: blockRef.timestamp,
                balance: res?.projects?.length
                  ? parseFloat(
                      parseFloat(
                        fromWad(
                          parseProjectJson(res.projects[0]).currentBalance,
                        ) ?? '0',
                      ).toFixed(4),
                    )
                  : 0,
              })
            },
          ),
        )
      }

      await Promise.all(promises)

      // Calculate domain for graph based on floor/ceiling balances
      newEvents.forEach(r => {
        if (r.balance === undefined) return
        if (min === undefined || r.balance < min) min = r.balance
        if (max === undefined || r.balance > max) max = r.balance
      })

      if (max === undefined || min === undefined) {
        setDomain([0, 0])
      } else {
        const domainPad = (max - min) * 0.05
        setDomain([Math.max(min - domainPad, 0), max + domainPad])
      }

      // Load tap events
      await querySubgraph(
        {
          entity: 'tapEvent',
          keys: ['netTransferAmount', 'timestamp'],
          where: projectId
            ? [
                {
                  key: 'project',
                  value: trimHexZero(projectId.toHexString()),
                },
                {
                  key: 'timestamp',
                  value: Math.round((now - daysToMillis(duration)) / 1000),
                  operator: 'gte',
                },
              ]
            : undefined,
        },
        res => {
          if (res) {
            newEvents.push(
              ...res.tapEvents.map(e => {
                const event = parseTapEventJson(e)
                return {
                  ...e,
                  tapped: parseFloat(
                    parseFloat(fromWad(event.netTransferAmount)).toFixed(4),
                  ),
                  timestamp: event.timestamp ?? 0,
                }
              }),
            )
          }
        },
      )

      const sortedEvents = newEvents.sort((a, b) =>
        a.timestamp < b.timestamp ? -1 : 1,
      )

      setEvents(
        sortedEvents.map((e, i) => {
          if (e.tapped) {
            return {
              ...e,
              previousBalance: sortedEvents[i - 1]?.balance,
            }
          }

          return e
        }),
      )

      setLoading(false)
    }

    loadEvents()
  }, [blockRefs, projectId])

  const buttonStyle: CSSProperties = {
    fontSize: '0.7rem',
    textTransform: 'uppercase',
  }

  const axisStyle: SVGProps<SVGTextElement> = {
    fontSize: 11,
    fill: colors.text.tertiary,
    visibility: events?.length ? 'visible' : 'hidden',
  }

  const xTicks = useMemo(() => {
    if (!events?.length) return []

    let ticks = []
    const max = events[events.length - 1].timestamp
    const min = events[0].timestamp

    // TODO why are only roughly half of ticks rendered?
    for (let i = 0; i < 20; i++) {
      ticks.push(Math.round(((max - min) / 20) * i + min))
    }

    return ticks
  }, [events])

  return (
    <div>
      <div style={{ position: 'relative' }}>
        <ResponsiveContainer width={'100%'} height={height}>
          <LineChart style={{ opacity: loading ? 0.5 : 1 }} data={events}>
            <CartesianGrid
              style={{ paddingLeft: 200 }}
              stroke={colors.stroke.tertiary}
              strokeDasharray="4 2"
            />
            <YAxis
              axisLine={false}
              stroke={colors.stroke.tertiary}
              type="number"
              dataKey="balance"
              domain={domain}
              scale="linear"
              width={20}
              tickSize={4}
              tickCount={4}
              tick={axisStyle}
            />
            <XAxis
              axisLine={false}
              tickSize={4}
              stroke={colors.stroke.tertiary}
              ticks={xTicks}
              tickCount={xTicks.length}
              tick={props => {
                const { x, y, payload } = props
                return (
                  <g transform={`translate(${x},${y})`}>
                    <text dy={12} {...axisStyle}>
                      {dateStringForBlockTime(payload.value)}
                    </text>
                  </g>
                )
              }}
              domain={[xTicks[0], xTicks[xTicks?.length - 1]]}
              type="number"
              dataKey="timestamp"
              scale="time"
              interval={2}
            />
            <Line
              dot={props => {
                const { cx, cy, payload } = props

                if (!domain) return <span hidden></span>
                if (payload.tapped) {
                  console.log(
                    'asdf %',
                    80 - payload.tapped / (domain[1] - domain[0]),
                  )
                }

                return payload.tapped && domain ? (
                  <g transform={`translate(${cx},${0})`}>
                    <line
                      x1="0"
                      y1={
                        80 -
                        (payload.tapped * 25) / (domain[1] - domain[0]) +
                        '%'
                      }
                      x2="0"
                      y2={height - 35 + 'px'}
                      strokeWidth={4}
                      stroke={colors.stroke.tertiary}
                    />
                  </g>
                ) : (
                  <span hidden></span>
                )
              }}
              activeDot={false}
              stroke={colors.stroke.primary}
              strokeWidth={0}
              dataKey="previousBalance"
            />
            <Line
              dot={false}
              connectNulls
              stroke={colors.text.brand.primary}
              strokeWidth={2}
              type="monotone"
              dataKey="balance"
              animationDuration={0}
            />
            <Tooltip
              contentStyle={{
                background: colors.background.l0,
                border: '1px solid ' + colors.stroke.secondary,
                fontSize: '0.8rem',
              }}
              cursor={{ stroke: colors.stroke.secondary }}
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null

                return (
                  <div
                    style={{
                      padding: 10,
                      background: colors.background.l0,
                      border: '1px solid ' + colors.stroke.tertiary,
                    }}
                  >
                    <div
                      style={{
                        fontSize: '0.7rem',
                        color: colors.text.tertiary,
                      }}
                    >
                      {dateStringForBlockTime(payload[0].payload.timestamp)}
                    </div>
                    {payload[0].payload.tapped ? (
                      <div>
                        <CurrencySymbol currency={0} />
                        {payload[0].payload.tapped}
                        <div style={{ fontSize: '0.7rem', fontWeight: 500 }}>
                          withdrawn
                        </div>
                      </div>
                    ) : (
                      <div>
                        <CurrencySymbol currency={0} />
                        {payload[0].payload.balance}
                      </div>
                    )}
                  </div>
                )
              }}
              animationDuration={100}
            />
          </LineChart>
        </ResponsiveContainer>

        {loading && (
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              right: 0,
              bottom: 0,
            }}
          >
            <Loading />
          </div>
        )}

        <Select
          style={{
            ...buttonStyle,
            width: 100,
            position: 'absolute',
            left: 30,
            top: 10,
          }}
          value={duration}
          onChange={val => setDuration(val)}
        >
          <Select.Option value={1}>24 hours</Select.Option>
          <Select.Option value={7}>7 days</Select.Option>
          <Select.Option value={30}>30 days</Select.Option>
          <Select.Option value={90}>90 days</Select.Option>
          <Select.Option value={365}>1 year</Select.Option>
        </Select>
      </div>
    </div>
  )
}
