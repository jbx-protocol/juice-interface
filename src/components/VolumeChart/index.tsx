import { Select, Space } from 'antd'
import { t, Trans } from '@lingui/macro'
import ETHAmount from 'components/currency/ETHAmount'

import { ThemeContext } from 'contexts/themeContext'
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

import { EventRef, ShowGraph } from './types'
import { useDuration } from './hooks/useDuration'
import { loadBlockRefs } from './loadBlockRefs'
import { loadProjectEvents } from './loadProjectEvents'
import { loadDomain } from './loadDomain'
import { loadTapEvents } from './loadTapEvents'
import { daysToMillis } from './daysToMillis'

const now = moment.now() - 5 * 60 * 1000 // 5 min ago

export default function VolumeChart({
  style: { height },
  createdAt,
  projectId,
  cv,
}: {
  style: { height: number }
  createdAt: number | undefined
  projectId: number | undefined
  cv: string
}) {
  const [events, setEvents] = useState<EventRef[]>([])
  // const [blockRefs, setBlockRefs] = useState<BlockRef[]>([])
  const [loading, setLoading] = useState<boolean>()
  const [domain, setDomain] = useState<[number, number]>()
  const [showGraph, setShowGraph] = useState<ShowGraph>('volume')
  const [duration, setDuration] = useDuration({ createdAt, now })
  const {
    theme: { colors },
  } = useContext(ThemeContext)

  const dateStringForBlockTime = (timestamp: number) =>
    duration
      ? moment(timestamp * 1000).format(duration > 1 ? 'M/DD' : 'h:mma')
      : undefined

  // Get references to timestamp of blocks in interval
  useEffect(() => {
    if (!duration || !showGraph) return

    setLoading(true)
    setEvents([])
    setDomain(undefined)

    loadBlockRefs({ duration, now }).then(async blockRefs => {
      if (!projectId) return
      const projectEvents = await loadProjectEvents({
        blockRefs,
        showGraph,
        projectId,
        cv,
      })
      if (!projectEvents) return
      const domain = loadDomain(projectEvents)
      setDomain(domain)
      if (showGraph === 'balance') {
        const tapEvents = await loadTapEvents({ projectId, duration, now })
        projectEvents.concat(tapEvents)
      }
      const sortedEvents = projectEvents.sort((a, b) =>
        a.timestamp < b.timestamp ? -1 : 1,
      )
      const events = sortedEvents.map((e, i) => {
        if (e.tapped) {
          return { ...e, previousBalance: sortedEvents[i - 1]?.value }
        }
        return e
      })
      setEvents(events)
      setLoading(false)
    })
    // loadEvents(blockRefs)
  }, [cv, duration, projectId, showGraph])

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

    const ticks = []
    const max = now / 1000
    const min = duration ? (now - daysToMillis(duration)) / 1000 : undefined

    if (!min) return []

    // TODO why are only roughly half of ticks rendered?
    for (let i = 0; i < 20; i++) {
      ticks.push(Math.round(((max - min) / 20) * i + min))
    }

    return ticks
  }, [events, duration])

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
        <div>
          <Space size="large">
            {tab('volume')}
            {tab('balance')}
          </Space>
        </div>

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
                        -<ETHAmount amount={payload[0].payload.tapped} />
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
                        <ETHAmount amount={payload[0].payload.value} />
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
