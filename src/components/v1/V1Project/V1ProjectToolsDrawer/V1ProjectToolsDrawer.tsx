import { Trans } from '@lingui/macro'
import { Divider, Drawer, Space, Tabs } from 'antd'
import ArchiveV1Project from 'components/v1/V1Project/ArchiveV1Project'
import { V1ProjectContext } from 'contexts/v1/projectContext'
import { useIsUserAddress } from 'hooks/IsUserAddress'
import { useContext } from 'react'

import useUnclaimedBalanceOfUser from 'hooks/v1/contractReader/UnclaimedBalanceOfUser'
import { useAddToBalanceTx } from 'hooks/v1/transactor/AddToBalanceTx'
import { useSafeTransferFromTx } from 'hooks/v1/transactor/SafeTransferFromTx'
import { useSetProjectUriTx } from 'hooks/v1/transactor/SetProjectUriTx'
import { useTransferTokensTx } from 'hooks/v1/transactor/TransferTokensTx'

import { AddToProjectBalanceForm } from 'components/Project/ProjectToolsDrawer/AddToProjectBalanceForm'
import { ExportSection } from 'components/Project/ProjectToolsDrawer/ExportSection'
import { TransferOwnershipForm } from 'components/Project/ProjectToolsDrawer/TransferOwnershipForm'
import { TransferUnclaimedTokensForm } from 'components/Project/ProjectToolsDrawer/TransferUnclaimedTokensForm'
import { ExportPayoutModsButton } from './ExportPayoutModsButton'

const { TabPane } = Tabs

export function V1ProjectToolsDrawer({
  visible,
  onClose,
}: {
  visible?: boolean
  onClose?: VoidFunction
}) {
  const { owner, tokenSymbol } = useContext(V1ProjectContext)

  const setUriTx = useSetProjectUriTx()
  const isOwnerWallet = useIsUserAddress(owner)
  const unclaimedTokenBalance = useUnclaimedBalanceOfUser()

  const OwnerTools = (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <section>
        <TransferOwnershipForm
          ownerAddress={owner}
          useTransferProjectOwnershipTx={useSafeTransferFromTx}
        />
      </section>

      <Divider />

      <ArchiveV1Project setUriTx={setUriTx} />
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
            <section>
              <TransferUnclaimedTokensForm
                tokenSymbol={tokenSymbol}
                unclaimedTokenBalance={unclaimedTokenBalance}
                useTransferUnclaimedTokensTx={useTransferTokensTx}
              />
            </section>

            <Divider />

            <section>
              <AddToProjectBalanceForm useAddToBalanceTx={useAddToBalanceTx} />
            </section>

            <ExportSection
              exportPayoutsButton={<ExportPayoutModsButton />}
              exportReservedTokensButton={undefined}
            />
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
