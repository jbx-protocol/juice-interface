import { Trans } from '@lingui/macro'

export const HeroHeading = () => <Trans>Fund anything.</Trans>

export const HeroSubheading = () => (
  <Trans>
    Hundreds of projects of all sizes—from indie NFT projects to multi-million
    dollar fundraisers—use Juicebox to raise funds, manage their treasuries, and
    grow their communities on Ethereum.{' '}
    <a
      // todo get rid of hover-text
      className="hover-text-decoration-underline cursor-pointer text-sm text-grey-500 dark:text-grey-300"
      role="button"
      onClick={() => {
        document
          .getElementById('how-it-works')
          ?.scrollIntoView({ behavior: 'smooth' })
      }}
    >
      <em>Learn how it works 🡒</em>
    </a>
  </Trans>
)

export const TopProjectsHeading = () => (
  <Trans>Bring your project to life.</Trans>
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
