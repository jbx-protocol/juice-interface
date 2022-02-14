import { t } from '@lingui/macro'
import { Menu } from 'antd'
import SubMenu from 'antd/lib/menu/SubMenu'
import ExternalLink from 'components/shared/ExternalLink'
import { useContext } from 'react'
import { ThemeContext } from 'contexts/themeContext'

import { navMenuItemStyles } from '../navStyles'

function ResourcesItem({
  text,
  route,
  onClick,
}: {
  text: string
  route?: string
  onClick?: VoidFunction
}) {
  return (
    <ExternalLink
      className="nav-dropdown-item"
      href={route}
      onClick={onClick}
      style={{ ...navMenuItemStyles, fontWeight: 400, marginTop: 0 }}
    >
      {text}
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
        // display: 'flex'
      }}
    >
      <Menu.Item key="1">
        <ResourcesItem
          key="docs"
          text={t`Docs`}
          route="https://docs.juicebox.money"
        />
      </Menu.Item>
      <Menu.Item key="2">
        <ResourcesItem
          key="blog"
          text={t`Blog`}
          route="https://blog.juicebox.money"
        />
      </Menu.Item>
      <Menu.Item key="3">
        <ResourcesItem
          key="workspace"
          text={t`Workspace`}
          route="https://juicebox.notion.site/"
        />
      </Menu.Item>
      <Menu.Item key="4">
        <ResourcesItem
          key="podcast"
          text={t`Podcast`}
          route="https://open.spotify.com/show/4G8ji7vofcOx2acXcjXIa4?si=1e5e6e171ed744e8"
        />
      </Menu.Item>
      <Menu.Item key="5">
        <ResourcesItem
          key="peel"
          text={t`Peel`}
          route="https://discord.gg/XvmfY4Hkcz"
        />
      </Menu.Item>
    </SubMenu>
  )
}
