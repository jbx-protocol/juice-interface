import { ArrowRightIcon } from '@heroicons/react/24/outline'
import { Trans, t } from '@lingui/macro'
import { Button } from 'antd'
import ETHAmount from 'components/currency/ETHAmount'
import { useProjectMetadata } from 'hooks/ProjectMetadata'
import { useProjectTrendingPercentageIncrease } from 'hooks/Projects'
import { Project } from 'models/subgraph-entities/vX/project'
import { twJoin } from 'tailwind-merge'
import { ipfsUriToGatewayUrl } from 'utils/ipfs'
import { PROJECT_CARD_BG, PROJECT_CARD_BORDER } from '../HomepageProjectCard'

function Statistic({
  name,
  value,
}: {
  name: string | JSX.Element
  value: string | number | JSX.Element
}) {
  return (
    <div>
      <div className="text-tertiary mb-1 text-sm font-medium uppercase">
        <Trans>{name}</Trans>
      </div>
      <div className="text-primary font-heading text-2xl font-medium">
        {value}
      </div>
    </div>
  )
}

export function SpotlightProjectCard({ project }: { project: Project }) {
  const { data: metadata } = useProjectMetadata(project.metadataUri)

  const percentageGain = useProjectTrendingPercentageIncrease({
    trendingVolume: project.trendingVolume,
    totalPaid: project.totalPaid,
  })
  const percentGainText = project.createdWithinTrendingWindow
    ? t`New`
    : percentageGain === Infinity
    ? '+∞'
    : `+${percentageGain}%`

  return (
    <div className={twJoin(PROJECT_CARD_BORDER, PROJECT_CARD_BG)}>
      <div className="w-full">
        {metadata?.coverImageUri ? (
          <img
            src={ipfsUriToGatewayUrl(metadata.coverImageUri)}
            className="h-64 w-full object-cover"
            crossOrigin="anonymous"
            alt={`Cover image for ${metadata?.name ?? 'project'}`}
          />
        ) : (
          <div className="h-64 w-full bg-grey-200 dark:bg-slate-800" />
        )}
      </div>
      <div className="p-5">
        <div className="mb-5 font-heading text-3xl">{metadata?.name}</div>
        <div className="mb-5 flex gap-8">
          <Statistic
            name={<Trans>Volume</Trans>}
            value={<ETHAmount amount={project.totalPaid} precision={2} />}
          />
          <Statistic
            name={<Trans>Payments</Trans>}
            value={project.paymentsCount}
          />
          <Statistic
            name={<Trans>Last 7 days</Trans>}
            value={<span className="text-melon-600">{percentGainText}</span>}
          />
        </div>
        <p className="mb-8 text-sm text-grey-600 dark:text-slate-200">
          {metadata?.description}
        </p>
        <Button type="primary">
          <Trans>Go to project</Trans>
          <ArrowRightIcon className="ml-2 inline h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
