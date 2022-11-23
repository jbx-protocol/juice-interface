import { Trans } from '@lingui/macro'

export const HeroHeading = () => <Trans>Fund anything.</Trans>

export const HeroSubheading = () => (
  <Trans>
    The programmable funding protocol for builders and creators. Light enough
    for a group of friends, powerful enough for a global network of anons.{' '}
    <a
      href="/p/juicebox"
      className="text-black underline hover:text-haze-400 hover:underline dark:text-grey-100 dark:hover:text-haze-400"
      style={{
        // TODO: not supported in tailwind
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
    Juicebox gives you the tools to automate your funding so you can focus on
    building.
  </Trans>
)

export const TopProjectsSubheadingTwo = () => (
  <Trans>
    Join{' '}
    <a
      href="/projects"
      className="text-black hover:text-haze-400 hover:underline dark:text-grey-100 dark:hover:text-haze-400"
    >
      hundreds of projects
    </a>{' '}
    sippin' the Juice.
  </Trans>
)
