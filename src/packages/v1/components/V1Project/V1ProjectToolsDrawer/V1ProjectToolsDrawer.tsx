import { Trans } from '@lingui/macro'
import { Divider, Drawer, Space, Tabs } from 'antd'
import { useIsUserAddress } from 'hooks/useIsUserAddress'
import { V1ProjectContext } from 'packages/v1/contexts/Project/V1ProjectContext'
import { useAddToBalanceTx } from 'packages/v1/hooks/transactor/useAddToBalanceTx'
import { useSafeTransferFromTx } from 'packages/v1/hooks/transactor/useSafeTransferFromTx'
import { useSetProjectUriTx } from 'packages/v1/hooks/transactor/useSetProjectUriTx'
import { AddToProjectBalanceForm } from 'packages/v2v3/components/V2V3Project/V2V3ProjectToolsDrawer/AddToProjectBalanceForm'
import { ExportSection } from 'packages/v2v3/components/V2V3Project/V2V3ProjectToolsDrawer/ExportSection'
import { TransferOwnershipForm } from 'packages/v2v3/components/V2V3Project/V2V3ProjectToolsDrawer/TransferOwnershipForm'
import { useContext } from 'react'
import ArchiveV1Project from './ArchiveV1Project'
import { ExportPayoutModsButton } from './ExportPayoutModsButton'
import { ExportTicketModsButton } from './ExportTicketModsButton'

const OwnerTools = () => {
  const setUriTx = useSetProjectUriTx()
  const { owner } = useContext(V1ProjectContext)

  return (
    <Space direction="vertical" size="large" className="w-full">
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
}

export function V1ProjectToolsDrawer({
  open,
  onClose,
}: {
  open?: boolean
  onClose?: VoidFunction
}) {
  const { owner } = useContext(V1ProjectContext)

  const isOwnerWallet = useIsUserAddress(owner)

  const TABS = [
    {
      label: <Trans>General</Trans>,
      key: '1',
      children: (
        <Space direction="vertical" size="middle" className="w-full">
          <section>
            <AddToProjectBalanceForm useAddToBalanceTx={useAddToBalanceTx} />
          </section>

          <Divider />

          <ExportSection
            exportPayoutsButton={<ExportPayoutModsButton />}
            exportReservedTokensButton={<ExportTicketModsButton />}
          />
        </Space>
      ),
    },
  ]

  if (isOwnerWallet) {
    TABS.push({
      label: <Trans>Owner tools</Trans>,
      key: '2',
      children: <OwnerTools />,
    })
  }

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

      <Tabs items={TABS} />
    </Drawer>
  )
}
