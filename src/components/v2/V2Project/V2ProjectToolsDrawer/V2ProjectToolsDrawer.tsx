import { Trans } from '@lingui/macro'
import { Divider, Drawer, Space, Tabs } from 'antd'
import { ExportSection } from 'components/Project/ProjectToolsDrawer/ExportSection'
import {
  ETH_PAYOUT_SPLIT_GROUP,
  RESERVED_TOKEN_SPLIT_GROUP,
} from 'constants/v2/splits'
import { V2ProjectContext } from 'contexts/v2/projectContext'
import useMobile from 'hooks/Mobile'
import useUserUnclaimedTokenBalance from 'hooks/v2/contractReader/UserUnclaimedTokenBalance'
import { useAddToBalanceTx } from 'hooks/v2/transactor/AddToBalanceTx'
import { useDeployProjectPayerTx } from 'hooks/v2/transactor/DeployProjectPayerTx'
import { useTransferUnclaimedTokensTx } from 'hooks/v2/transactor/TransferUnclaimedTokensTx'
import { ETHPayoutSplitGroup, ReservedTokensSplitGroup } from 'models/v2/splits'
import { useContext } from 'react'
import { AddToProjectBalanceForm } from '../../../Project/ProjectToolsDrawer/AddToProjectBalanceForm'
import { PayableAddressSection } from '../../../Project/ProjectToolsDrawer/PayableAddressSection'
import { TransferUnclaimedTokensForm } from '../../../Project/ProjectToolsDrawer/TransferUnclaimedTokensForm'
import { ExportSplitsButton } from './ExportSplitsButton'

const { TabPane } = Tabs

export function V2ProjectToolsDrawer({
  visible,
  onClose,
}: {
  visible?: boolean
  onClose?: VoidFunction
}) {
  const { tokenSymbol, payoutSplits, reservedTokensSplits } =
    useContext(V2ProjectContext)

  const isMobile = useMobile()

  const { data: unclaimedTokenBalance } = useUserUnclaimedTokenBalance()

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
      </Tabs>
    </Drawer>
  )
}
