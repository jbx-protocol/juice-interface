import { DrawerProps } from 'antd'

export const drawerStyle: Partial<DrawerProps> = {
  placement: 'right',
  width: Math.min(640, window.innerWidth * 0.9),
}
