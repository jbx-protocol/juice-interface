import { SettingOutlined, ToolOutlined } from '@ant-design/icons'
import { t } from '@lingui/macro'
import { Button, Tooltip } from 'antd'
import { ProjectMetadataContext } from 'contexts/ProjectMetadataContext'
import { V1ProjectToolsDrawer } from 'packages/v1/components/V1Project/V1ProjectToolsDrawer'
import { V1ProjectContext } from 'packages/v1/contexts/Project/V1ProjectContext'
import { useV1ConnectedWalletHasPermission } from 'packages/v1/hooks/contractReader/useV1ConnectedWalletHasPermission'
import { V1OperatorPermission } from 'packages/v1/models/permissions'
import { useContext, useState } from 'react'
import EditProjectModal from './modals/EditProjectModal'

export default function V1ProjectHeaderActions() {
  const { handle, terminal } = useContext(V1ProjectContext)
  const { projectId } = useContext(ProjectMetadataContext)

  const [toolDrawerVisible, setToolDrawerVisible] = useState<boolean>(false)
  const [editProjectModalVisible, setEditProjectModalVisible] =
    useState<boolean>(false)

  const hasEditPermission = useV1ConnectedWalletHasPermission([
    V1OperatorPermission.SetHandle,
    V1OperatorPermission.SetUri,
  ])

  if (!projectId) return null

  return (
    <div className="flex items-center">
      <span className="pr-2 text-grey-400 dark:text-slate-200">
        {terminal?.version && (
          <div className="relative">
            <Tooltip
              title={t`Version of the terminal contract used by this project.`}
            >
              <span className="cursor-default bg-smoke-100 py-0.5 px-1 dark:bg-slate-600">
                V{terminal.version}
              </span>
            </Tooltip>
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
