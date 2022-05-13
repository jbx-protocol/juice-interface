import { Drawer } from 'antd'

import { drawerStyle } from 'constants/styles/drawerStyle'
import { FundingDrawersSubtitles } from '..'

export function V2ReconfigureFundingDrawer({
  visible,
  onClose,
  title,
  content,
}: {
  visible: boolean
  onClose: VoidFunction
  title: JSX.Element
  content: JSX.Element
}) {
  return (
    <Drawer visible={visible} {...drawerStyle} onClose={onClose} destroyOnClose>
      <h3>{title}</h3>
      {FundingDrawersSubtitles}
      <br />
      {content}
    </Drawer>
  )
}
