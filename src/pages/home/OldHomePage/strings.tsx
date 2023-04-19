import { Trans } from '@lingui/macro'

export const HeroHeading = () => <Trans>Fund anything.</Trans>

export const HeroSubheading = () => (
  <Trans>
    The programmable crypto fundraising protocol for builders and creators.
    Light enough for a group of friends, powerful enough for a global network of
    anons.{' '}
    <a
      href="/@juicebox"
      className="text-black underline hover:text-bluebs-500 hover:underline dark:text-grey-100 dark:hover:text-bluebs-500"
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
    Juicebox gives you the tools to automate web3 fundraising so you can focus
    on building.
  </Trans>
)

export const TopProjectsSubheadingTwo = () => (
  <Trans>
    Join{' '}
    <a
      href="/projects"
      className="text-black hover:text-bluebs-500 hover:underline dark:text-grey-100 dark:hover:text-bluebs-500"
    >
      hundreds of projects
    </a>{' '}
    sippin' the Juice.
  </Trans>
)
