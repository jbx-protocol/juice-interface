import { TransferOwnershipForm } from 'components/Project/ProjectToolsDrawer/TransferOwnershipForm'
import { V2V3ProjectContext } from 'packages/v2v3/contexts/Project/V2V3ProjectContext'
import { useTransferProjectOwnershipTx } from 'packages/v2v3/hooks/transactor/useTransferProjectOwnershipTx'
import { useContext } from 'react'

export function TransferOwnershipSettingsPage() {
  const { projectOwnerAddress } = useContext(V2V3ProjectContext)
  return (
    <TransferOwnershipForm
      ownerAddress={projectOwnerAddress}
      useTransferProjectOwnershipTx={useTransferProjectOwnershipTx}
    />
  )
}
