import { DownOutlined, UpOutlined } from '@ant-design/icons'
import { Trans, t } from '@lingui/macro'
import { Dropdown, MenuProps } from 'antd'
import { Badge } from 'components/Badge'
import ExternalLink from 'components/ExternalLink'
import { TOP_NAV } from 'constants/fathomEvents'
import { readNetwork } from 'constants/networks'
import { trackFathomGoal } from 'lib/fathom'
import { NetworkName } from 'models/networkName'
import Link from 'next/link'
import { CSSProperties } from 'react'
import Logo from '../Logo'

type DropdownItem = {
  label: JSX.Element
  key: string
}

export type DropdownKey = 'explore' | 'resources' | false

const DesktopDropdown = ({
  label,
  menuProps,
  open,
  toggleOpen,
}: {
  label: JSX.Element | string
  menuProps: MenuProps
  open: boolean
  toggleOpen: VoidFunction
}): JSX.Element => {
  return (
    <Dropdown overlayClassName="p-0" menu={{ ...menuProps }} open={open}>
      <div
        className="flex cursor-pointer items-center font-medium text-black hover:opacity-70 dark:text-slate-100"
        onClick={e => {
          toggleOpen()
          e.stopPropagation()
        }}
      >
        {label}
        <span className="ml-1 flex items-center">
          {open ? <UpOutlined /> : <DownOutlined />}
        </span>
      </div>
    </Dropdown>
  )
}

export const resourcesMenuItems = (): DropdownItem[] => {
  return [
    {
      key: 'discord',
      label: (
        <ExternalLink href="https://discord.gg/wFTh4QnDzk">
          <a
            className="flex cursor-pointer items-center text-black hover:opacity-70 dark:text-slate-100"
            onClick={() => trackFathomGoal(TOP_NAV.DISCORD_CTA)}
          >{t`Join our Discord`}</a>
        </ExternalLink>
      ),
    },
    {
      key: 'juiceboxdao',
      label: (
        <Link href="/@juicebox">
          <a className="text-primary">
            <Trans>JuiceboxDAO</Trans>
          </a>
        </Link>
      ),
    },
    {
      key: 'docs',
      label: (
        <ExternalLink href="https://docs.juicebox.money/">
          <a className="text-primary">
            <Trans>Docs</Trans>
          </a>
        </ExternalLink>
      ),
    },
    {
      key: 'podcast',
      label: (
        <ExternalLink href="https://podcast.juicebox.money/">
          <a className="text-primary">
            <Trans>Podcast</Trans>
          </a>
        </ExternalLink>
      ),
    },
  ]
}

export const exploreMenuItems = (): DropdownItem[] => {
  return [
    {
      key: 'trending',
      label: (
        <Link href="/projects?tab=trending">
          <a className="text-primary">
            <Trans>Trending projects</Trans>
          </a>
        </Link>
      ),
    },
    {
      key: 'recent',
      label: (
        <Link href="/projects?tab=new">
          <a className="text-primary">
            <Trans>Recently listed</Trans>
          </a>
        </Link>
      ),
    },
    {
      key: 'all',
      label: (
        <Link href="/projects?tab=all">
          <a className="text-primary">
            <Trans>All projects</Trans>
          </a>
        </Link>
      ),
    },
  ]
}

export const desktopMenuItems = ({
  resourcesMenuProps,
  exploreMenuProps,
  dropdownOpen,
  setDropdownOpen,
  dropdownIconStyle,
}: {
  resourcesMenuProps: MenuProps
  exploreMenuProps: MenuProps
  dropdownOpen: DropdownKey
  setDropdownOpen: (key: DropdownKey) => void
  dropdownIconStyle: CSSProperties
}) => {
  const toggleDropdown = (key: DropdownKey) => {
    if (dropdownOpen === key) {
      setDropdownOpen(false)
    } else {
      setDropdownOpen(key)
    }
  }
  return [
    {
      key: 'index',
      label: (
        <Link href="/">
          <a className="flex items-center gap-2">
            <Logo />
            {readNetwork.name === NetworkName.goerli && (
              <span>
                <Badge variant="info">Goerli</Badge>
              </span>
            )}
          </a>
        </Link>
      ),
    },
    {
      key: 'explore',
      label: (
        <DesktopDropdown
          {...{
            label: t`Explore`,
            menuProps: exploreMenuProps,
            toggleOpen: () => toggleDropdown('explore'),
            open: dropdownOpen === 'explore',
            dropdownIconStyle,
          }}
        />
      ),
    },
    {
      key: 'resources',
      label: (
        <DesktopDropdown
          {...{
            label: t`Resources`,
            menuProps: resourcesMenuProps,
            toggleOpen: () => toggleDropdown('resources'),
            open: dropdownOpen === 'resources',
            dropdownIconStyle,
          }}
        />
      ),
    },
    {
      key: 'create',
      label: (
        <Link href="/create">
          <a
            className="flex cursor-pointer items-center font-medium text-black hover:opacity-70 dark:text-slate-100 lg:block"
            onClick={() => trackFathomGoal(TOP_NAV.CREATE_A_PROJECT_CTA)}
          >{t`Create a project`}</a>
        </Link>
      ),
    },
  ]
}
