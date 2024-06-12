import { Trans } from '@lingui/macro'
import { ProjectCarousel } from 'components/Home/ProjectCarousel'
import { SuccessStoriesCard } from 'components/Home/SuccessStoriesSection/SuccessStoriesCard'
import { CASE_STUDY_PROJECTS } from 'constants/successStoryProjects'
import { useProjectsQuery } from 'generated/graphql'
import { client } from 'lib/apollo/client'

export function ReadMoreCaseStudies({
  currentProject,
}: {
  currentProject: string
}) {
  const otherCaseStudies = CASE_STUDY_PROJECTS.filter(
    p => p.id !== currentProject,
  )

  const { data } = useProjectsQuery({
    client,
    variables: {
      where: {
        id_in: otherCaseStudies.map(p => p.id),
      },
    },
  })
  const projects = data?.projects

  if (!data) return null

  const readMoreProjects = CASE_STUDY_PROJECTS.map(p => {
    const project = projects?.find(proj => proj.id === p.id)
    if (!project) return

    return {
      project,
      tags: p.tags,
      nameOverride: p.nameOverride,
      imageOverride: p.imageOverride,
    }
  }).filter((p): p is NonNullable<typeof p> => !!p)

  return (
    <div className="flex flex-col items-center justify-center bg-smoke-50 pt-12 pb-20 dark:bg-slate-700">
      <h4 className="text-2xl">
        <Trans>Read more case studies</Trans>
      </h4>
      <div className="hidden flex-col gap-10 pt-8 md:flex md:flex-row">
        {readMoreProjects.map(project =>
          project.project ? (
            <SuccessStoriesCard
              key={project.project.projectId}
              project={project.project}
              tags={project.tags}
              nameOverride={project.nameOverride}
              imageOverride={project.imageOverride}
            />
          ) : null,
        )}
      </div>
      <div className="block w-full px-4 pt-8 md:hidden">
        <ProjectCarousel
          items={readMoreProjects.map(project =>
            project.project ? (
              <SuccessStoriesCard
                key={project.project.projectId}
                project={project.project}
                tags={project.tags}
                nameOverride={project.nameOverride}
                imageOverride={project.imageOverride}
              />
            ) : (
              <></>
            ),
          )}
        />
      </div>
    </div>
  )
}
