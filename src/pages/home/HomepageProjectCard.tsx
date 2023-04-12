import { Trans } from '@lingui/macro'
import { Col, Row, Skeleton } from 'antd'
import ETHAmount from 'components/currency/ETHAmount'
import ProjectLogo from 'components/ProjectLogo'
import { useProjectMetadata } from 'hooks/ProjectMetadata'
import { Project } from 'models/subgraph-entities/vX/project'
import Link from 'next/link'
import { v2v3ProjectRoute } from 'utils/routes'

export const PROJECT_CARD_BORDER =
  'border border-solid border-smoke-300 hover:border-smoke-500 dark:border-slate-300 dark:hover:border-slate-100'
export const PROJECT_CARD_BG = 'dark:bg-slate-700'

// Used in Trending Projects Caroursel and Juicy Picks section
export function HomepageProjectCard({
  project,
}: {
  project: Pick<
    Project,
    | 'terminal'
    | 'metadataUri'
    | 'totalPaid'
    | 'paymentsCount'
    | 'handle'
    | 'pv'
    | 'projectId'
  >
}) {
  const { data: metadata } = useProjectMetadata(project.metadataUri)

  const projectLogo = (
    <ProjectLogo
      className="w-full rounded-t-lg rounded-b-none md:h-60 md:w-60"
      uri={metadata?.logoUri}
      name={metadata?.name}
      projectId={project.projectId}
    />
  )

  const statHeadingClass = 'text-xs text-tertiary'
  const statClass = 'text-xl font-medium mt-2 text-primary'

  return (
    <Link
      prefetch={false}
      key={project.handle}
      href={v2v3ProjectRoute(project)}
    >
      <a
        className={`h-full w-[280px] cursor-pointer overflow-hidden rounded-lg px-[10px]`}
      >
        <div className={`rounded-lg ${PROJECT_CARD_BORDER} ${PROJECT_CARD_BG}`}>
          {projectLogo}
          <div className="rounded-lg p-5">
            {metadata ? (
              <span className="m-0 overflow-hidden text-ellipsis text-lg font-medium text-black dark:text-slate-100 md:text-xl">
                {metadata.name}
              </span>
            ) : (
              <Skeleton paragraph={false} title={{ width: 120 }} active />
            )}
            <Row gutter={20} className="mt-4">
              <Col md={12}>
                <div className={statHeadingClass}>
                  <Trans>VOLUME</Trans>
                </div>
                <div className={statClass}>
                  <ETHAmount amount={project.totalPaid} />
                </div>
              </Col>
              <Col md={12}>
                <div className={statHeadingClass}>
                  <Trans>PAYMENTS</Trans>
                </div>
                <div className={statClass}>{project.paymentsCount}</div>
              </Col>
            </Row>
          </div>
        </div>
      </a>
    </Link>
  )
}
