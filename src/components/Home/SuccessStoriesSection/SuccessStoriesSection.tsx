import { Trans } from '@lingui/macro'
import { ProjectCarousel } from 'components/Home/ProjectCarousel'
import { SectionContainer } from 'components/Home/SectionContainer'
import { SectionHeading } from 'components/Home/SectionHeading'
import { SuccessStoriesCard } from 'components/Home/SuccessStoriesSection/SuccessStoriesCard'
import { XLButton } from 'components/buttons/XLButton'
import { CASE_STUDY_PROJECTS } from 'constants/successStoryProjects'
import { useMedia } from 'contexts/Theme/useMedia'
import { useProjectsQuery } from 'generated/graphql'
import { client } from 'lib/apollo/client'
import Link from 'next/link'

export function SuccessStoriesSection() {
  const { data } = useProjectsQuery({
    client,
    variables: {
      where: {
        id_in: CASE_STUDY_PROJECTS.map(p => p.id),
      },
    },
  })
  const projects = data?.projects

  const isXl = useMedia('(min-width: 1280px)')

  if (!data) return null

  const topProjects = CASE_STUDY_PROJECTS.map(p => {
    const project = projects?.find(proj => proj.id === p.id)
    if (!project) return

    return {
      project,
      tags: p.tags,
      nameOverride: p.nameOverride,
      imageOverride: p.imageOverride,
    }
  }).filter((p): p is NonNullable<typeof p> => !!p)

  const cards = topProjects.map(project => (
    <SuccessStoriesCard
      key={project.project?.projectId}
      project={project.project}
      tags={project.tags}
      nameOverride={project.nameOverride}
      imageOverride={project.imageOverride}
    />
  ))

  return (
    <SectionContainer>
      <SectionHeading
        heading={<Trans>Success stories</Trans>}
        subheading={
          <Trans>
            Juicebox gives you the tools to automate web3 fundraising so you can
            focus on building. Join thousands of projects sippin' the Juice.
          </Trans>
        }
      />
      {isXl ? (
        <div className="flex justify-center gap-8">{cards}</div>
      ) : (
        <ProjectCarousel items={cards} />
      )}

      <div className="w-full text-center">
        <div className="mt-16 flex flex-col flex-wrap justify-center gap-3 md:flex-row">
          <Link href="/success-stories/constitutiondao">
            <XLButton type="default" size="large">
              <Trans>Read case studies</Trans>
            </XLButton>
          </Link>
          <Link href="/create">
            <XLButton type="primary" size="large">
              <Trans>Create a project</Trans>
            </XLButton>
          </Link>
        </div>
      </div>
    </SectionContainer>
  )
}
