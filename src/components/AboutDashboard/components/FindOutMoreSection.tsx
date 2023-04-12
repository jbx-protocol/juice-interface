import { Trans } from '@lingui/macro'
import ExternalLink from 'components/ExternalLink'
import { AboutButton } from './Button'
import { SectionContainer } from './SectionContainer'

export const FindOutMoreSection = () => {
  return (
    <SectionContainer className="mb-6 text-center md:py-24">
      <h2 className="font-header text-4xl">
        <Trans>Find out more about us</Trans>
      </h2>
      <p className="text-base text-grey-700 dark:text-slate-200 md:text-lg">
        <Trans>
          Still have questions or want to know more about us? Jump into our
          Discord and come say hello.
        </Trans>
      </p>

      <div className="flex w-full flex-col justify-center gap-3 md:flex-row">
        <ExternalLink href="https://jbdao.org">
          <AboutButton className="stroke-secondary text-primary w-full border bg-transparent">
            Visit jbdao.org
          </AboutButton>
        </ExternalLink>
        <ExternalLink href="https://discord.gg/wFTh4QnDzk">
          <AboutButton className="w-full">
            <Trans>Join our Discord</Trans>
          </AboutButton>
        </ExternalLink>
      </div>
    </SectionContainer>
  )
}
