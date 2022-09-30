import { Trans } from '@lingui/macro'
import ExternalLink from 'components/ExternalLink'

type ResourceItem = {
  label: JSX.Element
  key: string
}

export const resourcesMenuItems = (mobile?: boolean): ResourceItem[] => {
  const linkStyle = {
    color: 'var(--text-primary)',
    fontWeight: mobile ? 400 : 500,
  }
  return [
    {
      key: 'governance',
      label: (
        <ExternalLink
          href="https://vote.juicebox.money/#/jbdao.eth"
          className="nav-dropdown-item"
          style={linkStyle}
        >
          <Trans>Governance</Trans>
        </ExternalLink>
      ),
    },
    {
      key: 'newsletter',
      label: (
        <ExternalLink
          href="https://newsletter.juicebox.money"
          className="nav-dropdown-item"
          style={linkStyle}
        >
          <Trans>Newsletter</Trans>
        </ExternalLink>
      ),
    },
    {
      key: 'podcast',
      label: (
        <ExternalLink
          href="https://podcast.juicebox.money/"
          className="nav-dropdown-item"
          style={linkStyle}
        >
          <Trans>Podcast</Trans>
        </ExternalLink>
      ),
    },
    {
      key: 'peel',
      label: (
        <ExternalLink
          href="https://discord.gg/XvmfY4Hkcz"
          className="nav-dropdown-item"
          style={linkStyle}
        >
          <Trans>PeelDAO</Trans>
        </ExternalLink>
      ),
    },
  ]
}
