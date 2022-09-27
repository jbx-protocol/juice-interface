import { t } from '@lingui/macro'
import { CSSProperties } from 'react'

type ResourceItem = {
  label: string
  key: string
  link: string
  className: string
  style: CSSProperties
}

export const resourcesMenuItems = (): ResourceItem[] => {
  return [
    {
      key: 'governance',
      label: t`Governance`,
      link: 'https://vote.juicebox.money/#/jbdao.eth',
      className: 'nav-dropdown-item',
      style: {
        color: 'var(--text-primary)',
        fontWeight: 500,
      },
    },
    {
      key: 'newsletter',
      label: t`Newsletter`,
      link: 'https://newsletter.juicebox.money',
      className: 'nav-dropdown-item',
      style: {
        color: 'var(--text-primary)',
        fontWeight: 500,
      },
    },
    {
      key: 'podcast',
      label: t`Podcast`,
      link: 'https://podcast.juicebox.money/',
      className: 'nav-dropdown-item',
      style: {
        color: 'var(--text-primary)',
        fontWeight: 500,
      },
    },
    {
      key: 'peel',
      label: t`PeelDAO`,
      link: 'https://discord.gg/XvmfY4Hkcz',
      className: 'nav-dropdown-item',
      style: {
        color: 'var(--text-primary)',
        fontWeight: 500,
      },
    },
  ]
}
