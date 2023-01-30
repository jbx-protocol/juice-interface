import { DownOutlined, UpOutlined } from '@ant-design/icons'
import { t, Trans } from '@lingui/macro'
import { Button, Dropdown } from 'antd'
import Link from 'next/link'
import { CSSProperties } from 'react'
import Account from './Account'
import Logo from './Logo'
import ThemePickerMobile from './Mobile/ThemePickerMobile'
import NavLanguageSelector from './NavLanguageSelector'

type ResourceItem = {
  label: JSX.Element
  key: string
}

const externalMenuLinkProps = {
  target: '_blank',
  rel: 'noopener noreferrer',
}

const DesktopDropDown = ({
  resourcesMenu,
  resourcesOpen,
  setResourcesOpen,
}: {
  resourcesMenu: JSX.Element
  resourcesOpen: boolean
  setResourcesOpen: (resource: boolean) => void
}): JSX.Element => {
  return (
    <Dropdown
      overlayClassName="p-0"
      overlay={resourcesMenu}
      open={resourcesOpen}
    >
      <div
        className="flex cursor-pointer items-center font-medium text-black hover:opacity-70 dark:text-slate-100"
        onClick={e => {
          setResourcesOpen(!resourcesOpen)
          e.stopPropagation()
        }}
      >
        <Trans>Resources</Trans>
        <span className="ml-1">
          {resourcesOpen ? <UpOutlined /> : <DownOutlined />}
        </span>
      </div>
    </Dropdown>
  )
}
export const resourcesMenuItems = (mobile?: boolean): ResourceItem[] => {
  const linkStyle = {
    target: '_blank',
    rel: 'noopener noreferrer',
    style: {
      color: 'var(--text-primary)',
      fontWeight: mobile ? 400 : 500,
    },
  }
  return [
    {
      key: 'docs',
      label: (
        <a href="https://info.juicebox.money/" {...linkStyle}>
          <Trans>Docs</Trans>
        </a>
      ),
    },
    {
      key: 'governance',
      label: (
        <a href="https://juicetool.xyz/nance/juicebox" {...linkStyle}>
          <Trans>Governance</Trans>
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
      key: 'newsletter',
      label: (
        <a href="https://newsletter.juicebox.money" {...linkStyle}>
          <Trans>Newsletter</Trans>
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
        <a>
          <Logo />
        </a>
      </Link>
    ),
  },
  {
    key: 'projects',
    label: (
      <Link href="/projects">
        <a className="flex cursor-pointer items-center font-medium text-black hover:opacity-70 dark:text-slate-100">{t`Projects`}</a>
      </Link>
    ),
  },
  {
    key: 'discord',
    label: (
      <Link href="https://discord.gg/wFTh4QnDzk">
        <a className="flex cursor-pointer items-center font-medium text-black hover:opacity-70 dark:text-slate-100">{t`Discord`}</a>
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
        <a
          className="flex cursor-pointer items-center font-medium text-black hover:opacity-70 dark:text-slate-100"
          {...{ ...collapseNav }}
        >{t`Projects`}</a>
      </Link>
    ),
  },
  {
    key: 'discord',
    label: (
      <Link href="https://discord.gg/wFTh4QnDzk">
        <a
          className="flex cursor-pointer items-center font-medium text-black hover:opacity-70 dark:text-slate-100"
          {...{ ...externalMenuLinkProps, ...collapseNav }}
        >{t`Discord`}</a>
      </Link>
    ),
  },
  {
    key: 'resources',
    label: (
      <Link href="">
        <a className="flex cursor-pointer items-center font-medium text-black hover:opacity-70 dark:text-slate-100">
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
      <Button className="mt-2" onClick={disconnect} block>
        <Trans>Disconnect</Trans>
      </Button>
    ) : null,
  },
]
