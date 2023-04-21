import { Trans } from '@lingui/macro'
import { Button } from 'antd'
import ExternalLink from 'components/ExternalLink'
import { JoinOurDiscordButton } from './JoinOurDiscordButton'
import { SectionContainer } from './SectionContainer'

export const FindOutMoreSection = () => {
  return (
    <SectionContainer className="mb-6 text-center md:py-24">
      <h2 className="text-4xl">
        <Trans>Find out more about us</Trans>
      </h2>
      <p className="mx-auto max-w-2xl text-base text-grey-700 dark:text-slate-200 md:text-lg">
        <Trans>
          Still have questions or want to know more about us? Jump into our
          Discord and come say hello.
        </Trans>
      </p>

      <div className="mt-8 flex w-full flex-col justify-center gap-3 md:flex-row">
        <ExternalLink href="https://jbdao.org">
          <Button className="w-full" size="large">
            <Trans>Visit jbdao.org</Trans>
          </Button>
        </ExternalLink>
        <JoinOurDiscordButton className="w-full justify-center" />
      </div>
    </SectionContainer>
  )
}
