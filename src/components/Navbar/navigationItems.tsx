import { DownOutlined, UpOutlined } from '@ant-design/icons'
import { t, Trans } from '@lingui/macro'
import { Dropdown, MenuProps } from 'antd'
import { Badge } from 'components/Badge'
import { TOP_NAV } from 'constants/fathomEvents'
import { readNetwork } from 'constants/networks'
import { trackFathomGoal } from 'lib/fathom'
import { NetworkName } from 'models/networkName'
import Link from 'next/link'
import { CSSProperties } from 'react'
import Logo from './Logo'

type ResourceItem = {
  label: JSX.Element
  key: string
}

const DesktopDropDown = ({
  resourcesMenuProps,
  resourcesOpen,
  setResourcesOpen,
}: {
  resourcesMenuProps: MenuProps
  resourcesOpen: boolean
  setResourcesOpen: (resource: boolean) => void
}): JSX.Element => {
  return (
    <Dropdown
      overlayClassName="p-0"
      menu={{ ...resourcesMenuProps }}
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
export const resourcesMenuItems = (): ResourceItem[] => {
  const linkProps = {
    target: '_blank',
    rel: 'noopener noreferrer',
    className: 'text-primary',
  }
  return [
    {
      key: 'docs',
      label: (
        <a href="https://docs.juicebox.money/" {...linkProps}>
          <Trans>Docs</Trans>
        </a>
      ),
    },
    {
      key: 'newsletter',
      label: (
        <a href="https://newsletter.juicebox.money" {...linkProps}>
          <Trans>Newsletter</Trans>
        </a>
      ),
    },
    {
      key: 'podcast',
      label: (
        <a href="https://podcast.juicebox.money/" {...linkProps}>
          <Trans>Podcast</Trans>
        </a>
      ),
    },
    {
      key: 'contact',
      label: (
        <a href="/contact" {...linkProps} target="_self">
          <Trans>Contact</Trans>
        </a>
      ),
    },
  ]
}

export const desktopMenuItems = ({
  resourcesMenuProps,
  resourcesOpen,
  setResourcesOpen,
  dropdownIconStyle,
}: {
  resourcesMenuProps: MenuProps
  resourcesOpen: boolean
  setResourcesOpen: (resource: boolean) => void
  dropdownIconStyle: CSSProperties
}) => [
  {
    key: 'index',
    label: (
      <Link href="/">
        <a className="flex items-center gap-2">
          <Logo />
          <span>
            {readNetwork.name === NetworkName.goerli && (
              <Badge variant="info">Goerli</Badge>
            )}
          </span>
        </a>
      </Link>
    ),
  },
  {
    key: 'projects',
    label: (
      <Link href="/projects">
        <a
          className="flex cursor-pointer items-center font-medium text-black hover:opacity-70 dark:text-slate-100"
          onClick={() => trackFathomGoal(TOP_NAV.EXPLORE_CTA)}
        >{t`Explore`}</a>
      </Link>
    ),
  },
  {
    key: 'discord',
    label: (
      <Link href="https://discord.gg/wFTh4QnDzk">
        <a
          className="flex cursor-pointer items-center font-medium text-black hover:opacity-70 dark:text-slate-100"
          onClick={() => trackFathomGoal(TOP_NAV.DISCORD_CTA)}
        >{t`Discord`}</a>
      </Link>
    ),
  },
  {
    key: 'resources',
    label: (
      <DesktopDropDown
        {...{
          resourcesMenuProps,
          setResourcesOpen,
          resourcesOpen,
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
          className="flex hidden cursor-pointer items-center font-medium text-black hover:opacity-70 dark:text-slate-100 lg:block"
          onClick={() => trackFathomGoal(TOP_NAV.CREATE_A_PROJECT_CTA)}
        >{t`Create a project`}</a>
      </Link>
    ),
  },
]
