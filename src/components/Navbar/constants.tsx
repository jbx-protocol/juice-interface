import { Trans } from '@lingui/macro'

type ResourceItem = {
  label: JSX.Element
  key: string
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
        <a href="https://discord.gg/6jXrJSyDFf" {...linkStyle}>
          Discord
        </a>
      ),
    },
  ]
}
