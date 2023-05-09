import { SettingOutlined, ToolOutlined } from '@ant-design/icons'
import { t } from '@lingui/macro'
import { Button, Tooltip } from 'antd'
import { NotificationDot } from 'components/NotificationDot'
import { V1ProjectToolsDrawer } from 'components/v1/V1Project/V1ProjectToolsDrawer'
import { ProjectMetadataContext } from 'contexts/shared/ProjectMetadataContext'
import { V1ProjectContext } from 'contexts/v1/Project/V1ProjectContext'
import { useV1ConnectedWalletHasPermission } from 'hooks/v1/contractReader/useV1ConnectedWalletHasPermission'
import { useRelaunchV1ViaV3Create } from 'hooks/v1/useRelaunchV1ViaV3Create'
import { V1OperatorPermission } from 'models/v1/permissions'
import { useContext, useState } from 'react'
import { classNames } from 'utils/classNames'
import EditProjectModal from './modals/EditProjectModal'

export default function V1ProjectHeaderActions() {
  const { handle, terminal } = useContext(V1ProjectContext)
  const { projectId } = useContext(ProjectMetadataContext)

  const [toolDrawerVisible, setToolDrawerVisible] = useState<boolean>(false)
  const [editProjectModalVisible, setEditProjectModalVisible] =
    useState<boolean>(false)

  const { relaunch, isReady } = useRelaunchV1ViaV3Create()

  const hasEditPermission = useV1ConnectedWalletHasPermission([
    V1OperatorPermission.SetHandle,
    V1OperatorPermission.SetUri,
  ])
  const isOwner = useV1ConnectedWalletHasPermission(
    V1OperatorPermission.Configure,
  )

  const allowMigrate = isOwner

  if (!projectId) return null

  return (
    <div className="flex items-center">
      <span className="pr-2 text-grey-400 dark:text-slate-200">
        {terminal?.version && (
          <div className="relative">
            <Tooltip
              title={t`Version of the terminal contract used by this project.`}
            >
              <span
                className={classNames(
                  'cursor-pointer bg-smoke-100 py-0.5 px-1 dark:bg-slate-600',
                  allowMigrate && isReady ? 'cursor-pointer' : 'cursor-default',
                )}
                onClick={() => {
                  if (!isReady) return
                  relaunch()
                }}
              >
                V{terminal.version}
              </span>
            </Tooltip>
            {isReady && allowMigrate && (
              <NotificationDot className="absolute -top-1 -right-1" />
            )}
          </div>
        )}
      </span>

      <div>
        <Tooltip title={t`Tools`} placement="bottom">
          <Button
            onClick={() => setToolDrawerVisible(true)}
            icon={<ToolOutlined />}
            type="text"
          />
        </Tooltip>
        {hasEditPermission && (
          <Tooltip title={t`Edit project and cycle rules`} placement="bottom">
            <Button
              onClick={() => setEditProjectModalVisible(true)}
              icon={<SettingOutlined />}
              type="text"
            />
          </Tooltip>
        )}
      </div>

      <V1ProjectToolsDrawer
        open={toolDrawerVisible}
        onClose={() => setToolDrawerVisible(false)}
      />
      <EditProjectModal
        open={editProjectModalVisible}
        handle={handle}
        onSuccess={() => setEditProjectModalVisible(false)}
        onCancel={() => setEditProjectModalVisible(false)}
      />
    </div>
  )
}
