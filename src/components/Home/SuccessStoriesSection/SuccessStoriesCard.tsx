import { Trans } from '@lingui/macro'
import { Skeleton } from 'antd'
import { Badge } from 'components/Badge'
import ETHAmount from 'components/currency/ETHAmount'
import ProjectLogo from 'components/ProjectLogo'
import { useProjectMetadata } from 'hooks/useProjectMetadata'
import { ProjectTagName, projectTagText } from 'models/project-tags'
import Image from 'next/image'
import Link from 'next/link'

import {
  HOMEPAGE_CARD_BG,
  HOMEPAGE_CARD_BORDER,
  HOMEPAGE_CARD_BORDER_HOVER,
} from 'components/Home/HomepageCard'
import { SubgraphQueryProject } from 'models/subgraphProjects'

function SuccessStoriesCardTag({ tag }: { tag: ProjectTagName }) {
  const text = projectTagText[tag]()
  const badgeVariant =
    tag === 'dao' ? 'danger' : tag === 'fundraising' ? 'success' : 'info'

  return (
    <Badge variant={badgeVariant} className="text-xs">
      {text}
    </Badge>
  )
}

export function SuccessStoriesCard({
  project,
  tags,
  nameOverride,
  imageOverride,
}: {
  project: SubgraphQueryProject
  tags: ProjectTagName[]
  nameOverride?: string
  imageOverride?: string
}) {
  const { data: metadata } = useProjectMetadata(project?.metadataUri)

  const _name = nameOverride ?? metadata?.name

  return (
    <Link
      key={`${project.id}_${project.pv}`}
      href={`/success-stories/${project.handle}`}
      className={`block overflow-hidden rounded-lg bg-white text-center ${HOMEPAGE_CARD_BORDER} ${HOMEPAGE_CARD_BORDER_HOVER} ${HOMEPAGE_CARD_BG}`}
    >
      <div className="relative flex justify-center">
        <ul className="absolute top-3 left-3 z-10 flex gap-1">
          {tags.map(tag => (
            <li key={tag}>
              <SuccessStoriesCardTag tag={tag} />
            </li>
          ))}
        </ul>
        {imageOverride ? (
          <Image
            className="h-60 w-[280px] rounded-none object-cover object-top"
            src={imageOverride}
            alt={_name + ' logo'}
            loading="lazy"
            crossOrigin="anonymous"
            title={_name}
            height={240}
            width={280}
            style={{
              maxWidth: '100%',
              height: 'auto',
            }}
          />
        ) : (
          <ProjectLogo
            className="h-60 w-[280px] rounded-none"
            uri={metadata?.logoUri}
            name={metadata?.name}
            projectId={project.projectId}
            lazyLoad
          />
        )}
      </div>
      <div className="px-4 pt-4 pb-6 text-left font-normal">
        {metadata ? (
          <div
            className="mb-3 block overflow-hidden text-ellipsis whitespace-nowrap text-base font-medium text-black dark:text-slate-100"
            title={metadata.name}
          >
            {_name}
          </div>
        ) : (
          <Skeleton paragraph={false} title={{ width: 120 }} active />
        )}
        <div className="text-secondary text-xs font-medium uppercase">
          <Trans>Total raised</Trans>
        </div>

        <div className="mt-2">
          <span className="text-4xl font-medium text-black dark:text-slate-100">
            <ETHAmount amount={project?.volume} precision={0} />
          </span>
        </div>
      </div>
    </Link>
  )
}
