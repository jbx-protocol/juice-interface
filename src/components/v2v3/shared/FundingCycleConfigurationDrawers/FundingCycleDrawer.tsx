import { Drawer } from 'antd'
import { drawerStyle } from 'constants/styles/drawerStyle'
import { PropsWithChildren } from 'react'

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
