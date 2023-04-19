import { Trans } from '@lingui/macro'
import { Skeleton } from 'antd'
import { ProjectCardProject } from 'components/ProjectCard'
import ProjectLogo from 'components/ProjectLogo'
import ETHAmount from 'components/currency/ETHAmount'
import { useProjectMetadata } from 'hooks/ProjectMetadata'
import Link from 'next/link'
import { PROJECT_CARD_BG, PROJECT_CARD_BORDER } from '../HomepageProjectCard'

export function SuccessStoriesCard({
  project,
}: {
  project: ProjectCardProject
}) {
  const { data: metadata } = useProjectMetadata(project?.metadataUri)

  return (
    <Link
      key={`${project.id}_${project.pv}`}
      href={`/success-stories/${project.handle}`}
    >
      <a
        className={`overflow-hidden rounded-lg bg-white text-center transition-colors ${PROJECT_CARD_BORDER} ${PROJECT_CARD_BG}`}
      >
        <div className="flex justify-center">
          <ProjectLogo
            className="h-60 w-64 rounded-b-none"
            uri={metadata?.logoUri}
            name={metadata?.name}
            projectId={project.projectId}
          />
        </div>

        <div className="px-4 pt-4 pb-6 text-left font-normal">
          {metadata ? (
            <div
              className="mb-3 block overflow-hidden text-ellipsis whitespace-nowrap text-base font-medium text-black dark:text-slate-100"
              title={metadata.name}
            >
              {metadata.name}
            </div>
          ) : (
            <Skeleton paragraph={false} title={{ width: 120 }} active />
          )}
          <div className="text-tertiary text-xs font-medium uppercase">
            <Trans>Total raised</Trans>
          </div>

          <div className="mt-2">
            <span className="text-4xl font-medium text-black dark:text-slate-100">
              <ETHAmount amount={project?.totalPaid} precision={0} />
            </span>
          </div>
        </div>
      </a>
    </Link>
  )
}
