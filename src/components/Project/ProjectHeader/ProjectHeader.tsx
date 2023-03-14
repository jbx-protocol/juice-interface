import { t, Trans } from '@lingui/macro'
import { Divider, Tooltip } from 'antd'
import { Badge } from 'components/Badge'
import FormattedAddress from 'components/FormattedAddress'
import Paragraph from 'components/Paragraph'
import { GnosisSafeBadge } from 'components/Project/ProjectHeader/GnosisSafeBadge'
import ProjectLogo from 'components/ProjectLogo'
import { ProjectMetadataContext } from 'contexts/shared/ProjectMetadataContext'
import { useGnosisSafe } from 'hooks/safe/GnosisSafe'
import { useContext } from 'react'
import { classNames } from 'utils/classNames'
import { ipfsUriToGatewayUrl } from 'utils/ipfs'
import { EditProjectHandleButton } from './EditProjectHandleButton'
import SocialLinks from './SocialLinks'

function ProjectSubheading({
  handle,
  canEditProjectHandle,
  projectOwnerAddress,
}: {
  handle: string | undefined
  projectOwnerAddress: string | undefined
  canEditProjectHandle?: boolean
}) {
  const { projectId } = useContext(ProjectMetadataContext)

  const { data: gnosisSafe, isLoading: gnosisSafeLoading } =
    useGnosisSafe(projectOwnerAddress)

  return (
    <div className="flex items-center gap-x-4 text-grey-500 dark:text-grey-300">
      <span className="flex items-center justify-between gap-2 font-medium">
        {handle ? (
          <Tooltip title={t`Project ID: ${projectId}`}>
            <span>@{handle}</span>
          </Tooltip>
        ) : (
          <Trans>Project #{projectId}</Trans>
        )}

        {!handle && canEditProjectHandle && projectId ? (
          <EditProjectHandleButton />
        ) : null}
      </span>

      {projectOwnerAddress && (
        <>
          <Divider
            type="vertical"
            className="m-0 h-6 bg-grey-100 dark:bg-grey-900"
          />
          <div className="flex items-center font-medium">
            <span className="mr-2">
              <Trans>
                Owned by{' '}
                <FormattedAddress
                  address={projectOwnerAddress}
                  className="text-grey-500 dark:text-grey-300"
                />
              </Trans>
            </span>
            {!gnosisSafeLoading && gnosisSafe && (
              <GnosisSafeBadge
                safe={gnosisSafe}
                href={`${window.location.href}/safe`}
              />
            )}
          </div>
        </>
      )}
    </div>
  )
}

function ProjectHeading() {
  const { projectMetadata, isArchived } = useContext(ProjectMetadataContext)
  const projectTitle = projectMetadata?.name || t`Untitled project`

  return (
    <div className="flex max-w-md items-center overflow-hidden">
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

      <div className="my-0 mx-auto flex w-full max-w-5xl flex-wrap gap-x-7 gap-y-3 p-5">
        <ProjectLogo
          className={classNames(
            'h-32 w-32',
            hasBanner
              ? 'mt-[-70px] border-4 border-solid border-smoke-25 dark:border-slate-800'
              : '',
          )}
          uri={projectMetadata?.logoUri}
          name={projectMetadata?.name}
          projectId={projectId}
        />

        <div className="flex min-w-[70%] flex-1 flex-col gap-y-2">
          <div className="flex flex-wrap items-start justify-between gap-y-3">
            <div className="flex flex-col flex-wrap gap-y-2">
              <ProjectHeading />
              <ProjectSubheading
                handle={handle}
                canEditProjectHandle={canEditProjectHandle}
                projectOwnerAddress={projectOwnerAddress}
              />
            </div>

            <div className="flex items-center">
              <SocialLinks
                discord={projectMetadata?.discord}
                twitter={projectMetadata?.twitter}
                infoUri={projectMetadata?.infoUri}
                telegram={projectMetadata?.telegram}
              />

              {hasSocialLinks && actions ? (
                <Divider type="vertical" className="mx-5 h-9 md:h-8" />
              ) : null}

              {actions ?? null}
            </div>
          </div>

          {projectMetadata?.description && !hideDescription && (
            <Paragraph
              className="text-grey-900 dark:text-slate-100"
              description={projectMetadata.description}
              characterLimit={250}
            />
          )}
        </div>
      </div>
    </header>
  )
}
