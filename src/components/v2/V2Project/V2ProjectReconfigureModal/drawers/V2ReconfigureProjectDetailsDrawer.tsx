import { Trans } from '@lingui/macro'
import { Drawer } from 'antd'

import { drawerStyle } from 'constants/styles/drawerStyle'
import V2ProjectDetails from '../../V2ProjectSettings/V2ProjectDetails'

export function V2ReconfigureProjectDetailsDrawer({
  visible,
  onFinish,
}: {
  visible: boolean
  onFinish?: () => void
}) {
  return (
    <Drawer visible={visible} {...drawerStyle} onClose={onFinish}>
      <h3>
        <Trans>Reconfigure project details</Trans>
      </h3>
      <V2ProjectDetails />
    </Drawer>
  )
}
