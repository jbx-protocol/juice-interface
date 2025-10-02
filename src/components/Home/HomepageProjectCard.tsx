import { Trans } from '@lingui/macro'
import { Skeleton } from 'antd'
import { HomepageCard } from 'components/Home/HomepageCard'
import ProjectLogo from 'components/ProjectLogo'
import ETHAmount from 'components/currency/ETHAmount'
import { PV_V2, PV_V4 } from 'constants/pv'
import { useProjectMetadata } from 'hooks/useProjectMetadata'
import { JBChainId } from 'juice-sdk-react'
import { SubgraphQueryProject } from 'models/subgraphProjects'
import { v2v3ProjectRoute } from 'packages/v2v3/utils/routes'
import { ChainLogo } from 'packages/v4v5/components/ChainLogo'
import { v4ProjectRoute } from 'packages/v4v5/utils/routes'

function Statistic({
  name,
  value,
}: {
  name: string | JSX.Element
  value: string | number | JSX.Element
}) {
  return (
    <div>
      <div className="text-secondary mb-1 text-xs font-medium uppercase">
        <Trans>{name}</Trans>
      </div>
      <div className="text-primary font-heading text-xl font-medium">
        {value}
      </div>
    </div>
  )
}

export function HomepageProjectCardSkeleton() {
  return (
    <HomepageCard
      img={<Skeleton.Input className="h-[192px] w-full" active size="small" />}
      title={<Skeleton.Input className="h-6 w-full" active size="small" />}
    />
  )
}

// Used in Trending Projects Caroursel and Juicy Picks section
export function HomepageProjectCard({
  project, // v1 or v2 project
  lazyLoad,
}: {
  project: Pick<
    SubgraphQueryProject,
    'metadataUri' | 'volume' | 'paymentsCount' | 'handle' | 'pv' | 'projectId'
  > & { chainId?: number; chainIds?: number[] }
  lazyLoad?: boolean
}) {
  const { data: metadata, isLoading } = useProjectMetadata(project.metadataUri)

  return (
    <HomepageCard
      href={
        project.pv === PV_V4 && project.chainId
          ? v4ProjectRoute({
              projectId: project.projectId,
              chainId: project.chainId,
            })
          : project.pv === PV_V2
          ? v2v3ProjectRoute(project)
          : `/p/${project.handle}`
      }
      img={
        !isLoading ? (
          <div className="relative">
            <ProjectLogo
              className="h-[192px] w-full rounded-none object-cover"
              name={metadata?.name}
              projectId={project.projectId}
              uri={metadata?.logoUri}
              pv={project.pv}
              lazyLoad={lazyLoad}
            />
            {project.chainIds ? (
              <div className="absolute right-2 top-2 z-10 flex flex-col rounded-full bg-white p-1 pb-2 shadow-md dark:bg-slate-900">
                {project.chainIds.map(c => (
                  <div key={c} className="h-4 w-5">
                    <div className="h-5 w-5">
                      <ChainLogo chainId={c as JBChainId} />
                    </div>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        ) : null
      }
      title={
        isLoading ? (
          <Skeleton.Input
            className="h-6 w-full"
            active
            size="small"
            style={{ width: '100%' }}
          />
        ) : !metadata ? (
          '---'
        ) : (
          <div className="max-h-8 truncate font-heading text-lg font-medium text-grey-900 dark:text-slate-100 md:text-xl">
            {metadata.name}
          </div>
        )
      }
      description={
        <div className="flex gap-8">
          <Statistic
            name={<Trans>Volume</Trans>}
            value={<ETHAmount amount={project.volume} precision={2} />}
          />
          <Statistic
            name={<Trans>Payments</Trans>}
            value={project.paymentsCount}
          />
        </div>
      }
    />
  )
}
