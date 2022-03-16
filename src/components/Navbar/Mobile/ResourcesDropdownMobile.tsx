import { t } from '@lingui/macro'
import { Menu } from 'antd'
import ExternalLink from 'components/shared/ExternalLink'
import { useContext } from 'react'
import { ThemeContext } from 'contexts/themeContext'

import { navMenuItemStyles } from '../navStyles'
import { resourcesMenuItems } from '../constants'

const { SubMenu } = Menu

export default function ResourcesDropdownMobile() {
  const { colors } = useContext(ThemeContext).theme

  return (
    <SubMenu
      key="resources"
      title={t`Resources`}
      style={{
        marginLeft: 15,
        marginBottom: 10,
        color: colors.text.primary,
      }}
    >
      {resourcesMenuItems().map(r => (
        <Menu.Item key={r.key}>
          <ExternalLink
            className="nav-dropdown-item"
            href={r.link}
            style={{ ...navMenuItemStyles, fontWeight: 400, marginTop: 0 }}
          >
            {r.text}
          </ExternalLink>
        </Menu.Item>
      ))}
    </SubMenu>
  )
}
