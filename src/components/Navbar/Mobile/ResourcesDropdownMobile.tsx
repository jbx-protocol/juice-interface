import { t } from '@lingui/macro'
import { Menu } from 'antd'

import { resourcesMenuItems } from '../constants'

const { SubMenu } = Menu

export default function ResourcesDropdownMobile() {
  return (
    <SubMenu
      key="resources"
      title={t`Resources`}
      style={{
        marginLeft: 15,
      }}
    >
      {resourcesMenuItems(true).map(r => (
        <Menu.Item key={r.key}>{r.label}</Menu.Item>
      ))}
    </SubMenu>
  )
}
