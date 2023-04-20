import { Trans } from '@lingui/macro'
import {
  CASE_STUDY_PROJECTS,
  SuccessStoryProject,
} from 'constants/successStoryProjects'
import { useProjectsQuery } from 'hooks/Projects'
import { PV } from 'models/pv'
import { SuccessStoriesCard } from 'pages/home/NewHomePage/SuccessStoriesSection/SuccessStoriesCard'

export function ReadMoreCaseStudies({
  currentProject,
}: {
  currentProject: {
    pv: PV
    id: number
  }
}) {
  const otherCaseStudies = CASE_STUDY_PROJECTS.filter(
    p => p.id !== currentProject.id || p.pv !== currentProject.pv,
  )

  const { data } = useProjectsQuery({
    projectIds: otherCaseStudies.map(p => p.id),
  })

  const readMoreProjects = otherCaseStudies.map(p => ({
    project: data?.find(proj => proj.projectId === p.id && proj.pv === p.pv),
    tags: p.tags,
  })) as SuccessStoryProject[]

  return (
    <div className="flex flex-col items-center justify-center bg-smoke-50 pt-12 pb-20 dark:bg-slate-700">
      <h4 className="text-2xl">
        <Trans>Read more case studies</Trans>
      </h4>
      <div className="flex gap-10 pt-8">
        {readMoreProjects.map(project =>
          project.project ? (
            <SuccessStoriesCard
              key={project.project.projectId}
              project={project.project}
              tags={project.tags}
            />
          ) : null,
        )}
      </div>
    </div>
  )
}