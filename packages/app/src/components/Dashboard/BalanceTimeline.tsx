import { Select } from 'antd'
import CurrencySymbol from 'components/shared/CurrencySymbol'
import Loading from 'components/shared/Loading'
import { readProvider } from 'constants/readProvider'
import { ProjectContext } from 'contexts/projectContext'
import { ThemeContext } from 'contexts/themeContext'
import EthDater from 'ethereum-block-by-date'
import { parseProjectJson } from 'models/subgraph-entities/project'
import moment from 'moment'
import { CSSProperties, SVGProps, useContext, useEffect, useState } from 'react'
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
  date: string
  timestamp: number
  balance?: number
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

    new EthDater(readProvider)
      .getEvery(
        'days',
        moment(now - daysToMillis(duration)).toISOString(),
        moment(now).toISOString(),
        duration,
      )
      .then((res: BlockRef[]) => {
        const newBlockRefs: BlockRef[] = [res[0]]
        const count = 48

        // Calculate intermediate blocks
        for (let i = 0; i < count; i++) {
          newBlockRefs.push({
            block: Math.round(
              ((res[1].block - res[0].block) / count) * i + res[0].block,
            ),
            timestamp: Math.round(
              ((res[1].timestamp - res[0].timestamp) / count) * i +
                res[0].timestamp,
            ),
          })
        }

        setBlockRefs(newBlockRefs)
      })
  }, [duration])

  useEffect(() => {
    const loadBalances = async () => {
      const newEvents: EventRef[] = []
      const promises: Promise<void>[] = []
      let max = 0
      let min = 9999999999

      if (!blockRefs.length) return

      // Query balance of project at every block timestamp
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
                date: dateStringForBlockTime(blockRef.timestamp || 0),
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

      newEvents.forEach(r => {
        if (r.balance === undefined) return
        if (min === undefined || r.balance < min) min = r.balance
        if (max === undefined || r.balance > max) max = r.balance
      })

      const domainPad = (max - min) * 0.05
      setDomain([Math.max(min - domainPad, 0), max + domainPad])

      setEvents(newEvents.sort((a, b) => (a.timestamp < b.timestamp ? -1 : 1)))

      setLoading(false)
    }

    loadBalances()
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
              tick={axisStyle}
              dataKey="date"
            />
            <Line
              dot={false}
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
                    <CurrencySymbol currency={0} />
                    {payload[0].payload.balance}
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
