import { Trans } from '@lingui/macro'
import { Skeleton } from 'antd'
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
      className={`h-70 w-full w-70 rounded-t-lg rounded-b-none`}
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
        className={`h-full cursor-pointer overflow-hidden rounded-lg px-[10px]`}
        style={{ flex: '0 0 auto' }}
      >
        <div
          className={`h-full w-[280px] rounded-lg ${PROJECT_CARD_BORDER} ${PROJECT_CARD_BG}`}
        >
          {projectLogo}
          <div className="flex flex-col justify-between gap-4 rounded-lg p-5">
            {metadata ? (
              <div className="m-0 flex h-14 items-center overflow-hidden text-ellipsis text-lg font-medium text-black dark:text-slate-100 md:text-xl">
                {metadata.name}
              </div>
            ) : (
              <Skeleton paragraph={false} title={{ width: 120 }} active />
            )}
            <div className="flex gap-8">
              <div>
                <div className={statHeadingClass}>
                  <Trans>VOLUME</Trans>
                </div>
                <div className={statClass}>
                  <ETHAmount amount={project.totalPaid} />
                </div>
              </div>
              <div>
                <div className={statHeadingClass}>
                  <Trans>PAYMENTS</Trans>
                </div>
                <div className={statClass}>{project.paymentsCount}</div>
              </div>
            </div>
          </div>
        </div>
      </a>
    </Link>
  )
}
