import { SettingOutlined, ToolOutlined } from '@ant-design/icons'
import { t } from '@lingui/macro'
import { Button, Tooltip } from 'antd'
import { V1ProjectToolsDrawer } from 'components/v1/V1Project/V1ProjectToolsDrawer/V1ProjectToolsDrawer'
import { CV_V1 } from 'constants/cv'
import { ProjectMetadataContext } from 'contexts/projectMetadataContext'
import { ThemeContext } from 'contexts/themeContext'
import { V1ProjectContext } from 'contexts/v1/projectContext'
import { useIsUserAddress } from 'hooks/IsUserAddress'
import { useV1ConnectedWalletHasPermission } from 'hooks/v1/contractReader/V1ConnectedWalletHasPermission'
import { V1OperatorPermission } from 'models/v1/permissions'
import { useContext, useState } from 'react'
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

  const allowMigrate = isOwner && terminal?.version === CV_V1

  const {
    theme: { colors },
  } = useContext(ThemeContext)

  if (isPreviewMode || !projectId) return null

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <span
        style={{
          color: colors.text.tertiary,
          paddingRight: 10,
        }}
      >
        {terminal?.version && (
          <Tooltip
            title={t`Version of the terminal contract used by this project.`}
          >
            <span
              style={{
                padding: '2px 4px',
                background: colors.background.l1,
                cursor: allowMigrate ? 'pointer' : 'default',
              }}
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
        visible={toolDrawerVisible}
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
