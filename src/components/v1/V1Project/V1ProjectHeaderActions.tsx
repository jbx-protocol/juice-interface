import { t, Trans } from '@lingui/macro'
import { Button, Tooltip } from 'antd'
import { ThemeContext } from 'contexts/themeContext'
import { V1ProjectContext } from 'contexts/v1/projectContext'
import { useV1ConnectedWalletHasPermission } from 'hooks/v1/contractReader/V1ConnectedWalletHasPermission'
import { V1OperatorPermission } from 'models/v1/permissions'
import { useContext, useState } from 'react'
import { SettingOutlined, ToolOutlined } from '@ant-design/icons'

import { useIsUserAddress } from 'hooks/IsUserAddress'
import { V1ProjectToolsDrawer } from 'components/v1/V1Project/V1ProjectToolsDrawer'

import EditProjectModal from './modals/EditProjectModal'
import MigrateV1Pt1Modal from './modals/MigrateV1Pt1Modal'

export default function V1ProjectHeaderActions() {
  const { projectId, handle, metadata, isPreviewMode, terminal, owner } =
    useContext(V1ProjectContext)

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

  const allowMigrate = isOwner && terminal?.version === '1'

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
        <Trans>ID: {projectId}</Trans>{' '}
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
        visible={migrateDrawerVisible}
        onCancel={() => setMigrateDrawerVisible(false)}
      />
      <V1ProjectToolsDrawer
        visible={toolDrawerVisible}
        onClose={() => setToolDrawerVisible(false)}
      />
      <EditProjectModal
        visible={editProjectModalVisible}
        metadata={metadata}
        handle={handle}
        onSuccess={() => setEditProjectModalVisible(false)}
        onCancel={() => setEditProjectModalVisible(false)}
      />
    </div>
  )
}
