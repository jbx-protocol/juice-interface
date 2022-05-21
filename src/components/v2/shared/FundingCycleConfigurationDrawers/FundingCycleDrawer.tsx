import { Drawer } from 'antd'
import { PropsWithChildren } from 'react'

import { drawerStyle } from 'constants/styles/drawerStyle'

/**
 * Provides the blueprint for Funding Cycle Drawers.
 */
export default function FundingCycleDrawer({
  title,
  visible,
  onClose,
  children,
}: PropsWithChildren<{
  title: string
  visible: boolean
  onClose: VoidFunction
}>) {
  return (
    <Drawer {...drawerStyle} visible={visible} onClose={onClose} destroyOnClose>
      <h1>{title}</h1>
      {children}
    </Drawer>
  )
}
