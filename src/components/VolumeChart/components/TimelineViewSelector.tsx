import { t } from '@lingui/macro'
import { JuiceListbox } from 'components/inputs/JuiceListbox'
import React from 'react'
import { twMerge } from 'tailwind-merge'
import { ProjectTimelineView } from '../types'

export default function TimelineViewSelector(props: {
  timelineView: ProjectTimelineView
  setTimelineView: React.Dispatch<React.SetStateAction<ProjectTimelineView>>
}) {
  return (
    <>
      <MobileTimelineViewSelector {...props} />
      <DesktopTimelineViewSelector {...props} />
    </>
  )
}

const MobileTimelineViewSelector = ({
  timelineView,
  setTimelineView,
}: {
  timelineView: ProjectTimelineView
  setTimelineView: React.Dispatch<React.SetStateAction<ProjectTimelineView>>
}) => {
  const opts = (): { label: string; value: ProjectTimelineView }[] => [
    {
      label: t`Volume`,
      value: 'volume',
    },
    {
      label: t`In Juicebox`,
      value: 'balance',
    },
    {
      label: t`Trending`,
      value: 'trendingScore',
    },
  ]

  const handleChange = (value: ProjectTimelineView) => {
    setTimelineView(value)
  }

  return (
    <JuiceListbox
      className="w-full max-w-[116px] text-xs uppercase md:hidden"
      buttonClassName="text-xs uppercase py-1 px-2"
      options={opts()}
      value={opts().find(o => o.value === timelineView)}
      onChange={v => handleChange(v.value)}
    />
  )
}

const DesktopTimelineViewSelector = ({
  timelineView,
  setTimelineView,
}: {
  timelineView: ProjectTimelineView
  setTimelineView: React.Dispatch<React.SetStateAction<ProjectTimelineView>>
}) => {
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
        className={twMerge(
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
    <div className="mb-2 hidden gap-3 md:flex">
      {tab('volume')}
      {tab('balance')}
      {tab('trendingScore')}
    </div>
  )
}
