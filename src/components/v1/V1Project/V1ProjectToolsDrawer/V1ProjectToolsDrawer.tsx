import { Trans } from '@lingui/macro'
import { Divider, Drawer, Space, Tabs } from 'antd'
import { AddToProjectBalanceForm } from 'components/Project/ProjectToolsDrawer/AddToProjectBalanceForm'
import { ExportSection } from 'components/Project/ProjectToolsDrawer/ExportSection'
import { TransferOwnershipForm } from 'components/Project/ProjectToolsDrawer/TransferOwnershipForm'
import { V1ProjectContext } from 'contexts/v1/projectContext'
import { useIsUserAddress } from 'hooks/IsUserAddress'
import { useAddToBalanceTx } from 'hooks/v1/transactor/AddToBalanceTx'
import { useSafeTransferFromTx } from 'hooks/v1/transactor/SafeTransferFromTx'
import { useSetProjectUriTx } from 'hooks/v1/transactor/SetProjectUriTx'
import { useContext } from 'react'
import ArchiveV1Project from './ArchiveV1Project'
import { ExportPayoutModsButton } from './ExportPayoutModsButton'
import { ExportTicketModsButton } from './ExportTicketModsButton'

const { TabPane } = Tabs

export function V1ProjectToolsDrawer({
  open,
  onClose,
}: {
  open?: boolean
  onClose?: VoidFunction
}) {
  const { owner } = useContext(V1ProjectContext)

  const setUriTx = useSetProjectUriTx()
  const isOwnerWallet = useIsUserAddress(owner)

  const OwnerTools = (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <section>
        <h3>
          <Trans>Transfer ownership</Trans>
        </h3>
        <TransferOwnershipForm
          ownerAddress={owner}
          useTransferProjectOwnershipTx={useSafeTransferFromTx}
        />
      </section>

      <Divider />

      <section>
        <h3>
          <Trans>Archive project</Trans>
        </h3>
        <ArchiveV1Project setUriTx={setUriTx} />
      </section>
    </Space>
  )

  return (
    <Drawer
      open={open}
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
              <AddToProjectBalanceForm useAddToBalanceTx={useAddToBalanceTx} />
            </section>

            <Divider />

            <ExportSection
              exportPayoutsButton={<ExportPayoutModsButton />}
              exportReservedTokensButton={<ExportTicketModsButton />}
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
