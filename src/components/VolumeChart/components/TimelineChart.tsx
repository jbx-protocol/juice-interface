import CurrencySymbol from 'components/CurrencySymbol'
import { ThemeContext } from 'contexts/themeContext'
import {
  ProjectTimelineType,
  ProjectTimelineWindow,
  SepanaProjectTimeline,
} from 'models/sepana'
import moment from 'moment'
import React, { SVGProps, useContext, useMemo } from 'react'
import { CartesianGrid, Line, LineChart, Tooltip, XAxis, YAxis } from 'recharts'
import { classNames } from 'utils/classNames'

import { useFormatTimelinePoints } from '../hooks/FormatTimelinePoints'
import { useTicks } from '../hooks/Ticks'
import { useTimelineYDomain } from '../hooks/TimelineYDomain'

export default function TimelineChart({
  timeline,
  timelineType,
  window,
  isLoading,
}: {
  timeline: SepanaProjectTimeline | undefined
  timelineType: ProjectTimelineType
  window: ProjectTimelineWindow | undefined
  isLoading: boolean
}) {
  const {
    theme: { colors },
  } = useContext(ThemeContext)

  const points = useFormatTimelinePoints(timeline, window)

  const yDomain = useTimelineYDomain(points, timelineType)

  const xDomain = useMemo(
    () =>
      points
        ? ([points[0].timestamp, points[points.length - 1].timestamp] as [
            number,
            number,
          ])
        : undefined,
    [points],
  )

  const xTicks = useTicks({ range: xDomain, count: 7 })

  const yTicks = useTicks({ range: yDomain, count: 5 })

  const axisStyle: SVGProps<SVGTextElement> = {
    fontSize: 11,
    fill: colors.text.tertiary,
    visibility: points?.length ? 'visible' : 'hidden',
  }

  const dateStringForBlockTime = (timestampSecs: number) =>
    moment(timestampSecs * 1000).format('M/DD')

  return (
    <LineChart
      className={classNames(isLoading ? 'opacity-50' : '')}
      data={points}
    >
      <CartesianGrid
        stroke={colors.stroke.tertiary}
        strokeDasharray="4 6"
        horizontal={false}
      />
      <Line
        dot={false}
        stroke={colors.text.brand.primary}
        strokeWidth={4}
        type="monotone"
        dataKey={timelineType}
        animationDuration={0}
      />
      <YAxis
        tickSize={4}
        tick={props => (
          <text
            {...axisStyle}
            transform={`translate(${props.x},${props.y + 3})`}
          >
            {props.payload.value.toFixed(1)}
          </text>
        )}
        ticks={yTicks}
        domain={yDomain}
        interval={0} // Ensures all ticks are visible
        mirror
      />
      <XAxis
        tickSize={4}
        tick={props => (
          <text
            {...axisStyle}
            transform={`translate(${props.x},${props.y + 12})`}
          >
            {dateStringForBlockTime(props.payload.value)}
          </text>
        )}
        ticks={xTicks}
        domain={xDomain}
        interval={0} // Ensures all ticks are visible
        type="number"
        dataKey="timestamp"
        scale="time"
      />
      <Tooltip
        cursor={{ stroke: colors.stroke.tertiary }}
        content={({ active, payload }) => {
          if (!active || !payload?.length) return null

          return (
            <div className="border border-solid border-smoke-200 bg-smoke-25 p-2 text-xs dark:border-grey-600 dark:bg-slate-800">
              <div className="text-grey-400 dark:text-slate-200">
                {dateStringForBlockTime(payload[0].payload.timestamp)}
              </div>
              <CurrencySymbol currency="ETH" />
              {payload[0].payload[timelineType].toFixed(4)}
            </div>
          )
        }}
        animationDuration={50}
      />
    </LineChart>
  )
}
