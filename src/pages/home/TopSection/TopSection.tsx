import { Trans } from '@lingui/macro'
import { XLButton } from 'components/XLButton'
import useMobile from 'hooks/Mobile'
import { useTrendingProjects } from 'hooks/Projects'
import Link from 'next/link'
import { ProjectCarousel } from '../ProjectCarousel'
import { SectionContainer } from '../SectionContainer'
import { SectionHeading } from '../SectionHeading'

const TRENDING_PROJECTS_LIMIT = 8

export function TopSection() {
  const isMobile = useMobile()

  const { data: trendingProjects } = useTrendingProjects(
    TRENDING_PROJECTS_LIMIT,
  )

  return (
    <SectionContainer>
      <SectionHeading
        heading={<Trans>Fund your thing</Trans>}
        subheading={
          <Trans>
            Join thousands of projects using Juicebox to fund, operate, and
            scale their ideas & communities transparently on Ethereum.
          </Trans>
        }
        className="text-5xl md:text-7xl"
      />
      <div className="mb-16 flex w-full justify-center md:w-auto">
        <Link href="/create">
          <a className="w-full md:w-auto">
            <XLButton size="large" type="primary" block={isMobile}>
              <Trans>Create a project</Trans>
            </XLButton>
          </a>
        </Link>
      </div>
      <ProjectCarousel projects={trendingProjects} />
    </SectionContainer>
  )
}
