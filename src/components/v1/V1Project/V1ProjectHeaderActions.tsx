import { t, Trans } from '@lingui/macro'
import { Button, Tooltip } from 'antd'
import { NetworkContext } from 'contexts/networkContext'
import { ThemeContext } from 'contexts/themeContext'
import { V1ProjectContext } from 'contexts/v1/projectContext'
import {
  OperatorPermission,
  useHasPermission,
} from 'hooks/v1/contractReader/HasPermission'
import { useContext, useState } from 'react'
import { SettingOutlined, ToolOutlined } from '@ant-design/icons'

import { useSafeTransferFromTx } from 'hooks/v1/transactor/SafeTransferFromTx'
import { useTransferTokensTx } from 'hooks/v1/transactor/TransferTokensTx'
import { useAddToBalanceTx } from 'hooks/v1/transactor/AddToBalanceTx'
import { useSetProjectUriTx } from 'hooks/v1/transactor/SetProjectUriTx'
import useUnclaimedBalanceOfUser from 'hooks/v1/contractReader/UnclaimedBalanceOfUser'

import EditProjectModal from './modals/EditProjectModal'

import MigrateV1Pt1Modal from './modals/MigrateV1Pt1Modal'
import ProjectToolDrawerModal from '../../shared/modals/ProjectToolDrawerModal'

export default function V1ProjectHeaderActions() {
  const {
    projectId,
    handle,
    metadata,
    isPreviewMode,
    terminal,
    owner,
    tokenSymbol,
  } = useContext(V1ProjectContext)
  const { userAddress } = useContext(NetworkContext)

  const [migrateDrawerVisible, setMigrateDrawerVisible] =
    useState<boolean>(false)
  const [toolDrawerVisible, setToolDrawerVisible] = useState<boolean>(false)
  const [editProjectModalVisible, setEditProjectModalVisible] =
    useState<boolean>(false)

  const hasEditPermission = useHasPermission([
    OperatorPermission.SetHandle,
    OperatorPermission.SetUri,
  ])

  const unclaimedTokenBalance = useUnclaimedBalanceOfUser()

  const allowMigrate =
    terminal?.version === '1' &&
    userAddress &&
    owner?.toLowerCase() === userAddress?.toLowerCase()

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
        <Trans>ID: {projectId.toNumber()}</Trans>{' '}
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
        <Button
          onClick={() => setToolDrawerVisible(true)}
          icon={<ToolOutlined />}
          type="text"
        />
        {hasEditPermission && (
          <Button
            onClick={() => setEditProjectModalVisible(true)}
            icon={<SettingOutlined />}
            type="text"
          />
        )}
      </div>

      <MigrateV1Pt1Modal
        visible={migrateDrawerVisible}
        onCancel={() => setMigrateDrawerVisible(false)}
      />
      <ProjectToolDrawerModal
        visible={toolDrawerVisible}
        onClose={() => setToolDrawerVisible(false)}
        unclaimedTokenBalance={unclaimedTokenBalance}
        tokenSymbol={tokenSymbol}
        ownerAddress={owner}
        useTransferProjectOwnershipTx={useSafeTransferFromTx}
        useTransferUnclaimedTokensTx={useTransferTokensTx}
        useAddToBalanceTx={useAddToBalanceTx}
        useSetProjectUriTx={useSetProjectUriTx}
        useDeployProjectPayerTx={() => undefined}
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
