import { Drawer, DrawerProps } from 'antd'
import StakeForNFTContent from 'components/v2/V2Project/StakeForNFTForm'

import { useMemo } from 'react'

import { drawerStyle } from 'constants/styles/drawerStyle'

export function V2StakeForNFTDrawer({
  visible,
  onClose,
}: {
  visible: boolean
  onClose: VoidFunction
}) {
  const memoizedDrawerStyle: Partial<DrawerProps> = useMemo(
    () => drawerStyle,
    [],
  )

  return (
    <Drawer visible={visible} {...memoizedDrawerStyle} onClose={onClose}>
      <StakeForNFTContent onClose={onClose} />
    </Drawer>
  )
}
