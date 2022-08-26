import { Drawer } from 'antd'

import { drawerStyle } from 'constants/styles/drawerStyle'
import V2ReconfigureProjectHandle from './V2ProjectSettings/V2ReconfigureProjectHandle'

export function V2ReconfigureProjectHandleDrawer({
  visible,
  onFinish,
}: {
  visible: boolean | undefined
  onFinish?: () => void
}) {
  return (
    <Drawer visible={visible} {...drawerStyle} onClose={onFinish}>
      <V2ReconfigureProjectHandle />
    </Drawer>
  )
}
