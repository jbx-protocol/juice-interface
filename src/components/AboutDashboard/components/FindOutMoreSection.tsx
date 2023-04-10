import { Trans } from '@lingui/macro'
import ExternalLink from 'components/ExternalLink'
import Link from 'next/link'
import { twMerge } from 'tailwind-merge'
import { SectionContainer } from './SectionContainer'

export const FindOutMoreSection = () => {
  return (
    <SectionContainer className="md:py-24">
      <h2 className="font-header text-4xl">
        <Trans>Find out more about us</Trans>
      </h2>
      <p>
        <Trans>
          Our team is growing fast and we're always looking for smart people.
        </Trans>
      </p>

      <div className="flex flex-col justify-center gap-3 md:flex-row">
        <Link href="/@juicebox">
          <a>
            <Button className="stroke-secondary text-primary border bg-transparent">
              Juicebox DAO
            </Button>
          </a>
        </Link>
        <ExternalLink href="https://discord.gg/wFTh4QnDzk">
          <Button>
            <Trans>Join our Discord</Trans>
          </Button>
        </ExternalLink>
      </div>
    </SectionContainer>
  )
}

const Button: React.FC<{ className?: string }> = ({ className, children }) => {
  return (
    <button
      className={twMerge(
        'rounded-md bg-bluebs-400 px-4 py-2 text-white',
        className,
      )}
    >
      {children}
    </button>
  )
}
