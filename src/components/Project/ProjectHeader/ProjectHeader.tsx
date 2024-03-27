import { t, Trans } from '@lingui/macro'
import { Divider, Tooltip } from 'antd'
import { Badge } from 'components/Badge'
import EthereumAddress from 'components/EthereumAddress'
import Paragraph from 'components/Paragraph'
import { GnosisSafeBadge } from 'components/Project/ProjectHeader/GnosisSafeBadge'
import ProjectLogo from 'components/ProjectLogo'
import { ProjectTagsList } from 'components/ProjectTags/ProjectTagsList'
import { ContractVersionSelect } from 'components/v2v3/V2V3Project/V2V3ProjectHeaderActions/ContractVersionSelect'
import { ProjectMetadataContext } from 'contexts/shared/ProjectMetadataContext'
import { useGnosisSafe } from 'hooks/safe/useGnosisSafe'
import { useContext } from 'react'
import { twMerge } from 'tailwind-merge'
import { ipfsUriToGatewayUrl } from 'utils/ipfs'
import { v2v3ProjectRoute } from 'utils/routes'
import { EditProjectHandleButton } from './EditProjectHandleButton'
import SocialLinks from './SocialLinks'

function ProjectSubheading({
  className,
  handle,
  canEditProjectHandle,
  projectOwnerAddress,
}: {
  className?: string
  handle: string | undefined
  projectOwnerAddress: string | undefined
  canEditProjectHandle?: boolean
}) {
  const { projectId } = useContext(ProjectMetadataContext)

  const { data: gnosisSafe, isLoading: gnosisSafeLoading } =
    useGnosisSafe(projectOwnerAddress)

  return (
    <div
      className={twMerge(
        'flex flex-col flex-wrap items-center gap-x-4 text-grey-500 dark:text-grey-300 md:flex-row',
        className,
      )}
    >
      <span className="flex items-center justify-between gap-2 font-medium">
        {handle ? (
          <Tooltip title={t`Project ID: ${projectId}`}>
            <span>@{handle}</span>
          </Tooltip>
        ) : (
          <Trans>Project #{projectId}</Trans>
        )}

        <ContractVersionSelect />

        {!handle && canEditProjectHandle && projectId ? (
          <EditProjectHandleButton />
        ) : null}
      </span>

      {projectOwnerAddress && (
        <>
          <div className="hidden md:block">
            <Divider
              type="vertical"
              className="m-0 h-6 bg-grey-100 dark:bg-grey-900"
            />
          </div>
          <div className="flex items-center font-medium">
            <span className="mr-1 flex gap-1">
              <Trans>
                <span>Owned by</span>
                <EthereumAddress
                  address={projectOwnerAddress}
                  className="inline-flex text-grey-500 dark:text-grey-300"
                />
              </Trans>
            </span>
            {!gnosisSafeLoading && gnosisSafe && (
              <GnosisSafeBadge
                safe={gnosisSafe}
                href={`${v2v3ProjectRoute({ projectId })}/safe`}
              />
            )}
          </div>
        </>
      )}
    </div>
  )
}

function ProjectHeading({ className }: { className?: string }) {
  const { projectMetadata, isArchived } = useContext(ProjectMetadataContext)
  const projectTitle = projectMetadata?.name || t`Untitled project`

  return (
    <div className={twMerge('flex items-center overflow-hidden', className)}>
      <h1
        className="mb-0 overflow-hidden text-ellipsis font-heading text-4xl font-medium text-black dark:text-slate-100"
        title={projectTitle}
      >
        {projectTitle}
      </h1>
      {isArchived && (
        <Badge className="ml-4 " upperCase variant="warning">
          <Trans>Archived</Trans>
        </Badge>
      )}
    </div>
  )
}

export function ProjectHeader({
  handle,
  actions,
  canEditProjectHandle,
  projectOwnerAddress,
  hideDescription,
}: {
  handle: string | undefined
  actions: JSX.Element | undefined
  projectOwnerAddress: string | undefined
  canEditProjectHandle?: boolean
  hideDescription?: boolean
}) {
  const { projectMetadata, projectId } = useContext(ProjectMetadataContext)

  const hasSocialLinks =
    projectMetadata?.discord ||
    projectMetadata?.telegram ||
    projectMetadata?.twitter ||
    projectMetadata?.infoUri

  const hasBanner = Boolean(projectMetadata?.coverImageUri)

  return (
    <header>
      {/* Project Cover */}
      {projectMetadata?.coverImageUri && (
        <div className="w-full">
          <img
            src={ipfsUriToGatewayUrl(projectMetadata.coverImageUri)}
            className="h-64 w-full object-cover"
            crossOrigin="anonymous"
            alt={`Cover image for ${projectMetadata?.name ?? 'project'}`}
          />
        </div>
      )}
      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-y-3 gap-x-2 py-5 px-5 md:grid-cols-6 md:px-0">
        <div className="mx-auto flex flex-col md:col-span-1 md:row-span-3 md:flex-row">
          <ProjectLogo
            className={twMerge(
              'h-32 w-32',
              hasBanner
                ? 'mt-[-70px] border-4 border-smoke-25 dark:border-slate-800'
                : '',
            )}
            uri={projectMetadata?.logoUri}
            name={projectMetadata?.name}
            projectId={projectId}
          />
        </div>

        <div className="mx-auto flex flex-col items-center gap-3 md:col-span-5 md:w-full md:flex-row md:justify-between md:text-start">
          <ProjectHeading className="md:full-w max-w-md" />
          <div className="flex flex-col items-center gap-4 md:flex-row">
            <SocialLinks
              className="mx-auto"
              discord={projectMetadata?.discord}
              telegram={projectMetadata?.telegram}
              twitter={projectMetadata?.twitter}
              infoUri={projectMetadata?.infoUri}
              tooltipPlacement="bottom"
            />
            {hasSocialLinks && actions ? (
              <div className="hidden md:block">
                <Divider type="vertical" className="h-8" />
              </div>
            ) : null}
            {actions && (
              <div className="flex w-full justify-center">{actions}</div>
            )}
          </div>
        </div>

        <ProjectSubheading
          className="md:col-span-5"
          handle={handle}
          canEditProjectHandle={canEditProjectHandle}
          projectOwnerAddress={projectOwnerAddress}
        />

        {projectMetadata?.description && !hideDescription && (
          <div className="mx-auto md:col-span-5 md:w-full md:text-start">
            {projectMetadata?.tags?.length ? (
              <div className="mb-3 flex justify-center md:justify-start">
                <ProjectTagsList tags={projectMetadata.tags} withLinks />
              </div>
            ) : null}
            <Paragraph
              className="text-grey-900 dark:text-slate-100"
              description={projectMetadata.description}
              characterLimit={250}
            />
          </div>
        )}
      </div>
    </header>
  )
}
