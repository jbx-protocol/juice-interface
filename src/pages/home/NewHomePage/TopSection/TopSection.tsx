import { ArrowSmallRightIcon } from '@heroicons/react/24/outline'
import { Trans } from '@lingui/macro'
import { Badge } from 'components/Badge'
import { ProjectTag } from 'components/ProjectTags/ProjectTag'
import { XLButton } from 'components/XLButton'
import { useTrendingProjects } from 'hooks/Projects'
import { ProjectTagName } from 'models/project-tags'
import Link from 'next/link'
import { HomepageProjectCard } from '../HomepageProjectCard'
import { ProjectCarousel } from '../ProjectCarousel'
import { SectionContainer } from '../SectionContainer'
import { SectionHeading } from '../SectionHeading'

const TRENDING_PROJECTS_LIMIT = 10

const HEADER_TAGS: ProjectTagName[] = [
  'dao',
  'nfts',
  'fundraising',
  'art',
  'business',
]

export function TopSection() {
  const { data: trendingProjects } = useTrendingProjects(
    TRENDING_PROJECTS_LIMIT,
  )

  return (
    <SectionContainer className="pt-6 pb-24 md:px-0 md:pt-10">
      <div className="flex justify-center">
        <ul className="mb-5 flex gap-2 overflow-y-auto py-4">
          {HEADER_TAGS.map(tag => (
            <li key={tag}>
              <Link href={`/projects?tab=all&tags=${tag}`}>
                <a>
                  <ProjectTag tag={tag} clickable />
                </a>
              </Link>
            </li>
          ))}
          <li>
            <Link href="/projects">
              <a>
                <Badge variant="default" clickable>
                  <Trans>All</Trans>
                  <ArrowSmallRightIcon className="inline h-4 w-4" />
                </Badge>
              </a>
            </Link>
          </li>
        </ul>
      </div>
      <SectionHeading
        className="mb-8"
        headingClassName="text-5xl md:text-7xl"
        heading={<Trans>Fund your thing</Trans>}
        subheading={
          <Trans>
            Join thousands of projects using Juicebox to fund, operate, and
            scale their ideas & communities transparently on Ethereum.
          </Trans>
        }
      />
      <div className="mb-16 flex w-full justify-center md:w-auto">
        <Link href="/create">
          <a className="w-full md:w-auto">
            <XLButton size="large" type="primary" className="w-full md:w-auto">
              <Trans>Create a project</Trans>
            </XLButton>
          </a>
        </Link>
      </div>
      {trendingProjects ? (
        <ProjectCarousel
          items={trendingProjects?.map(p => (
            <HomepageProjectCard project={p} key={p.id} />
          ))}
        />
      ) : null}
    </SectionContainer>
  )
}
