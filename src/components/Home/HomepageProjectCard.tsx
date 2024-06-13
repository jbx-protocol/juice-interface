import { Trans } from '@lingui/macro'
import { Skeleton } from 'antd'
import { HomepageCard } from 'components/Home/HomepageCard'
import ProjectLogo from 'components/ProjectLogo'
import ETHAmount from 'components/currency/ETHAmount'
import { PV_V2 } from 'constants/pv'
import { useProjectMetadata } from 'hooks/useProjectMetadata'
import { SubgraphQueryProject } from 'models/subgraphProjects'
import { v2v3ProjectRoute } from 'utils/routes'

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
  >
  lazyLoad?: boolean
}) {
  const { data: metadata, isLoading } = useProjectMetadata(project.metadataUri)

  return (
    <HomepageCard
      href={
        project.pv === PV_V2
          ? v2v3ProjectRoute(project)
          : `/p/${project.handle}`
      }
      img={
        metadata && !isLoading ? (
          <ProjectLogo
            className="h-[192px] w-full rounded-none object-cover"
            name={metadata?.name}
            projectId={project.projectId}
            uri={metadata?.logoUri}
            pv={project.pv}
            lazyLoad={lazyLoad}
          />
        ) : null
      }
      title={
        metadata && !isLoading ? (
          <div className="max-h-8 truncate font-heading text-lg font-medium text-grey-900 dark:text-slate-100 md:text-xl">
            {metadata.name}
          </div>
        ) : (
          <Skeleton.Input
            className="h-6 w-full"
            active
            size="small"
            style={{ width: '100%' }}
          />
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
