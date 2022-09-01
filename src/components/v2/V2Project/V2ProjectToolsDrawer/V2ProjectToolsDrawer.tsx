import { Trans } from '@lingui/macro'
import { Divider, Drawer, Space, Tabs } from 'antd'
import { ExportSection } from 'components/Project/ProjectToolsDrawer/ExportSection'
import ArchiveV2Project from 'components/v2/V2Project/ArchiveV2Project'
import VeNftEnableSection from 'components/veNft/VeNftEnableSection'
import VeNftSetUnclaimedTokensPermissionSection from 'components/veNft/VeNftSetUnclaimedTokensPermissionSection'
import { FEATURE_FLAGS } from 'constants/featureFlags'
import {
  ETH_PAYOUT_SPLIT_GROUP,
  RESERVED_TOKEN_SPLIT_GROUP,
} from 'constants/v2/splits'
import { V2ProjectContext } from 'contexts/v2/projectContext'
import { useIsUserAddress } from 'hooks/IsUserAddress'
import useMobile from 'hooks/Mobile'
import useUserUnclaimedTokenBalance from 'hooks/v2/contractReader/UserUnclaimedTokenBalance'
import { useAddToBalanceTx } from 'hooks/v2/transactor/AddToBalanceTx'
import { useDeployProjectPayerTx } from 'hooks/v2/transactor/DeployProjectPayerTx'
import { useEditV2ProjectDetailsTx } from 'hooks/v2/transactor/EditV2ProjectDetailsTx'
import { useTransferProjectOwnershipTx } from 'hooks/v2/transactor/TransferProjectOwnershipTx'
import { useTransferUnclaimedTokensTx } from 'hooks/v2/transactor/TransferUnclaimedTokensTx'
import { ETHPayoutSplitGroup, ReservedTokensSplitGroup } from 'models/v2/splits'
import { useContext } from 'react'
import { featureFlagEnabled } from 'utils/featureFlags'
import { AddToProjectBalanceForm } from '../../../Project/ProjectToolsDrawer/AddToProjectBalanceForm'
import { PaymentAddressSection } from '../../../Project/ProjectToolsDrawer/PaymentAddressSection'
import { TransferOwnershipForm } from '../../../Project/ProjectToolsDrawer/TransferOwnershipForm'
import { TransferUnclaimedTokensForm } from '../../../Project/ProjectToolsDrawer/TransferUnclaimedTokensForm'
import { ExportSplitsButton } from './ExportSplitsButton'
import { V1TokenMigrationSetupSection } from './V1TokenMigrationSetupSection'

const { TabPane } = Tabs

export function V2ProjectToolsDrawer({
  visible,
  onClose,
}: {
  visible?: boolean
  onClose?: VoidFunction
}) {
  const {
    projectOwnerAddress,
    tokenSymbol,
    payoutSplits,
    reservedTokensSplits,
    veNft: { contractAddress: veNftContractAddress },
  } = useContext(V2ProjectContext)

  const isMobile = useMobile()

  const editV2ProjectDetailsTx = useEditV2ProjectDetailsTx()
  const { data: unclaimedTokenBalance } = useUserUnclaimedTokenBalance()

  const isOwnerWallet = useIsUserAddress(projectOwnerAddress)

  const veNftEnabled = featureFlagEnabled(FEATURE_FLAGS.VENFT)

  const OwnerTools = (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <section>
        <h3>
          <Trans>V1 token migration</Trans>
        </h3>
        <V1TokenMigrationSetupSection />
      </section>

      <Divider />

      <section>
        <h3>
          <Trans>Transfer ownership</Trans>
        </h3>

        <TransferOwnershipForm
          ownerAddress={projectOwnerAddress}
          useTransferProjectOwnershipTx={useTransferProjectOwnershipTx}
        />
      </section>

      <Divider />

      <ArchiveV2Project editV2ProjectDetailsTx={editV2ProjectDetailsTx} />
    </Space>
  )

  const VeNftTools = (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      {!veNftContractAddress ? (
        <VeNftEnableSection />
      ) : (
        <VeNftSetUnclaimedTokensPermissionSection />
      )}
    </Space>
  )

  return (
    <Drawer
      visible={visible}
      onClose={onClose}
      width={!isMobile ? 600 : undefined}
      drawerStyle={{ paddingBottom: '2rem' }}
    >
      <h1>
        <Trans>Tools</Trans>
      </h1>

      <Tabs>
        <TabPane tab={<Trans>General</Trans>} key="1">
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <section>
              <h3>
                <Trans>Create Payment Address</Trans>
              </h3>

              <PaymentAddressSection
                useDeployProjectPayerTx={useDeployProjectPayerTx}
              />
            </section>

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

            <ExportSection
              exportPayoutsButton={
                payoutSplits ? (
                  <ExportSplitsButton<ETHPayoutSplitGroup>
                    groupedSplits={{
                      splits: payoutSplits,
                      group: ETH_PAYOUT_SPLIT_GROUP,
                    }}
                  >
                    <Trans>Export payouts CSV</Trans>
                  </ExportSplitsButton>
                ) : undefined
              }
              exportReservedTokensButton={
                reservedTokensSplits ? (
                  <ExportSplitsButton<ReservedTokensSplitGroup>
                    groupedSplits={{
                      splits: reservedTokensSplits,
                      group: RESERVED_TOKEN_SPLIT_GROUP,
                    }}
                  >
                    <Trans>Export token allocation CSV</Trans>
                  </ExportSplitsButton>
                ) : undefined
              }
            />
          </Space>
        </TabPane>
        {isOwnerWallet && (
          <TabPane tab={<Trans>Owner tools</Trans>} key="2">
            {OwnerTools}
          </TabPane>
        )}
        {veNftEnabled && isOwnerWallet && (
          <TabPane tab={<Trans>veNFT</Trans>} key="3">
            {VeNftTools}
          </TabPane>
        )}
      </Tabs>
    </Drawer>
  )
}
