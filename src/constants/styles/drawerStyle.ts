import { DrawerProps } from 'antd'

export const drawerStyle: Partial<DrawerProps> = {
  placement: 'right',
  width: Math.min(640, window ? window.innerWidth : 640 * 0.9),
}
