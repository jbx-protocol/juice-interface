import { Trans } from '@lingui/macro'
import { Divider, Drawer, Space, Tabs } from 'antd'
import { AddToProjectBalanceForm } from 'components/Project/ProjectToolsDrawer/AddToProjectBalanceForm'
import { ExportSection } from 'components/Project/ProjectToolsDrawer/ExportSection'
import { TransferUnclaimedTokensForm } from 'components/Project/ProjectToolsDrawer/TransferUnclaimedTokensForm'
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
import { useTransferUnclaimedTokensTx } from 'hooks/v2/transactor/TransferUnclaimedTokensTx'
import { ETHPayoutSplitGroup, ReservedTokensSplitGroup } from 'models/v2/splits'
import Link from 'next/link'
import { useContext } from 'react'
import { settingsPagePath } from 'utils/routes'
import { ExportSplitsButton } from './ExportSplitsButton'
import { PaymentAddressSection } from './PaymentAddressSection'

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
    projectId,
    handle,
  } = useContext(V2ProjectContext)

  const isMobile = useMobile()
  const { data: unclaimedTokenBalance } = useUserUnclaimedTokenBalance()
  const isOwnerWallet = useIsUserAddress(projectOwnerAddress)

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

            <Divider />

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
            Owner tools have moved.{' '}
            <Link href={settingsPagePath('general', { projectId, handle })}>
              <a onClick={() => onClose?.()}>Go to project settings.</a>
            </Link>
          </TabPane>
        )}
      </Tabs>
    </Drawer>
  )
}
