import { SettingOutlined, ToolOutlined } from '@ant-design/icons'
import { Trans, t } from '@lingui/macro'
import { Button, Divider, Tooltip } from 'antd'
import { SubscribeButton } from 'components/SubscribeButton'
import { V2V3ProjectToolsDrawer } from 'components/v2v3/V2V3Project/V2V3ProjectToolsDrawer'
import { ProjectMetadataContext } from 'contexts/shared/ProjectMetadataContext'
import { V2V3ProjectContext } from 'contexts/v2v3/Project/V2V3ProjectContext'
import { useV2ConnectedWalletHasPermission } from 'hooks/v2v3/contractReader/V2ConnectedWalletHasPermission'
import { V2V3OperatorPermission } from 'models/v2v3/permissions'
import Link from 'next/link'
import { useContext, useState } from 'react'
import { settingsPagePath } from 'utils/routes'
import { ContractVersionSelect } from './ContractVersionSelect'

export function V2V3ProjectHeaderActions() {
  const { handle } = useContext(V2V3ProjectContext)

  const [toolDrawerVisible, setToolDrawerVisible] = useState<boolean>(false)
  const canReconfigure = useV2ConnectedWalletHasPermission(
    V2V3OperatorPermission.RECONFIGURE,
  )

  const { projectId } = useContext(ProjectMetadataContext)

  if (projectId === undefined) return null

  return (
    <>
      <div className="flex items-center">
        <div className="flex items-center gap-x-4">
          <SubscribeButton projectId={projectId} tooltipPlacement={'bottom'} />
          <ContractVersionSelect />
          <Divider className="h-8" type="vertical" />
          <Tooltip title={t`Project tools`} placement="bottom">
            <Button
              onClick={() => setToolDrawerVisible(true)}
              icon={<ToolOutlined />}
              type="text"
            />
          </Tooltip>
          {canReconfigure && (
            <div>
              <Link href={settingsPagePath('general', { handle, projectId })}>
                <Button icon={<SettingOutlined />}>
                  <span>
                    <Trans>Settings</Trans>
                  </span>
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>

      <V2V3ProjectToolsDrawer
        open={toolDrawerVisible}
        onClose={() => setToolDrawerVisible(false)}
      />
    </>
  )
}
