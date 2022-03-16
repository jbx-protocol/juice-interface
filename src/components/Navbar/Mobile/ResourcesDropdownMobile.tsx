import { t } from '@lingui/macro'
import { Menu } from 'antd'
import ExternalLink from 'components/shared/ExternalLink'
import { PropsWithChildren, useContext } from 'react'
import { ThemeContext } from 'contexts/themeContext'

import { navMenuItemStyles } from '../navStyles'
import { resourcesMenuItems } from '../constants'

const { SubMenu } = Menu

function ResourcesItem({
  href,
  children,
}: PropsWithChildren<{
  href?: string
  onClick?: VoidFunction
}>) {
  return (
    <ExternalLink
      className="nav-dropdown-item"
      href={href}
      style={{ ...navMenuItemStyles, fontWeight: 400, marginTop: 0 }}
    >
      {children}
    </ExternalLink>
  )
}

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
          <ResourcesItem href={r.link}>{r.text}</ResourcesItem>
        </Menu.Item>
      ))}
    </SubMenu>
  )
}
