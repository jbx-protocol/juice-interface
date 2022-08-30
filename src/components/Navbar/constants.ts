import { t } from '@lingui/macro'

type ResourceItem = {
  text: string
  key: string
  link: string
}

export const resourcesMenuItems = (): ResourceItem[] => {
  return [
    {
      text: t`Governance`,
      key: 'governance',
      link: 'https://vote.juicebox.money/#/jbdao.eth',
    },
    {
      text: t`Newsletter`,
      key: 'newsletter',
      link: 'https://newsletter.juicebox.money',
    },
    {
      key: 'podcast',
      text: t`Podcast`,
      link: 'https://open.spotify.com/show/4G8ji7vofcOx2acXcjXIa4?si=1e5e6e171ed744e8',
    },
    {
      key: 'peel',
      text: t`PeelDAO`,
      link: 'https://discord.gg/XvmfY4Hkcz',
    },
  ]
}
