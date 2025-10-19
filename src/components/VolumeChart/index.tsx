import { Trans } from '@lingui/macro'
import { PV } from 'models/pv'
import { CSSProperties, useMemo, useState } from 'react'

import { PV_V4 } from 'constants/pv'
import { useV4V5ProjectTimeline } from 'packages/v4v5/hooks/useV4V5ProjectTimeline'
import RangeSelector from './components/RangeSelector'
import TimelineChart from './components/TimelineChart'
import TimelineViewSelector from './components/TimelineViewSelector'
import { useProjectTimeline } from './hooks/useProjectTimeline'
import { useTimelineRange } from './hooks/useTimelineRange'
import { ProjectTimelineView } from './types'

export default function VolumeChart({
  height,
  createdAt,
  projectId,
  pv,
  version,
}: {
  height: CSSProperties['height']
  createdAt: number | undefined
  projectId: number
  pv: PV
  version?: number
}) {
  const [timelineView, setTimelineView] =
    useState<ProjectTimelineView>('volume')

  const [range, setRange] = useTimelineRange({ createdAt })

  // V1/V2/V3: Use legacy blockchain-based hook
  const { v1v2v3Points, loading: legacyLoading } = useProjectTimeline({
    projectId,
    pv,
    range,
  })

  // V4/V5: Use new database-based hook (only for V4 projects)
  const shouldUseV4Hook = pv === PV_V4
  const { points: v4v5Points, loading: v4v5Loading } = useV4V5ProjectTimeline({
    projectId: shouldUseV4Hook ? projectId : 0,
    range,
    version: version || 4,
  })

  const points = shouldUseV4Hook ? v4v5Points : v1v2v3Points
  const loading = shouldUseV4Hook ? v4v5Loading : legacyLoading

  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between">
        <TimelineViewSelector
          timelineView={timelineView}
          setTimelineView={setTimelineView}
        />

        <RangeSelector range={range} setRange={setRange} />
      </div>

      <div style={{ height }} className="relative">
        <TimelineChart
          points={points}
          view={timelineView}
          range={range}
          height={height}
        />
        {!points?.length && (
          <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center">
            <div className="text-grey-400 dark:text-slate-200">
              {loading ? (
                <span>
                  <Trans>Loading</Trans>...
                </span>
              ) : (
                <span>
                  <Trans>Unable to load chart</Trans>
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
