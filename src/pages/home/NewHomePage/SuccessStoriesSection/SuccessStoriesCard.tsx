import { Col, Skeleton } from 'antd'
import { ProjectCardProject } from 'components/ProjectCard'
import ProjectLogo from 'components/ProjectLogo'
import ETHAmount from 'components/currency/ETHAmount'
import { PV_V2 } from 'constants/pv'
import { useProjectMetadata } from 'hooks/ProjectMetadata'
import Link from 'next/link'
import { v2v3ProjectRoute } from 'utils/routes'
import { PROJECT_CARD_BG, PROJECT_CARD_BORDER } from '../HomepageProjectCard'

export function SuccessStoriesCard({
  project,
}: {
  project: ProjectCardProject
}) {
  const { data: metadata } = useProjectMetadata(project?.metadataUri)

  return (
    <Col xs={24} md={6}>
      <Link
        key={`${project.id}_${project.pv}`}
        href={
          project.pv === PV_V2
            ? v2v3ProjectRoute(project)
            : `/p/${project?.handle}`
        }
      >
        <a className="flex justify-center">
          <div
            className={`w-60 cursor-pointer overflow-hidden rounded-lg bg-white text-center transition-colors ${PROJECT_CARD_BORDER} ${PROJECT_CARD_BG}`}
          >
            <div className="flex justify-center">
              <ProjectLogo
                className="h-60 w-60 rounded-b-none"
                uri={metadata?.logoUri}
                name={metadata?.name}
                projectId={project.projectId}
              />
            </div>

            <div className="min-w-0 flex-1 py-3 px-4 text-left font-normal">
              {metadata ? (
                <div
                  className="m-0 block overflow-hidden text-ellipsis whitespace-nowrap text-base font-medium text-black dark:text-slate-100"
                  title={metadata.name}
                >
                  {metadata.name}
                </div>
              ) : (
                <Skeleton paragraph={false} title={{ width: 120 }} active />
              )}
              <div className="text-tertiary mt-4 text-xs">TOTAL RAISED</div>

              <div className="mt-2">
                <span className="text-4xl font-medium text-black dark:text-slate-100">
                  <ETHAmount amount={project?.totalPaid} precision={0} />
                </span>
              </div>
            </div>
          </div>
        </a>
      </Link>
    </Col>
  )
}
