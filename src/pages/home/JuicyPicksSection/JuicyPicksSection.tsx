import { t, Trans } from '@lingui/macro'
import useMobile from 'hooks/Mobile'
import { SectionContainer } from '../SectionContainer'
import { SectionHeading } from '../SectionHeading'
import { JuicyPicks } from './JuicyPicks'
import { JuicyPicksMobile } from './JuicyPicksMobile'

export function JuicyPicksSection() {
  const isMobile = useMobile()
  return (
    <SectionContainer>
      <SectionHeading
        heading={t`Juicy picks`}
        subheading={
          <Trans>Peep our selection of top trending projects this month.</Trans>
        }
      />
      {isMobile ? <JuicyPicksMobile /> : <JuicyPicks />}
    </SectionContainer>
  )
}
