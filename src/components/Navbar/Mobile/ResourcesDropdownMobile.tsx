import { t } from '@lingui/macro'
import { Menu } from 'antd'
import ExternalLink from 'components/ExternalLink'

import { navMenuItemStyles } from '../navStyles'
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
      {resourcesMenuItems().map(r => (
        <Menu.Item key={r.key}>
          <ExternalLink
            className="nav-dropdown-item"
            href={r.link}
            style={{ ...navMenuItemStyles, fontWeight: 400 }}
          >
            {r.text}
          </ExternalLink>
        </Menu.Item>
      ))}
    </SubMenu>
  )
}
