import { Trans } from '@lingui/macro'
import { PV } from 'models/pv'
import { CSSProperties, useMemo, useState } from 'react'

import { PV_V4 } from 'constants/pv'
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
}: {
  height: CSSProperties['height']
  createdAt: number | undefined
  projectId: number
  pv: PV
}) {
  const [timelineView, setTimelineView] =
    useState<ProjectTimelineView>('volume')

  const [range, setRange] = useTimelineRange({ createdAt })

  const { v1v2v3Points, v4Points, loading } = useProjectTimeline({
    projectId,
    pv,
    range,
  })

  const points = useMemo(() => {
    switch (pv) {
      case PV_V4:
        return v4Points
      default:
        return v1v2v3Points
    }
  }, [pv, v1v2v3Points, v4Points])

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
