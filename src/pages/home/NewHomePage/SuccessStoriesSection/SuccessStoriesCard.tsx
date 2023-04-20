import { Trans } from '@lingui/macro'
import { Skeleton } from 'antd'
import { ProjectCardProject } from 'components/ProjectCard'
import ProjectLogo from 'components/ProjectLogo'
import ETHAmount from 'components/currency/ETHAmount'
import { useProjectMetadata } from 'hooks/ProjectMetadata'
import { ProjectTagName } from 'models/project-tags'
import Link from 'next/link'
import { twJoin } from 'tailwind-merge'
import { PROJECT_CARD_BG, PROJECT_CARD_BORDER } from '../HomepageProjectCard'

function SuccessStoriesCardTag({ tag }: { tag: ProjectTagName }) {
  const className =
    tag === 'dao'
      ? 'bg-split-50 text-split-800 dark:bg-split-950 dark:text-split-600'
      : tag === 'fundraising'
      ? 'bg-melon-50 text-melon-700 dark:bg-melon-950 dark:text-melon-600'
      : 'bg-grape-50 text-grape-700 dark:bg-grape-950 dark:text-grape-300'

  return (
    <span
      className={twJoin(
        'flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium uppercase',
        className,
      )}
      key={tag}
    >
      {tag}
    </span>
  )
}

export function SuccessStoriesCard({
  project,
  tags,
}: {
  project: ProjectCardProject
  tags: ProjectTagName[]
}) {
  const { data: metadata } = useProjectMetadata(project?.metadataUri)

  return (
    <Link
      key={`${project.id}_${project.pv}`}
      href={`/success-stories/${project.handle}`}
    >
      <a
        className={`flex-shrink-0 overflow-hidden rounded-lg bg-white text-center transition-colors ${PROJECT_CARD_BORDER} ${PROJECT_CARD_BG}`}
      >
        <div className="relative flex justify-center">
          <ul className="absolute top-3 left-3 flex gap-1">
            {tags.map(tag => (
              <li key={tag}>
                <SuccessStoriesCardTag tag={tag} />
              </li>
            ))}
          </ul>
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
