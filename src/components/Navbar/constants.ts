import { t } from '@lingui/macro'

type ResourceItem = {
  text: string
  key: string
  link: string
}

export const resourcesMenuItems = (): ResourceItem[] => {
  return [
    {
      key: 'governance',
      text: t`Governance`,
      link: 'https://vote.juicebox.money/#/jbdao.eth',
    },
    {
      key: 'newsletter',
      text: t`Newsletter`,
      link: 'https://newsletter.juicebox.money',
    },
    {
      key: 'podcast',
      text: t`Podcast`,
      link: 'https://podcast.juicebox.money/',
    },
    {
      key: 'peel',
      text: t`PeelDAO`,
      link: 'https://discord.gg/XvmfY4Hkcz',
    },
  ]
}
