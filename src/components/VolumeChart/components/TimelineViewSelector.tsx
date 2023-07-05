import { t } from '@lingui/macro'
import React from 'react'
import { classNames } from 'utils/classNames'
import { ProjectTimelineView } from '../types'

export default function TimelineViewSelector({
  timelineView,
  setTimelineView,
}: {
  timelineView: ProjectTimelineView
  setTimelineView: React.Dispatch<React.SetStateAction<ProjectTimelineView>>
}) {
  const tab = (view: ProjectTimelineView) => {
    const selected = view === timelineView

    let text: string
    switch (view) {
      case 'balance':
        text = t`In Juicebox`
        break
      case 'volume':
        text = t`Volume`
        break
      case 'trendingScore':
        text = t`Trending`
        break
    }

    return (
      <div
        className={classNames(
          'cursor-pointer text-sm uppercase',
          selected
            ? 'font-medium text-grey-500 dark:text-slate-100'
            : 'font-normal text-grey-400 dark:text-slate-200',
        )}
        onClick={() => setTimelineView(view)}
      >
        {text}
      </div>
    )
  }

  return (
    <div className="flex gap-3">
      {tab('volume')}
      {tab('balance')}
      {tab('trendingScore')}
    </div>
  )
}
