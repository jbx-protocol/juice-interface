import CurrencySymbol from 'components/currency/CurrencySymbol'
import moment from 'moment'
import { CSSProperties, useContext, useMemo } from 'react'
import {
  CartesianGrid,
  Label,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import {
  ProjectTimelinePoint,
  ProjectTimelineRange,
  ProjectTimelineView,
} from '../types'

import { t } from '@lingui/macro'
import { ThemeContext } from 'contexts/Theme/ThemeContext'
import { useTrendingProjects } from 'hooks/useProjects'
import tailwind from 'lib/tailwind'
import { wadToFloat } from 'utils/format/formatNumber'
import { daysToMS } from 'utils/units'
import { useTicks } from '../hooks/useTicks'
import { useTimelineYDomain } from '../hooks/useTimelineYDomain'

const now = Date.now().valueOf()

export default function TimelineChart({
  points,
  view,
  range,
  height,
}: {
  points: ProjectTimelinePoint[] | undefined
  view: ProjectTimelineView
  range: ProjectTimelineRange
  height: CSSProperties['height']
}) {
  const { themeOption } = useContext(ThemeContext)

  const defaultYDomain = useTimelineYDomain(points?.map(p => p[view]))

  const { data: trendingProjects } = useTrendingProjects(1)
  const highTrendingScore = trendingProjects?.length
    ? wadToFloat(trendingProjects[0].trendingScore)
    : undefined

  const highTrendingPoint =
    points?.reduce(
      (acc, curr) => (curr.trendingScore > acc ? curr.trendingScore : acc),
      0,
    ) ?? 0

  const yDomain: [number, number] =
    view === 'trendingScore' && highTrendingScore
      ? [
          defaultYDomain[0],
          Math.max(highTrendingScore, highTrendingPoint) * 1.05,
        ]
      : defaultYDomain

  const {
    theme: { colors },
  } = tailwind

  const xDomain = useMemo(
    () =>
      [Math.floor((now - daysToMS(range)) / 1000), Math.floor(now / 1000)] as [
        number,
        number,
      ],
    [range],
  )

  const stroke = themeOption === 'dark' ? colors.slate[300] : colors.grey[400]
  const color = themeOption === 'dark' ? colors.slate[200] : colors.grey[400]
  const bg = themeOption === 'dark' ? colors.slate[900] : 'white'
  const fontSize = '0.75rem'

  const xTicks = useTicks({ range: xDomain, resolution: 7, offset: 0.5 })

  const yTicks = useTicks({ range: yDomain, resolution: 5, offset: 0.5 })

  const dateStringForBlockTime = (timestampSecs: number) =>
    moment(timestampSecs * 1000).format('M/DD')

  return (
    <ResponsiveContainer width={'100%'} height={height}>
      <LineChart
        margin={{
          top: -1, // hacky way to hide top border of CartesianGrid
          right: 0,
          bottom: 0,
          left: 1, // ensure y axis isn't cut off
        }}
        data={points}
      >
        <CartesianGrid stroke={stroke} strokeDasharray="1 2" vertical={false} />
        <YAxis
          stroke={stroke}
          tickLine={false}
          tickSize={0}
          tick={props => {
            if (view === 'trendingScore' || !points?.length) return <g></g>

            const { value } = props.payload

            const formattedValue = value.toFixed(value >= 10 ? 0 : 1)

            // <rect> serves as a mask to prevent CartesianGrid lines overlapping tick text
            return (
              <g>
                <rect
                  transform={`translate(${props.x},${props.y - 6})`}
                  height={12}
                  width={formattedValue.length > 2 ? 40 : 30}
                  fill={bg}
                />
                <text
                  fontSize={fontSize}
                  fill={color}
                  transform={`translate(${props.x + 4},${props.y + 4})`}
                >
                  <CurrencySymbol currency="ETH" />
                  {formattedValue}
                </text>
              </g>
            )
          }}
          ticks={yTicks}
          domain={yDomain}
          interval={0} // Ensures all ticks are visible
          mirror
        />
        <XAxis
          stroke={stroke}
          tick={props => (
            <text
              fontSize={fontSize}
              fill={color}
              transform={`translate(${props.x - 12},${props.y + 14})`}
            >
              {dateStringForBlockTime(props.payload.value)}
            </text>
          )}
          ticks={xTicks}
          domain={xDomain}
          interval={0} // Ensures all ticks are visible
          tickLine={false}
          tickSize={0}
          type="number"
          dataKey="timestamp"
          scale="time"
        />
        {view === 'trendingScore' && highTrendingScore && points?.length && (
          <ReferenceLine
            label={
              <Label
                fill={color}
                style={{
                  fontSize,
                  fontWeight: 500,
                }}
                position="insideTopLeft"
                offset={8}
                value={t`Current #1 trending`}
              />
            }
            stroke={color}
            y={highTrendingScore}
          />
        )}
        {points?.length && (
          <Line
            dot={false}
            stroke={colors.juice[400]}
            strokeWidth={4}
            type="monotone"
            dataKey={view}
            activeDot={{ r: 6, fill: colors.juice[400], stroke: undefined }}
            animationDuration={750}
          />
        )}
        <Tooltip
          cursor={{ stroke: color }}
          content={({ active, payload }) => {
            if (!active || !payload?.length) return null

            const amount = payload[0].payload[view]

            return (
              <div className="bg-smoke-100 p-2 text-sm dark:bg-slate-600">
                <div className="text-grey-400 dark:text-slate-200">
                  {dateStringForBlockTime(payload[0].payload.timestamp)}
                </div>
                {view !== 'trendingScore' && (
                  <div className="font-medium">
                    <CurrencySymbol currency="ETH" />
                    {amount.toFixed(amount > 10 ? 1 : amount > 1 ? 2 : 4)}
                  </div>
                )}
              </div>
            )
          }}
          animationDuration={50}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
