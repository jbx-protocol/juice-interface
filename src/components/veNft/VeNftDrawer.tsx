import { Drawer, DrawerProps } from 'antd'

import { useMemo } from 'react'

import VeNftContent from 'components/veNft/VeNftContent'

import { drawerStyle } from 'constants/styles/drawerStyle'

export function VeNftDrawer({
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
    <Drawer
      {...memoizedDrawerStyle}
      visible={visible}
      onClose={onClose}
      destroyOnClose
    >
      <VeNftContent />
    </Drawer>
  )
}
