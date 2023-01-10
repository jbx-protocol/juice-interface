import { t, Trans } from '@lingui/macro'
import { Divider, Space, Tooltip } from 'antd'
import { Badge } from 'components/Badge'
import FormattedAddress from 'components/FormattedAddress'
import Paragraph from 'components/Paragraph'
import { GnosisSafeBadge } from 'components/Project/ProjectHeader/GnosisSafeBadge'
import ProjectLogo from 'components/ProjectLogo'
import { ProjectMetadataContext } from 'contexts/projectMetadataContext'
import { useGnosisSafe } from 'hooks/safe/GnosisSafe'
import { useContext } from 'react'
import { EditProjectHandleButton } from './EditProjectHandleButton'
import SocialLinks from './SocialLinks'

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
  const { projectMetadata, projectId, isArchived } = useContext(
    ProjectMetadataContext,
  )

  const { data: gnosisSafe, isLoading: gnosisSafeLoading } =
    useGnosisSafe(projectOwnerAddress)

  const projectTitle = projectMetadata?.name || t`Untitled project`

  return (
    <header className="flex flex-wrap items-start justify-between">
      <div className="mr-5 mb-5 h-full">
        <ProjectLogo
          className="h-32 w-32"
          uri={projectMetadata?.logoUri}
          name={projectMetadata?.name}
          projectId={projectId}
        />
      </div>

      <div className="min-w-[70%] flex-1">
        <Space direction="vertical">
          <div className="flex flex-wrap items-start justify-between gap-y-2">
            <div className="max-w-md md:max-w-xl">
              <div className="flex items-center">
                <h1
                  className="mb-2 overflow-hidden text-ellipsis text-4xl text-black dark:text-slate-100"
                  title={projectTitle}
                >
                  {projectTitle}
                </h1>
                {isArchived && (
                  <div>
                    <Badge className="ml-4" upperCase variant="warning">
                      <Trans>Archived</Trans>
                    </Badge>
                  </div>
                )}
              </div>

              <div className="flex items-baseline gap-x-5">
                <span className="font-medium text-grey-600 dark:text-grey-300">
                  {handle ? (
                    <Tooltip title={t`Project ID: ${projectId}`}>
                      <span>@{handle}</span>
                    </Tooltip>
                  ) : (
                    <Trans>Project #{projectId}</Trans>
                  )}
                </span>

                {!handle && canEditProjectHandle && projectId ? (
                  <EditProjectHandleButton />
                ) : null}
              </div>
            </div>

            <div className="flex items-center">
              <SocialLinks
                discord={projectMetadata?.discord}
                twitter={projectMetadata?.twitter}
                infoUri={projectMetadata?.infoUri}
              />

              {actions ? (
                <>
                  <Divider type="vertical" className="mx-5 h-9 md:h-8" />
                  {actions}
                </>
              ) : null}
            </div>
          </div>

          {projectMetadata?.description && !hideDescription && (
            <Paragraph
              className="text-grey-900 dark:text-slate-100"
              description={projectMetadata.description}
              characterLimit={250}
            />
          )}

          {projectOwnerAddress && (
            <div className="flex items-center">
              <span className="mr-2">
                <Trans>
                  Owned by <FormattedAddress address={projectOwnerAddress} />
                </Trans>
              </span>
              {!gnosisSafeLoading && gnosisSafe && (
                <GnosisSafeBadge
                  safe={gnosisSafe}
                  href={`${window.location.href}/safe`}
                />
              )}
            </div>
          )}
        </Space>
      </div>
    </header>
  )
}
