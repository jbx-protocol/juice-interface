import { t, Trans } from '@lingui/macro'
import { Button, Tooltip } from 'antd'
import { ProjectToolsDrawer } from 'components/shared/Project/ProjectToolsDrawer/ProjectToolsDrawer'
import { ThemeContext } from 'contexts/themeContext'
import { V2ProjectContext } from 'contexts/v2/projectContext'
import {
  useHasPermission,
  V2OperatorPermission,
} from 'hooks/v2/contractReader/HasPermission'
import { useContext, useState } from 'react'
import { ToolOutlined } from '@ant-design/icons'

import { useAddToBalanceTx } from 'hooks/v2/transactor/AddToBalanceTx'
import { useTransferProjectOwnershipTx } from 'hooks/v2/transactor/TransferProjectOwnershipTx'
import { useTransferUnclaimedTokensTx } from 'hooks/v2/transactor/TransferUnclaimedTokensTx'
import useUserUnclaimedTokenBalance from 'hooks/v2/contractReader/UserUnclaimedTokenBalance'
import { useDeployProjectPayerTx } from 'hooks/v2/transactor/DeployProjectPayerTx'

import ProjectVersionBadge from 'components/shared/ProjectVersionBadge'
import { useEditV2ProjectDetailsTx } from 'hooks/v2/transactor/EditV2ProjectDetailsTx'

import V2ReconfigureFundingModalTrigger from './V2ProjectReconfigureModal/V2ReconfigureModalTrigger'

export default function V2ProjectHeaderActions() {
  const { projectId, tokenSymbol, projectOwnerAddress } =
    useContext(V2ProjectContext)

  const {
    theme: { colors },
  } = useContext(ThemeContext)

  const [toolDrawerVisible, setToolDrawerVisible] = useState<boolean>(false)

  const canReconfigure = useHasPermission(V2OperatorPermission.RECONFIGURE)

  const showReconfigureButton = canReconfigure

  const { data: unclaimedTokenBalance } = useUserUnclaimedTokenBalance()

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
        {projectId && <Trans>ID: {projectId}</Trans>}{' '}
        <Tooltip
          title={t`This project uses the V2 version of the Juicebox contracts.`}
        >
          <ProjectVersionBadge versionText="V2" />
        </Tooltip>
      </span>
      <ProjectToolsDrawer
        visible={toolDrawerVisible}
        onClose={() => setToolDrawerVisible(false)}
        unclaimedTokenBalance={unclaimedTokenBalance}
        tokenSymbol={tokenSymbol}
        ownerAddress={projectOwnerAddress}
        useTransferProjectOwnershipTx={useTransferProjectOwnershipTx}
        useTransferUnclaimedTokensTx={useTransferUnclaimedTokensTx}
        useAddToBalanceTx={useAddToBalanceTx}
        useSetProjectUriTx={() => undefined}
        useEditV2ProjectDetailsTx={useEditV2ProjectDetailsTx}
        useDeployProjectPayerTx={useDeployProjectPayerTx}
      />
      <div style={{ display: 'flex' }}>
        <Tooltip title={t`Tools`} placement="bottom">
          <Button
            onClick={() => setToolDrawerVisible(true)}
            icon={<ToolOutlined />}
            type="text"
          />
        </Tooltip>
        {showReconfigureButton && <V2ReconfigureFundingModalTrigger />}
      </div>
    </div>
  )
}
