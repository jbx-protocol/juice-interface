import { t } from '@lingui/macro'
import { MenuProps } from 'antd'

type MenuItem = Required<MenuProps>['items'][number]

export const resourcesMenuItems = (): MenuItem[] => {
  return [
    {
      key: 'governance',
      label: t`Governance`,
      onClick: () => {
        window?.open('https://vote.juicebox.money/#/jbdao.eth', '_blank')
      },
      className: 'nav-dropdown-item',
      style: {
        color: 'var(--text-primary)',
        fontWeight: 500,
      },
    },
    {
      key: 'newsletter',
      label: t`Newsletter`,
      onClick: () => {
        window?.open('https://newsletter.juicebox.money', '_blank')
      },
      className: 'nav-dropdown-item',
      style: {
        color: 'var(--text-primary)',
        fontWeight: 500,
      },
    },
    {
      key: 'podcast',
      label: t`Podcast`,
      onClick: () => {
        window?.open('https://podcast.juicebox.money', '_blank')
      },
      className: 'nav-dropdown-item',
      style: {
        color: 'var(--text-primary)',
        fontWeight: 500,
      },
    },
    {
      key: 'peel',
      label: t`PeelDAO`,
      onClick: () => {
        window?.open('https://discord.gg/XvmfY4Hkcz', '_blank')
      },
      className: 'nav-dropdown-item',
      style: {
        color: 'var(--text-primary)',
        fontWeight: 500,
      },
    },
  ]
}
