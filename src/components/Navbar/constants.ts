import { t } from '@lingui/macro'

type ResourceItem = {
  text: string
  key: string
  link: string
}

export const resourcesMenuItems = (): ResourceItem[] => {
  return [
    {
      text: t`Docs`,
      key: 'docs',
      link: 'https://info.juicebox.money/docs',
    },
    {
      text: t`Blog`,
      key: 'blog',
      link: 'https://info.juicebox.money/blog',
    },
    {
      key: 'workspace',
      text: t`Workspace`,
      link: 'https://juicebox.notion.site/',
    },
    {
      key: 'podcast',
      text: t`Podcast`,
      link: 'https://open.spotify.com/show/4G8ji7vofcOx2acXcjXIa4?si=1e5e6e171ed744e8',
    },
    {
      key: 'peel',
      text: t`Peel`,
      link: 'https://discord.gg/XvmfY4Hkcz',
    },
  ]
}
