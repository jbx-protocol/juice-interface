import { Trans } from '@lingui/macro'

export const HeroHeading = () => <Trans>Fund anything. </Trans>

export const HeroSubheading = () => (
  <Trans>
    The programmable funding protocol for builders and creators. 
Light enough for a group of friends, powerful enough for a global network of builders.{' '}
    <a
      href="/p/juicebox"
      className="text-primary hover-text-decoration-underline"
      style={{
        textDecoration: 'underline',
        fontWeight: 'inherit',
      }}
    >
      Community-owned
    </a>
    , on Ethereum.
  </Trans>
)

export const TopProjectsHeading = () => (
  <Trans>Fund and operate your thing, your way.</Trans>
)

export const TopProjectsSubheadingOne = () => (
  <Trans>
    Juicebox gives you the tools to automate your funding so you can focus on building.
  </Trans>
)

export const TopProjectsSubheadingTwo = () => (
  <Trans>
    Join{' '}
    <a
      href="/projects"
      className="text-primary hover-text-decoration-underline"
    >
      hundreds of projects
    </a>{' '}
    sippin' the Juice.
  </Trans>
)
