import { t, Trans } from '@lingui/macro'
import { SettingOutlined, SmileOutlined, ToolOutlined } from '@ant-design/icons'
import { Button, Tooltip } from 'antd'
import { Badge } from 'components/Badge'
import FormattedAddress from 'components/FormattedAddress'
import Paragraph from 'components/Paragraph'
import { GnosisSafeBadge } from 'components/Project/ProjectHeader/GnosisSafeBadge'
import ProjectLogo from 'components/ProjectLogo'
import { ProjectMetadataContext } from 'contexts/projectMetadataContext'
import useMobile from 'hooks/Mobile'
import { useGnosisSafe } from 'hooks/safe/GnosisSafe'
import { useContext, useState } from 'react'
import { classNames } from 'utils/classNames'
import { EditProjectHandleButton } from './EditProjectHandleButton'
import SocialLinks from './SocialLinks'
import { ContractVersionSelect } from 'components/v2v3/V2V3Project/V2V3ProjectHeaderActions/ContractVersionSelect'
import { VeNftContext } from 'contexts/veNftContext'
import { useV2ConnectedWalletHasPermission } from 'hooks/v2v3/contractReader/V2ConnectedWalletHasPermission'
import { V2OperatorPermission } from 'models/v2v3/permissions'
import { settingsPagePath, veNftPagePath } from 'utils/routes'
import Link from 'next/link'
import { V2V3ProjectToolsDrawer } from 'components/v2v3/V2V3Project/V2V3ProjectToolsDrawer'
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

  const { contractAddress: veNftContractAddress } = useContext(VeNftContext)
  const [toolDrawerVisible, setToolDrawerVisible] = useState<boolean>(false)

  const canReconfigure = useV2ConnectedWalletHasPermission(
    V2OperatorPermission.RECONFIGURE,
  )
  const veNftEnabled = Boolean(veNftContractAddress)
  const isMobile = useMobile()
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
        <div className="flex flex-wrap items-start justify-between">
          <div
            className={classNames(
              'flex items-center',
              isMobile ? 'max-w-full' : 'max-w-[75%]',
            )}
          >
            <h1
              className={classNames(
                'm-0 overflow-hidden text-ellipsis text-4xl',
                projectMetadata?.name
                  ? 'text-black dark:text-slate-100'
                  : 'text-grey-400 dark:text-grey-600',
              )}
              title={projectTitle}
            >
              {projectTitle}
            </h1>
            {isArchived && (
              <Badge className="ml-4" upperCase variant="warning">
                <Trans>Archived</Trans>
              </Badge>
            )}
          </div>

          {actions ?? null}
        </div>
        <div className="t flex flex-wrap items-center gap-x-[12px] pt-2 pb-1 font-medium">
          <span className="font-medium text-grey-500 dark:text-grey-300">
            <Tooltip title={t`Project ID: ${projectId}`}>
              <span className="font-medium text-grey-700">
                {handle ? `@${handle}` : ''}
              </span>{' '}
              <Trans>ID: #{projectId}</Trans>
            </Tooltip>
          </span>

          {!handle && canEditProjectHandle && projectId ? (
            <EditProjectHandleButton />
          ) : null}
          <div className="flex flex-grow">
            <SocialLinks
              discord={projectMetadata?.discord}
              twitter={projectMetadata?.twitter}
              infoUri={projectMetadata?.infoUri}
              telegram={projectMetadata?.telegram}
            />
          </div>
          <ContractVersionSelect />
          <Tooltip title={t`Tools`} placement="bottom">
            <Button
              onClick={() => setToolDrawerVisible(true)}
              icon={<ToolOutlined />}
              type="text"
            />
          </Tooltip>

          <V2V3ProjectToolsDrawer
            open={toolDrawerVisible}
            onClose={() => setToolDrawerVisible(false)}
          />

          {canReconfigure && (
            <Tooltip title={t`Project Settings`} placement="bottom">
              <div>
                <Link href={settingsPagePath('general', { handle, projectId })}>
                  <Button type="text" icon={<SettingOutlined />} />
                </Link>
              </div>
            </Tooltip>
          )}

          {veNftEnabled && (
            <Tooltip title={t`veNFT`} placement="bottom">
              <div>
                <Link href={veNftPagePath('mint', { handle, projectId })}>
                  <Button type="text" icon={<SmileOutlined />} />
                </Link>
              </div>
            </Tooltip>
          )}
        </div>

        {projectMetadata?.description && !hideDescription && (
          <Paragraph
            className="text-grey-900 dark:text-slate-100"
            description={projectMetadata.description}
            characterLimit={250}
          />
        )}

        {projectOwnerAddress && (
          <div className="mt-2 flex items-center">
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
      </div>
    </header>
  )
}
