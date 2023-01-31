import { t } from '@lingui/macro'
import { Space } from 'antd'
import { ProjectTimelineType } from 'models/sepana'
import React from 'react'
import { classNames } from 'utils/classNames'

export default function TimelineTypeSelector({
  timelineType,
  setTimelineType,
}: {
  timelineType: ProjectTimelineType
  setTimelineType: React.Dispatch<React.SetStateAction<ProjectTimelineType>>
}) {
  const tab = (type: ProjectTimelineType) => {
    const selected = type === timelineType

    let text: string
    switch (type) {
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
            ? 'font-medium text-grey-500 dark:text-grey-300'
            : 'font-normal text-grey-400 dark:text-slate-200',
        )}
        onClick={() => setTimelineType(type)}
      >
        {text}
      </div>
    )
  }

  return (
    <Space size="large">
      {tab('volume')}
      {tab('balance')}
      {/* {tab('trendingScore')} */}
    </Space>
  )
}
