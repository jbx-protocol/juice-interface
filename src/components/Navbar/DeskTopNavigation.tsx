import { DownOutlined, UpOutlined } from '@ant-design/icons'
import { t, Trans } from '@lingui/macro'
import { Dropdown, Menu, Space } from 'antd'
import Link from 'next/link'
import { CSSProperties, useEffect, useState } from 'react'

import Logo from './Logo'
import { navMenuItemStyles, topNavStyles, topRightNavStyles } from './navStyles'

import { Header } from 'antd/lib/layout/layout'
import Account from './Account'
import { resourcesMenuItems } from './constants'
import NavLanguageSelector from './NavLanguageSelector'
import ThemePicker from './ThemePicker'
import { TransactionsList } from './TransactionList'

const resourcesMenu = (
  <Menu
    items={resourcesMenuItems()}
    style={{ marginTop: -16, marginLeft: -6 }}
  />
)

export default function DeskTopNavigation({
  desktop,
  onClickMenuItems,
}: {
  desktop?: boolean
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

  const menuItemProps = {
    onClick: onClickMenuItems,
    style: navMenuItemStyles,
    className: 'nav-menu-item hover-opacity',
  }

  const externalMenuLinkProps = {
    ...menuItemProps,
    target: '_blank',
    rel: 'noopener noreferrer',
  }

  const desktopDropDown = (
    <Dropdown
      overlay={resourcesMenu}
      overlayStyle={{ padding: 0 }}
      open={resourcesOpen}
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
  )

  const menuItems = desktop
    ? [
        {
          key: 'index',
          label: (
            <Link href="/">
              <a style={{ display: 'inline-block' }}>{<Logo />}</a>
            </Link>
          ),
        },
        {
          key: 'projects',
          label: (
            <Link href="/projects">
              <a {...menuItemProps}>{t`Projects`}</a>
            </Link>
          ),
        },
        {
          key: 'docs',
          label: (
            <Link href="https://info.juicebox.money/">
              <a {...externalMenuLinkProps}>{t`Docs`}</a>
            </Link>
          ),
        },
        {
          key: 'blog',
          label: (
            <Link href="https://info.juicebox.money/blog">
              <a {...externalMenuLinkProps}>{t`Blog`}</a>
            </Link>
          ),
        },
        {
          key: 'resources',
          label: desktopDropDown,
        },
      ]
    : [
        {
          key: 'projects',
          label: (
            <Link href="/projects">
              <a {...menuItemProps}>{t`Projects`}</a>
            </Link>
          ),
        },
        {
          key: 'docs',
          label: (
            <Link href="https://info.juicebox.money/">
              <a {...externalMenuLinkProps}>{t`Docs`}</a>
            </Link>
          ),
        },
        {
          key: 'blog',
          label: (
            <Link href="https://info.juicebox.money/blog">
              <a {...externalMenuLinkProps}>{t`Blog`}</a>
            </Link>
          ),
        },
        {
          key: 'resources',
          label: (
            <Link href="">
              <a
                className="nav-menu-item hover-opacity"
                style={{ ...navMenuItemStyles }}
              >
                {t`Resources`}
              </a>
            </Link>
          ),
          children: [...resourcesMenuItems(true)],
        },
      ]

  return (
    <Header className="top-nav" style={{ ...topNavStyles }}>
      <Menu
        items={menuItems}
        mode="inline"
        style={{
          display: 'flex',
          flexDirection: desktop ? 'row' : 'column',
          width: desktop ? 500 : 'auto',
        }}
        selectable={false}
      />
      <Space size="middle" style={{ ...topRightNavStyles }}>
        <NavLanguageSelector />
        <ThemePicker />
        <TransactionsList
          listStyle={{
            position: 'absolute',
            top: 70,
            right: 30,
          }}
        />
        <Account />
      </Space>
    </Header>
  )
}
