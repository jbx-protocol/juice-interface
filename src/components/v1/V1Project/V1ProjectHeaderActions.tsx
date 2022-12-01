import { SettingOutlined, ToolOutlined } from '@ant-design/icons'
import { t } from '@lingui/macro'
import { Button, Tooltip } from 'antd'
import { V1ProjectToolsDrawer } from 'components/v1/V1Project/V1ProjectToolsDrawer/V1ProjectToolsDrawer'
import { PV_V1 } from 'constants/pv'
import { ProjectMetadataContext } from 'contexts/projectMetadataContext'
import { V1ProjectContext } from 'contexts/v1/projectContext'
import { useIsUserAddress } from 'hooks/IsUserAddress'
import { useV1ConnectedWalletHasPermission } from 'hooks/v1/contractReader/V1ConnectedWalletHasPermission'
import { V1OperatorPermission } from 'models/v1/permissions'
import { useContext, useState } from 'react'
import { classNames } from 'utils/classNames'
import EditProjectModal from './modals/EditProjectModal'
import MigrateV1Pt1Modal from './modals/MigrateV1Pt1Modal'

export default function V1ProjectHeaderActions() {
  const { handle, isPreviewMode, terminal, owner } =
    useContext(V1ProjectContext)
  const { projectId } = useContext(ProjectMetadataContext)

  const [migrateDrawerVisible, setMigrateDrawerVisible] =
    useState<boolean>(false)
  const [toolDrawerVisible, setToolDrawerVisible] = useState<boolean>(false)
  const [editProjectModalVisible, setEditProjectModalVisible] =
    useState<boolean>(false)

  const hasEditPermission = useV1ConnectedWalletHasPermission([
    V1OperatorPermission.SetHandle,
    V1OperatorPermission.SetUri,
  ])
  const isOwner = useIsUserAddress(owner)

  const allowMigrate = isOwner && terminal?.version === PV_V1

  if (isPreviewMode || !projectId) return null

  return (
    <div className="flex items-center">
      <span className="pr-2 text-grey-400 dark:text-slate-200">
        {terminal?.version && (
          <Tooltip
            title={t`Version of the terminal contract used by this project.`}
          >
            <span
              className={classNames(
                'bg-smoke-100 py-0.5 px-1 dark:bg-slate-600',
                allowMigrate ? 'cursor-pointer' : 'cursor-default',
              )}
              onClick={() => {
                if (!allowMigrate) return
                setMigrateDrawerVisible(true)
              }}
            >
              V{terminal.version}
            </span>
          </Tooltip>
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
          <Tooltip
            title={t`Reconfigure project and funding details`}
            placement="bottom"
          >
            <Button
              onClick={() => setEditProjectModalVisible(true)}
              icon={<SettingOutlined />}
              type="text"
            />
          </Tooltip>
        )}
      </div>

      <MigrateV1Pt1Modal
        open={migrateDrawerVisible}
        onCancel={() => setMigrateDrawerVisible(false)}
      />
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
