import { Trans } from '@lingui/macro'
import { PV } from 'models/project'
import { ProjectTimelineType } from 'models/sepana'
import { useState } from 'react'
import { ResponsiveContainer } from 'recharts'
import { idForProject } from 'utils/project'

import TimelineChart from './components/TimelineChart'
import TimelineTypeSelector from './components/TimelineTypeSelector'
import WindowSelector from './components/WindowSelector'
import { useProjectTimeline } from './hooks/ProjectTimeline'
import { useTimelineWindow } from './hooks/TimelineWindow'

export default function VolumeChart({
  style: { height },
  createdAt,
  projectId,
  pv,
}: {
  style: { height: number }
  createdAt: number | undefined
  projectId: number | undefined
  pv: PV
}) {
  const [timelineType, setTimelineType] =
    useState<ProjectTimelineType>('volume')

  const [window, setWindow] = useTimelineWindow({ createdAt })

  const { data: timeline, isLoading } = useProjectTimeline(
    idForProject({ pv, projectId }),
  )

  return (
    <div>
      <div className="flex items-baseline justify-between">
        <div>
          <TimelineTypeSelector
            timelineType={timelineType}
            setTimelineType={setTimelineType}
          />
        </div>

        <WindowSelector window={window} setWindow={setWindow} />
      </div>

      <div className="relative">
        <ResponsiveContainer width={'100%'} height={height}>
          <TimelineChart
            timeline={timeline}
            window={window}
            timelineType={timelineType}
            isLoading={isLoading}
          />
        </ResponsiveContainer>

        {isLoading && (
          <div className="absolute left-0 right-0 top-0 bottom-5 flex items-center justify-center">
            <div className="text-grey-400 dark:text-slate-200">
              <Trans>loading</Trans>...
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
