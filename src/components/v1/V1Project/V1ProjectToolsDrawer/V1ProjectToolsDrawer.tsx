import { Trans } from '@lingui/macro'
import { Divider, Drawer, Space, Tabs } from 'antd'
import { AddToProjectBalanceForm } from 'components/Project/ProjectToolsDrawer/AddToProjectBalanceForm'
import { ExportSection } from 'components/Project/ProjectToolsDrawer/ExportSection'
import { TransferOwnershipForm } from 'components/Project/ProjectToolsDrawer/TransferOwnershipForm'
import { V1ProjectContext } from 'contexts/v1/Project/V1ProjectContext'
import { useIsUserAddress } from 'hooks/useIsUserAddress'
import { useAddToBalanceTx } from 'hooks/v1/transactor/useAddToBalanceTx'
import { useSafeTransferFromTx } from 'hooks/v1/transactor/useSafeTransferFromTx'
import { useSetProjectUriTx } from 'hooks/v1/transactor/useSetProjectUriTx'
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
