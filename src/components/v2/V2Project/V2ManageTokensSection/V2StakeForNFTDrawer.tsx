import { Drawer, DrawerProps } from 'antd'
import StakeForNFTContent from 'components/v2/V2Project/StakeForNFTForm'

import { useMemo } from 'react'

import { drawerStyle } from 'constants/styles/drawerStyle'

export function V2StakeForNFTDrawer({
  visible,
  onSave,
  onClose,
}: {
  visible: boolean
  onSave: VoidFunction
  onClose: VoidFunction
}) {
  const memoizedDrawerStyle: Partial<DrawerProps> = useMemo(
    () => drawerStyle,
    [],
  )

  return (
    <Drawer visible={visible} {...memoizedDrawerStyle} onClose={onClose}>
      <StakeForNFTContent onFinish={onSave} onClose={onClose} />
    </Drawer>
  )
}
