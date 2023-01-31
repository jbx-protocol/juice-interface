import { Trans } from '@lingui/macro'
import { Select } from 'antd'
import { ProjectTimelineWindow } from 'models/sepana'
import React from 'react'

export default function WindowSelector({
  window,
  setWindow,
}: {
  window: ProjectTimelineWindow | undefined
  setWindow:
    | React.Dispatch<React.SetStateAction<ProjectTimelineWindow | undefined>>
    | undefined
}) {
  return (
    <div>
      <Select
        className="small w-24 text-xs uppercase"
        value={window}
        onChange={setWindow}
      >
        <Select.Option value={7}>
          <Trans>7 days</Trans>
        </Select.Option>
        <Select.Option value={30}>
          <Trans>30 days</Trans>
        </Select.Option>
        <Select.Option value={365}>
          <Trans>1 year</Trans>
        </Select.Option>
      </Select>
    </div>
  )
}
