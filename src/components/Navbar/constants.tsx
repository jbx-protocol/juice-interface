import { DownOutlined, UpOutlined } from '@ant-design/icons'
import { t, Trans } from '@lingui/macro'
import { Button, Dropdown } from 'antd'
import Link from 'next/link'
import { CSSProperties } from 'react'
import Account from './Account'
import Logo from './Logo'
import ThemePickerMobile from './Mobile/ThemePickerMobile'
import NavLanguageSelector from './NavLanguageSelector'
import { navMenuItemStyles } from './navStyles'

type ResourceItem = {
  label: JSX.Element
  key: string
}
const menuItemProps = {
  style: navMenuItemStyles,
  className: 'nav-menu-item hover-opacity',
}

const externalMenuLinkProps = {
  ...menuItemProps,
  target: '_blank',
  rel: 'noopener noreferrer',
}

export const DesktopDropDown = ({
  resourcesMenu,
  resourcesOpen,
  setResourcesOpen,
  dropdownIconStyle,
}: {
  resourcesMenu: JSX.Element
  resourcesOpen: boolean
  setResourcesOpen: (resource: boolean) => void
  dropdownIconStyle: CSSProperties
}): JSX.Element => {
  return (
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
  )
}
export const resourcesMenuItems = (mobile?: boolean): ResourceItem[] => {
  const linkStyle = {
    className: 'nav-dropdown-item',
    target: '_blank',
    rel: 'noopener noreferrer',
    style: {
      color: 'var(--text-primary)',
      fontWeight: mobile ? 400 : 500,
    },
  }
  return [
    {
      key: 'governance',
      label: (
        <a href="https://vote.juicebox.money/#/jbdao.eth" {...linkStyle}>
          <Trans>Governance</Trans>
        </a>
      ),
    },
    {
      key: 'newsletter',
      label: (
        <a href="https://newsletter.juicebox.money" {...linkStyle}>
          <Trans>Newsletter</Trans>
        </a>
      ),
    },
    {
      key: 'podcast',
      label: (
        <a href="https://podcast.juicebox.money/" {...linkStyle}>
          <Trans>Podcast</Trans>
        </a>
      ),
    },
    {
      key: 'peel',
      label: (
        <a href="https://discord.gg/XvmfY4Hkcz" {...linkStyle}>
          <Trans>PeelDAO</Trans>
        </a>
      ),
    },
  ]
}

export const desktopMenuItems = ({
  resourcesMenu,
  resourcesOpen,
  setResourcesOpen,
  dropdownIconStyle,
}: {
  resourcesMenu: JSX.Element
  resourcesOpen: boolean
  setResourcesOpen: (resource: boolean) => void
  dropdownIconStyle: CSSProperties
}) => [
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
    label: (
      <DesktopDropDown
        {...{
          resourcesMenu,
          setResourcesOpen,
          resourcesOpen,
          dropdownIconStyle,
        }}
      />
    ),
  },
]

export const mobileNavItems = ({
  isConnected,
  disconnect,
  collapseNav,
}: {
  isConnected: boolean
  disconnect: () => void
  collapseNav: () => void
}) => [
  {
    key: 'projects',
    label: (
      <Link href="/projects">
        <a {...{ menuItemProps, collapseNav }}>{t`Projects`}</a>
      </Link>
    ),
  },
  {
    key: 'docs',
    label: (
      <Link href="https://info.juicebox.money/">
        <a {...{ ...externalMenuLinkProps, collapseNav }}>{t`Docs`}</a>
      </Link>
    ),
  },
  {
    key: 'blog',
    label: (
      <Link href="https://info.juicebox.money/blog">
        <a {...{ ...externalMenuLinkProps, collapseNav }}>{t`Blog`}</a>
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
  { key: 'language-picker', label: <NavLanguageSelector /> },
  { key: 'theme-picker', label: <ThemePickerMobile /> },
  {
    key: 'account',
    label: <Account />,
  },
  {
    key: 'disconnect',
    label: isConnected ? (
      <Button onClick={disconnect} style={{ marginTop: 10 }} block>
        <Trans>Disconnect</Trans>
      </Button>
    ) : null,
  },
]
