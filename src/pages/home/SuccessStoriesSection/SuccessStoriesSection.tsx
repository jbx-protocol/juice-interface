import { t, Trans } from '@lingui/macro'
import { XLButton } from 'components/XLButton'
import useMobile from 'hooks/Mobile'
import { useProjectsQuery } from 'hooks/Projects'
import Link from 'next/link'
import { ProjectCarousel } from '../ProjectCarousel'
import { SectionContainer } from '../SectionContainer'
import { SectionHeading } from '../SectionHeading'

export function SuccessStoriesSection() {
  const { data: topProjects } = useProjectsQuery({
    pageSize: 4,
  })

  const isMobile = useMobile()

  return (
    <SectionContainer>
      <SectionHeading
        heading={t`Success stories`}
        subheading={
          <Trans>
            Juicebox gives you the tools to automate web3 fundraising so you can
            focus on building. Join thousands of projects sippin' the Juice.
          </Trans>
        }
      />
      <div className="flex justify-center">
        <ProjectCarousel projects={topProjects} />
      </div>
      <div className="w-full text-center">
        <div className="mt-16 flex flex-col flex-wrap justify-center gap-3 md:flex-row">
          {/* <Link href="/case-studies">
            <a>
              <XLButton size="large" block={isMobile}>
                <Trans>Case studies</Trans>
              </XLButton>
            </a>
          </Link> */}
          <Link href="/create">
            <a>
              <XLButton size="large" type="primary" block={isMobile}>
                <Trans>Create a project</Trans>
              </XLButton>
            </a>
          </Link>
        </div>
      </div>
    </SectionContainer>
  )
}
