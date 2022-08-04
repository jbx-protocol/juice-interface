import { Trans } from '@lingui/macro'

export const HeroHeading = () => <Trans>Fund anything. Grow together. </Trans>

export const HeroSubheading = () => (
  <Trans>
    The programmable funding protocol. Light enough for a group of friends,
    powerful enough for a global network of anons.{' '}
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
    Juicebox puts the fun back in funding so you can focus on building.
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
