import { t } from '@lingui/macro'
import { JuiceListbox } from 'components/inputs/JuiceListbox'
import React from 'react'
import { ProjectTimelineRange } from '../types'

export default function RangeSelector({
  range,
  setRange,
}: {
  range: ProjectTimelineRange
  setRange:
    | React.Dispatch<React.SetStateAction<ProjectTimelineRange>>
    | undefined
}) {
  const opts = (): { label: string; value: ProjectTimelineRange }[] => [
    {
      label: t`7 days`,
      value: 7,
    },
    {
      label: t`30 days`,
      value: 30,
    },
    {
      label: t`1 year`,
      value: 365,
    },
  ]

  return (
    <JuiceListbox
      className="w-[5.6rem] text-xs uppercase"
      buttonClassName="text-xs uppercase py-1 px-2"
      options={opts()}
      value={opts().find(o => o.value === range)}
      onChange={v => setRange?.(v.value)}
    />
  )
}
