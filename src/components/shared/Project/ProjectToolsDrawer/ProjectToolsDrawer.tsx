import { BigNumber } from '@ethersproject/bignumber'
import { Trans } from '@lingui/macro'
import { Divider, Drawer, Space, Tabs } from 'antd'
import { JBDiscordLink } from 'components/Landing/QAs'
import ArchiveV1Project from 'components/v1/V1Project/ArchiveV1Project'
import ArchiveV2Project from 'components/v2/V2Project/ArchiveV2Project'
import { useIsUserAddress } from 'hooks/IsUserAddress'
import { TransactorInstance } from 'hooks/Transactor'
import { DeployProjectPayerTxArgs } from 'hooks/v2/transactor/DeployProjectPayerTx'

import { AddToProjectBalanceForm } from './AddToProjectBalanceForm'
import { PayableAddressSection } from './PayableAddressSection'
import { V1TokenMigrationSection } from './V1TokenMigrationSection/V1TokenMigrationSection'
import { TransferOwnershipForm } from './TransferOwnershipForm'
import { TransferUnclaimedTokensForm } from './TransferUnclaimedTokensForm'

const { TabPane } = Tabs

export function ProjectToolsDrawer({
  visible,
  onClose,
  unclaimedTokenBalance,
  tokenSymbol,
  ownerAddress,
  useTransferProjectOwnershipTx,
  useTransferUnclaimedTokensTx,
  useAddToBalanceTx,
  useSetProjectUriTx,
  useEditV2ProjectDetailsTx,
  useDeployProjectPayerTx,
}: {
  visible?: boolean
  onClose?: VoidFunction
  unclaimedTokenBalance: BigNumber | undefined
  tokenSymbol: string | undefined
  ownerAddress: string | undefined
  useTransferProjectOwnershipTx: () => TransactorInstance<{
    newOwnerAddress: string
  }>
  useTransferUnclaimedTokensTx: () => TransactorInstance<{
    to: string
    amount: BigNumber
  }>
  useAddToBalanceTx: () => TransactorInstance<{
    value: BigNumber
  }>
  useSetProjectUriTx: () =>
    | TransactorInstance<{
        cid: string
      }>
    | undefined // Currently undefined for v2
  useDeployProjectPayerTx: () =>
    | TransactorInstance<DeployProjectPayerTxArgs>
    | undefined // undefined for v1
  useEditV2ProjectDetailsTx: () =>
    | TransactorInstance<{
        cid: string
      }>
    | undefined // undefined for v1
}) {
  const setUriTx = useSetProjectUriTx()
  const editV2ProjectDetailsTx = useEditV2ProjectDetailsTx()
  const deployProjectPayerTx = useDeployProjectPayerTx()

  const isOwnerWallet = useIsUserAddress(ownerAddress)

  const shouldRenderV1Archive = !!setUriTx
  const shouldRenderV2Archive = !!editV2ProjectDetailsTx

  const OwnerTools = (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <V1TokenMigrationSection />

      <Divider />

      <section>
        <TransferOwnershipForm
          ownerAddress={ownerAddress}
          useTransferProjectOwnershipTx={useTransferProjectOwnershipTx}
        />
      </section>

      <Divider />

      {shouldRenderV1Archive ? (
        <ArchiveV1Project setUriTx={setUriTx} />
      ) : shouldRenderV2Archive ? (
        <ArchiveV2Project editV2ProjectDetailsTx={editV2ProjectDetailsTx} />
      ) : (
        <section>
          <h3>
            <Trans>Archive project</Trans>
          </h3>
          <p>
            <Trans>
              Please contact the Juicebox dev team through our{' '}
              <JBDiscordLink>Discord</JBDiscordLink> to have your project
              archived.
            </Trans>
          </p>
        </section>
      )}
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
            {deployProjectPayerTx && (
              <>
                <PayableAddressSection
                  useDeployProjectPayerTx={useDeployProjectPayerTx}
                />
                <Divider />
              </>
            )}

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
