import { Trans } from '@lingui/macro'
import { Divider, Drawer, Space, Tabs } from 'antd'
import { useContext } from 'react'
import { V2ProjectContext } from 'contexts/v2/projectContext'
import ArchiveV2Project from 'components/v2/V2Project/ArchiveV2Project'
import { useIsUserAddress } from 'hooks/IsUserAddress'
import { useAddToBalanceTx } from 'hooks/v2/transactor/AddToBalanceTx'
import { useTransferProjectOwnershipTx } from 'hooks/v2/transactor/TransferProjectOwnershipTx'
import { useTransferUnclaimedTokensTx } from 'hooks/v2/transactor/TransferUnclaimedTokensTx'
import { useDeployProjectPayerTx } from 'hooks/v2/transactor/DeployProjectPayerTx'
import { useEditV2ProjectDetailsTx } from 'hooks/v2/transactor/EditV2ProjectDetailsTx'
import useUserUnclaimedTokenBalance from 'hooks/v2/contractReader/UserUnclaimedTokenBalance'

import ProjectPayersSection from 'components/Project/ProjectToolsDrawer/ProjectPayersSection'

import { V1TokenMigrationSetupSection } from './V1TokenMigrationSetupSection'
import { AddToProjectBalanceForm } from '../../../Project/ProjectToolsDrawer/AddToProjectBalanceForm'
import { PayableAddressSection } from '../../../Project/ProjectToolsDrawer/PayableAddressSection'
import { TransferOwnershipForm } from '../../../Project/ProjectToolsDrawer/TransferOwnershipForm'
import { TransferUnclaimedTokensForm } from '../../../Project/ProjectToolsDrawer/TransferUnclaimedTokensForm'

const { TabPane } = Tabs

export function V2ProjectToolsDrawer({
  visible,
  onClose,
}: {
  visible?: boolean
  onClose?: VoidFunction
}) {
  const { projectOwnerAddress, tokenSymbol } = useContext(V2ProjectContext)

  const editV2ProjectDetailsTx = useEditV2ProjectDetailsTx()
  const { data: unclaimedTokenBalance } = useUserUnclaimedTokenBalance()

  const isOwnerWallet = useIsUserAddress(projectOwnerAddress)

  const OwnerTools = (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <V1TokenMigrationSetupSection />

      <Divider />

      <section>
        <TransferOwnershipForm
          ownerAddress={projectOwnerAddress}
          useTransferProjectOwnershipTx={useTransferProjectOwnershipTx}
        />
      </section>

      <Divider />

      <ProjectPayersSection />

      <Divider />

      <ArchiveV2Project editV2ProjectDetailsTx={editV2ProjectDetailsTx} />
    </Space>
  )

  return (
    <Drawer
      visible={visible}
      onClose={onClose}
      width={600}
      drawerStyle={{ paddingBottom: '2rem' }}
    >
      <h1>
        <Trans>Tools</Trans>
      </h1>

      <Tabs>
        <TabPane tab={<Trans>General</Trans>} key="1">
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <PayableAddressSection
              useDeployProjectPayerTx={useDeployProjectPayerTx}
            />

            <Divider />

            <section>
              <TransferUnclaimedTokensForm
                tokenSymbol={tokenSymbol}
                unclaimedTokenBalance={unclaimedTokenBalance}
                useTransferUnclaimedTokensTx={useTransferUnclaimedTokensTx}
              />
            </section>

            <Divider />

            <section>
              <AddToProjectBalanceForm useAddToBalanceTx={useAddToBalanceTx} />
            </section>
          </Space>
        </TabPane>
        {isOwnerWallet && (
          <TabPane tab={<Trans>Owner tools</Trans>} key="2">
            {OwnerTools}
          </TabPane>
        )}
      </Tabs>
    </Drawer>
  )
}
