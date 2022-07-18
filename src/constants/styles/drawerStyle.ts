import { DrawerProps } from 'antd'

let width = 640 * 0.9
if (typeof window !== 'undefined') {
  width = window.innerWidth
}

export const drawerStyle: Partial<DrawerProps> = {
  placement: 'right',
  width: Math.min(640, width),
}
