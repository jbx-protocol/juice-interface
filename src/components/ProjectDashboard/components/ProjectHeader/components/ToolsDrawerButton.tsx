import { EllipsisVerticalIcon } from '@heroicons/react/24/outline'
import { Tooltip } from 'antd'
import { V2V3ProjectToolsDrawer } from 'components/v2v3/V2V3Project/V2V3ProjectToolsDrawer'
import { useState } from 'react'

export default function ToolsDrawerButton() {
  const [open, setOpen] = useState<boolean>()

  return (
    <>
      <Tooltip title={<span>Advanced tools</span>}>
        <EllipsisVerticalIcon
          className="h-6 w-6 cursor-pointer text-bluebs-600 dark:text-white"
          onClick={() => setOpen(true)}
        />
      </Tooltip>

      <V2V3ProjectToolsDrawer open={open} onClose={() => setOpen(false)} />
    </>
  )
}
