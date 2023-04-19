import { Trans } from '@lingui/macro'
import { FaqList } from '../FaqList'
import { SectionContainer } from './SectionContainer'
import { SectionHeading } from './SectionHeading'

export function FaqSection() {
  return (
    <SectionContainer>
      <SectionHeading heading={<Trans>FAQs</Trans>} />
      <div className="mx-auto max-w-3xl">
        <FaqList />
      </div>
    </SectionContainer>
  )
}
