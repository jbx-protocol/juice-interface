import { Trans } from '@lingui/macro'
import { SectionContainer } from './SectionContainer'

export const BuiltByTheBestSection = () => {
  return (
    <SectionContainer className="md:py-24">
      <h2 className="font-header text-4xl">
        <Trans>Built by the best</Trans>
      </h2>
      <p>
        <Trans>
          Huge shoutout to the epic team of people that help build Juicebox and
          keep the dream alive.
        </Trans>
      </p>

      <h1>TODO</h1>
    </SectionContainer>
  )
}
