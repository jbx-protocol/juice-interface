import { DownOutlined, UpOutlined } from '@ant-design/icons'
import { t, Trans } from '@lingui/macro'
import { Dropdown, Menu, Space } from 'antd'
import ExternalLink from 'components/ExternalLink'
import Link from 'next/link'
import { CSSProperties, useEffect, useState } from 'react'

import Logo from './Logo'
import {
  navDropdownItem,
  navMenuItemStyles,
  topLeftNavStyles,
} from './navStyles'

import { resourcesMenuItems } from './constants'

function NavMenuItem({
  text,
  route,
  onClick,
}: {
  text: string
  route?: string
  onClick?: VoidFunction
}) {
  if (!route) {
    return (
      <div
        className="nav-menu-item hover-opacity"
        onClick={onClick}
        role="button"
        style={navMenuItemStyles}
      >
        {text}
      </div>
    )
  }

  const external = route?.startsWith('http')
  if (external) {
    return (
      <ExternalLink
        className="nav-menu-item hover-opacity"
        style={navMenuItemStyles}
        href={route}
        onClick={onClick}
        target="_blank"
        rel="noreferrer"
      >
        {text}
      </ExternalLink>
    )
  }
  return (
    <Link href={route}>
      <a
        className="nav-menu-item hover-opacity"
        onClick={onClick}
        style={navMenuItemStyles}
      >
        {text}
      </a>
    </Link>
  )
}

const resourcesMenu = (
  <Menu style={{ marginTop: -16, marginLeft: -6 }}>
    {resourcesMenuItems().map(r => (
      <Menu.Item key={r.key}>
        <ExternalLink
          className="nav-dropdown-item"
          href={r.link}
          style={navDropdownItem}
        >
          {r.text}
        </ExternalLink>
      </Menu.Item>
    ))}
  </Menu>
)

export function TopLeftNavItems({
  mobile,
  onClickMenuItems,
}: {
  mobile?: boolean
  onClickMenuItems?: VoidFunction
}) {
  const [resourcesOpen, setResourcesOpen] = useState<boolean>(false)
  const dropdownIconStyle: CSSProperties = {
    fontSize: 13,
    marginLeft: 7,
  }

  // Close resources dropdown when clicking anywhere in the window except the dropdown items
  useEffect(() => {
    function handleClick() {
      setResourcesOpen(false)
    }
    window.addEventListener('click', handleClick)
    return () => window.removeEventListener('click', handleClick)
  }, [])

  return (
    <Space
      size={mobile ? 0 : 'large'}
      style={{ ...topLeftNavStyles }}
      direction={mobile ? 'vertical' : 'horizontal'}
    >
      {!mobile && (
        <Link href="/">
          <a style={{ display: 'inline-block' }}>{<Logo />}</a>
        </Link>
      )}
      <NavMenuItem
        text={t`Projects`}
        onClick={onClickMenuItems}
        route="/projects"
      />
      <NavMenuItem
        text={t`Docs`}
        onClick={onClickMenuItems}
        route="https://info.juicebox.money/"
      />
      <NavMenuItem
        text={t`Blog`}
        onClick={onClickMenuItems}
        route="https://info.juicebox.money/blog"
      />

      {!mobile && (
        <Dropdown
          overlay={resourcesMenu}
          overlayStyle={{ padding: 0 }}
          visible={resourcesOpen}
        >
          <div
            className="nav-menu-item hover-opacity"
            onClick={e => {
              setResourcesOpen(!resourcesOpen)
              e.stopPropagation()
            }}
            style={{ ...navMenuItemStyles }}
          >
            <Trans>Resources</Trans>
            {resourcesOpen ? (
              <UpOutlined style={dropdownIconStyle} />
            ) : (
              <DownOutlined style={dropdownIconStyle} />
            )}
          </div>
        </Dropdown>
      )}
    </Space>
  )
}
