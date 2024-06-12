import { ArrowRightIcon } from '@heroicons/react/24/outline'
import { Trans, t } from '@lingui/macro'
import { Button } from 'antd'
import {
  HOMEPAGE_CARD_BG,
  HOMEPAGE_CARD_BORDER,
} from 'components/Home/HomepageCard'
import Paragraph from 'components/Paragraph'
import ProjectLogo from 'components/ProjectLogo'
import { TRENDING_WINDOW_DAYS } from 'components/Projects/RankingExplanation'
import ETHAmount from 'components/currency/ETHAmount'
import { Project } from 'generated/graphql'
import { useProjectMetadata } from 'hooks/useProjectMetadata'
import { useProjectTrendingPercentageIncrease } from 'hooks/useProjects'
import Link from 'next/link'
import { twJoin } from 'tailwind-merge'
import { ipfsUriToGatewayUrl } from 'utils/ipfs'
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
      <div className="text-secondary mb-1 text-sm font-medium uppercase">
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
    totalVolume: project.volume,
  })
  const percentGainText = project.createdWithinTrendingWindow
    ? t`New`
    : percentageGain === Infinity
    ? '+∞'
    : `+${percentageGain}%`

  return (
    <div
      className={twJoin(
        HOMEPAGE_CARD_BORDER,
        HOMEPAGE_CARD_BG,
        'flex h-full flex-col justify-between',
      )}
    >
      <div>
        <div className="w-full">
          {metadata?.coverImageUri ? (
            <img
              src={ipfsUriToGatewayUrl(metadata.coverImageUri)}
              className="h-64 w-full object-cover"
              crossOrigin="anonymous"
              alt={`Cover image for ${metadata?.name ?? 'project'}`}
              loading="lazy"
            />
          ) : (
            <div className="h-64 w-full bg-grey-200 dark:bg-slate-800" />
          )}
        </div>
        <div>
          <ProjectLogo
            uri={metadata?.logoUri}
            name={metadata?.name}
            className="relative mx-5 mt-[-86px] h-44 w-44 border-4 border-solid border-white dark:border-slate-900"
            lazyLoad
          />
        </div>
      </div>

      <div className="flex flex-col px-8 pt-4">
        <div className="mb-5 font-heading text-3xl">{metadata?.name}</div>
        <div className="mb-5 flex gap-8">
          <Statistic
            name={<Trans>Volume</Trans>}
            value={<ETHAmount amount={project.volume} precision={2} />}
          />
          <Statistic
            name={<Trans>Payments</Trans>}
            value={project.paymentsCount}
          />
          <Statistic
            name={<Trans>Last {TRENDING_WINDOW_DAYS} days</Trans>}
            value={<span className="text-melon-600">{percentGainText}</span>}
          />
        </div>
        <div className="mb-6">
          {metadata?.projectTagline ? (
            <Paragraph
              description={metadata.projectTagline}
              characterLimit={150}
              className="text-sm text-grey-600 dark:text-slate-200"
            />
          ) : null}
        </div>
      </div>

      <div className="px-8 pb-8">
        <Link
          href={v2v3ProjectRoute({
            projectId: project.projectId,
            handle: project.handle,
          })}
        >
          <Button>
            <Trans>Go to project</Trans>
            <ArrowRightIcon className="ml-2 inline h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  )
}
