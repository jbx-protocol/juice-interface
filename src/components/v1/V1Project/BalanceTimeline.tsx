import { Select, Space } from 'antd'
import { t, Trans } from '@lingui/macro'
import CurrencySymbol from 'components/shared/CurrencySymbol'

import { V1ProjectContext } from 'contexts/v1/projectContext'
import { ThemeContext } from 'contexts/themeContext'
import EthDater from 'ethereum-block-by-date'
import { Project } from 'models/subgraph-entities/project'
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
import { querySubgraph } from 'utils/graph'

import { readProvider } from 'constants/readProvider'

import SectionHeader from './SectionHeader'
import { V1_CURRENCY_ETH } from 'constants/v1/currency'

const now = moment.now() - 5 * 60 * 1000 // 5 min ago

const daysToMillis = (days: number) => days * 24 * 60 * 60 * 1000

type Duration = 1 | 7 | 30 | 90 | 365
type EventRef = {
  timestamp: number
  value?: number
  tapped?: number
  previousBalance?: number
}
type BlockRef = { block: number | null; timestamp: number }
type ShowGraph = 'volume' | 'balance'

export default function BalanceTimeline({ height }: { height: number }) {
  const [events, setEvents] = useState<EventRef[]>([])
  const [blockRefs, setBlockRefs] = useState<BlockRef[]>([])
  const [loading, setLoading] = useState<boolean>()
  const [domain, setDomain] = useState<[number, number]>()
  const [duration, setDuration] = useState<Duration>()
  const [showGraph, setShowGraph] = useState<ShowGraph>('volume')
  const { projectId, projectType, createdAt } = useContext(V1ProjectContext)
  const {
    theme: { colors },
  } = useContext(ThemeContext)

  const dateStringForBlockTime = (timestamp: number) =>
    duration
      ? moment(timestamp * 1000).format(duration > 1 ? 'M/DD' : 'h:mma')
      : undefined

  useEffect(() => {
    if (!createdAt) return

    if (createdAt * 1000 > now - daysToMillis(1)) {
      setDuration(1)
    } else if (createdAt * 1000 > now - daysToMillis(7)) {
      setDuration(7)
    } else {
      setDuration(30)
    }
  }, [createdAt])

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
        //TODO + 0.1 fixes bug where only one block is returned. Needs better fix
        moment(now - daysToMillis(duration + 0.1)).toISOString(),
        moment(now).toISOString(),
        duration,
        false,
      )
      .then((res: (BlockRef & { block: number })[]) => {
        const newBlockRefs: BlockRef[] = []
        const blocksCount = 40

        // Calculate intermediate block numbers at consistent intervals
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

        // Push blockRef for "now"
        newBlockRefs.push({
          block: null,
          timestamp: Math.round(now.valueOf() / 1000),
        })

        setBlockRefs(newBlockRefs)
      })
  }, [duration])

  useEffect(() => {
    if (!showGraph || !duration) return

    const loadEvents = async () => {
      setLoading(true)

      const newEvents: EventRef[] = []
      const promises: Promise<void>[] = []
      let max: number | undefined = undefined
      let min: number | undefined = undefined

      if (!blockRefs.length) return

      let queryKeys: (keyof Project)[]

      switch (showGraph) {
        case 'volume':
          queryKeys = ['totalPaid']
          break
        case 'balance':
          queryKeys = ['currentBalance']
          break
      }

      // Query balance of project for interval blocks
      for (let i = 0; i < blockRefs.length; i++) {
        const blockRef = blockRefs[i]

        promises.push(
          querySubgraph({
            entity: 'project',
            keys: queryKeys,
            // For block == null, don't specify block param
            ...(blockRef.block !== null
              ? { block: { number: blockRef.block } }
              : {}),
            where: projectId
              ? {
                  key: 'id',
                  value: projectId.toString(),
                }
              : undefined,
          }).then(projects => {
            if (!projects.length) return

            let value: number | undefined = undefined

            const project = projects[0]

            if (!project) return

            switch (showGraph) {
              case 'volume':
                value = parseFloat(
                  parseFloat(fromWad(project.totalPaid)).toFixed(4),
                )
                break
              case 'balance':
                value = parseFloat(
                  parseFloat(fromWad(project.currentBalance)).toFixed(4),
                )
                break
            }

            if (value !== undefined) {
              newEvents.push({
                timestamp: blockRef.timestamp,
                value,
              })
            }
          }),
        )
      }

      await Promise.all(promises)

      // Calculate domain for graph based on floor/ceiling balances
      newEvents.forEach(r => {
        if (r.value === undefined) return
        if (min === undefined || r.value < min) min = r.value
        if (max === undefined || r.value > max) max = r.value
      })

      if (max === undefined || min === undefined) {
        setDomain([0, 0])
      } else {
        const domainPad = (max - min) * 0.05
        setDomain([Math.max(min - domainPad, 0), Math.max(max + domainPad, 10)])
      }

      // Load tap events
      if (showGraph === 'balance') {
        await querySubgraph({
          entity: 'tapEvent',
          keys: ['netTransferAmount', 'timestamp'],
          where: projectId
            ? [
                {
                  key: 'project',
                  value: projectId.toString(),
                },
                {
                  key: 'timestamp',
                  value: Math.round((now - daysToMillis(duration)) / 1000),
                  operator: 'gte',
                },
              ]
            : undefined,
        }).then(tapEvents => {
          newEvents.push(
            ...tapEvents.map(event => {
              return {
                ...event,
                tapped: parseFloat(
                  parseFloat(fromWad(event.netTransferAmount)).toFixed(4),
                ),
                timestamp: event.timestamp ?? 0,
              }
            }),
          )
        })
      }

      const sortedEvents = newEvents.sort((a, b) =>
        a.timestamp < b.timestamp ? -1 : 1,
      )

      setEvents(
        sortedEvents.map((e, i) => {
          if (e.tapped) {
            return {
              ...e,
              previousBalance: sortedEvents[i - 1]?.value,
            }
          }

          return e
        }),
      )

      setLoading(false)
    }

    setEvents([])
    loadEvents()
  }, [blockRefs, duration, projectId, showGraph])

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
    const max = now / 1000
    const min = duration ? (now - daysToMillis(duration)) / 1000 : undefined

    if (!min) return []

    // TODO why are only roughly half of ticks rendered?
    for (let i = 0; i < 20; i++) {
      ticks.push(Math.round(((max - min) / 20) * i + min))
    }

    return ticks
  }, [events, duration])

  let header: string | undefined = undefined

  switch (showGraph) {
    case 'volume':
      header = t`Volume`
      break
    case 'balance':
      header = t`Project`
      break
  }

  const tab = (tab: ShowGraph) => {
    const selected = tab === showGraph

    let text: string
    switch (tab) {
      case 'balance':
        text = t`In Juicebox`
        break
      case 'volume':
        text = t`Volume`
        break
    }

    return (
      <div
        style={{
          textTransform: 'uppercase',
          fontSize: '0.8rem',
          fontWeight: selected ? 600 : 400,
          color: selected ? colors.text.secondary : colors.text.tertiary,
          cursor: 'pointer',
        }}
        onClick={() => setShowGraph(tab)}
      >
        {text}
      </div>
    )
  }

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
        }}
      >
        {projectType === 'bidpool' ? (
          <SectionHeader text={header} />
        ) : (
          <div>
            <Space size="large">
              {tab('volume')}
              {tab('balance')}
            </Space>
          </div>
        )}

        <Select
          className="small"
          style={{
            ...buttonStyle,
            width: 100,
          }}
          value={duration}
          onChange={val => setDuration(val)}
        >
          <Select.Option value={1}>
            <Trans>24 hours</Trans>
          </Select.Option>
          <Select.Option value={7}>
            <Trans>7 days</Trans>
          </Select.Option>
          <Select.Option value={30}>
            <Trans>30 days</Trans>
          </Select.Option>
          <Select.Option value={90}>
            <Trans>90 days</Trans>
          </Select.Option>
          <Select.Option value={365}>
            <Trans>1 year</Trans>
          </Select.Option>
        </Select>
      </div>
      <div style={{ position: 'relative' }}>
        <ResponsiveContainer width={'100%'} height={height}>
          <LineChart style={{ opacity: loading ? 0.5 : 1 }} data={events}>
            <CartesianGrid
              style={{ paddingLeft: 200 }}
              stroke={colors.stroke.tertiary}
              strokeDasharray="4 2"
            />
            {showGraph === 'balance' && (
              <Line
                dot={props => {
                  const { cx, payload } = props

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
                        stroke={colors.stroke.secondary}
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
            )}
            <Line
              dot={false}
              connectNulls
              stroke={colors.text.brand.primary}
              strokeWidth={2}
              type="monotone"
              dataKey="value"
              animationDuration={0}
            />
            <YAxis
              axisLine={false}
              stroke={colors.stroke.tertiary}
              type="number"
              dataKey="value"
              domain={domain}
              scale="linear"
              tickSize={2}
              tickCount={4}
              tick={axisStyle}
              mirror
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
              domain={[xTicks[0], xTicks[xTicks.length - 1]]}
              type="number"
              dataKey="timestamp"
              scale="time"
              interval={2}
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
                        -<CurrencySymbol currency={V1_CURRENCY_ETH} />
                        {payload[0].payload.tapped}
                        <div
                          style={{
                            fontSize: '0.7rem',
                            fontWeight: 500,
                            color: colors.text.secondary,
                          }}
                        >
                          withdraw
                        </div>
                      </div>
                    ) : (
                      <div>
                        <CurrencySymbol currency={V1_CURRENCY_ETH} />
                        {payload[0].payload.value}
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
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              position: 'absolute',
              left: 0,
              top: 0,
              right: 0,
              bottom: 20,
            }}
          >
            <div style={{ color: colors.text.disabled }}>
              <Trans>loading</Trans>...
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
