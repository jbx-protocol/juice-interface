import { t } from '@lingui/macro'

export const resourcesMenuItems = () => {
  return [
    {
      text: t`Docs`,
      key: 'docs',
      link: 'https://docs.juicebox.money',
    },
    {
      text: t`Blog`,
      key: 'blog',
      link: 'https://docs.juicebox.money',
    },
    {
      key: 'workspace',
      text: t`Workspace`,
      href: 'https://juicebox.notion.site/',
    },
    {
      key: 'podcast',
      text: t`Podcast`,
      href: 'https://open.spotify.com/show/4G8ji7vofcOx2acXcjXIa4?si=1e5e6e171ed744e8',
    },
    {
      key: 'peel',
      text: t`Peel`,
      href: 'https://discord.gg/XvmfY4Hkcz',
    },
  ]
}
