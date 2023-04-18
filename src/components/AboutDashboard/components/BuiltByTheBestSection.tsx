import { Trans } from '@lingui/macro'
import { SectionContainer } from './SectionContainer'

export const BuiltByTheBestSection = () => {
  return (
    <SectionContainer className="text-center md:py-24">
      <h2 className="font-header text-4xl">
        <Trans>Built by the best</Trans>
      </h2>
      <p className="mx-auto max-w-3xl text-lg text-grey-700 dark:text-slate-200 md:text-xl">
        <Trans>
          Huge shoutout to the epic team of people that help build Juicebox and
          keep the dream alive.
        </Trans>
      </p>

      <h1>TODO</h1>
    </SectionContainer>
  )
}
