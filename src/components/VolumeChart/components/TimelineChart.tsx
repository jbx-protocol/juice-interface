import { t } from '@lingui/macro'
import CurrencySymbol from 'components/currency/CurrencySymbol'
import { ThemeContext } from 'contexts/Theme/ThemeContext'
import { useTrendingProjects } from 'hooks/useTrendingProjects'
import tailwind from 'lib/tailwind'
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
import { wadToFloat } from 'utils/format/formatNumber'
import { daysToMS } from 'utils/units'
import { useTicks } from '../hooks/useTicks'
import { useTimelineYDomain } from '../hooks/useTimelineYDomain'
import {
  ProjectTimelinePoint,
  ProjectTimelineRange,
  ProjectTimelineView,
} from '../types'

const now = Date.now().valueOf()

// Known currency addresses to symbol mapping (lowercase addresses)
const CURRENCY_SYMBOLS: Record<string, string> = {
  '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913': 'USDC', // Base USDC
  '0x0000000000000000000000000000000000000000': 'ETH', // Native ETH
}

/**
 * Get currency symbol from currency address (hex string)
 */
function getCurrencySymbol(currency?: string | null): string {
  if (!currency) return 'ETH'
  // Normalize to lowercase for lookup
  const symbol = CURRENCY_SYMBOLS[currency.toLowerCase()]
  return symbol || 'ETH'
}

export default function TimelineChart({
  points,
  view,
  range,
  height,
  projectToken,
  projectDecimals,
}: {
  points: ProjectTimelinePoint[] | undefined
  view: ProjectTimelineView
  range: ProjectTimelineRange
  height: CSSProperties['height']
  projectToken?: string
  projectDecimals?: number
}) {
  const { themeOption } = useContext(ThemeContext)

  const defaultYDomain = useTimelineYDomain(points?.map(p => p[view]))

  // Determine currency symbol based on project token
  const currencySymbol = getCurrencySymbol(projectToken)

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

  const xDomain = useMemo(() => {
    // If we have data points, use their actual timestamp range for perfect alignment
    if (points && points.length > 0) {
      const timestamps = points.map(p => p.timestamp)
      const min = Math.min(...timestamps)
      const max = Math.max(...timestamps)
      // Add 5% padding on each side so first/last points aren't cut off
      const padding = (max - min) * 0.05
      return [min - padding, max + padding] as [number, number]
    }
    // Fallback to calculated range if no points yet
    return [Math.floor((now - daysToMS(range)) / 1000), Math.floor(now / 1000)] as [
      number,
      number,
    ]
  }, [range, points])

  const stroke = themeOption === 'dark' ? colors.slate[300] : colors.grey[400]
  const color = themeOption === 'dark' ? colors.slate[200] : colors.grey[400]
  const bg = themeOption === 'dark' ? colors.slate[900] : 'white'
  const fontSize = '0.75rem'

  const calculatedTicks = useTicks({ range: xDomain, resolution: 7, offset: 0.5 })

  // Select appropriate number of ticks to avoid overlap
  const xTicks = useMemo(() => {
    if (points && points.length > 0) {
      const timestamps = points.map(p => p.timestamp)

      // Determine how many ticks to show based on range
      let tickInterval: number
      if (range <= 7) {
        // 7 days: show all
        tickInterval = 1
      } else if (range <= 30) {
        // 30 days: show every ~4 days (about 8 ticks)
        tickInterval = Math.ceil(timestamps.length / 8)
      } else {
        // 365 days: show every ~4-5 points (about 6-7 ticks)
        tickInterval = Math.ceil(timestamps.length / 7)
      }

      // Select evenly spaced timestamps including first and last
      const selectedTicks: number[] = []
      for (let i = 0; i < timestamps.length; i += tickInterval) {
        selectedTicks.push(timestamps[i])
      }
      // Always include the last timestamp if not already included
      if (selectedTicks[selectedTicks.length - 1] !== timestamps[timestamps.length - 1]) {
        selectedTicks.push(timestamps[timestamps.length - 1])
      }

      return selectedTicks
    }
    // Fallback to calculated ticks if no points
    return calculatedTicks
  }, [points, calculatedTicks, range])

  const yTicks = useTicks({ range: yDomain, resolution: 5, offset: 0.5 })

  const dateStringForBlockTime = (timestampSecs: number) =>
    moment(timestampSecs * 1000).format('M/DD')

  return (
    <ResponsiveContainer width={'100%'} height={height as number | `${number}%` | undefined}>
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
            if (view === 'trendingScore' || !points?.length) return <g key={`y-tick-${props.index}`}></g>

            const { value } = props.payload

            const formattedValue = value.toFixed(value >= 10 ? 0 : 1)

            // <rect> serves as a mask to prevent CartesianGrid lines overlapping tick text
            return (
              <g key={`y-tick-${props.index}-${value}`}>
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
                  {currencySymbol === 'ETH' ? (
                    <CurrencySymbol currency="ETH" />
                  ) : (
                    `${currencySymbol} `
                  )}
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
              key={`x-tick-${props.index}-${props.payload.value}`}
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
                    {currencySymbol === 'ETH' ? (
                      <CurrencySymbol currency="ETH" />
                    ) : (
                      `${currencySymbol} `
                    )}
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
