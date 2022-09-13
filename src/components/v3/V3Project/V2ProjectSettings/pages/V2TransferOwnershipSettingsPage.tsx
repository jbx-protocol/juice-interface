import { TransferOwnershipForm } from 'components/Project/ProjectToolsDrawer/TransferOwnershipForm'
import { V3ProjectContext } from 'contexts/v3/projectContext'
import { useTransferProjectOwnershipTx } from 'hooks/v3/transactor/TransferProjectOwnershipTx'
import { useContext } from 'react'

export function V2TransferOwnershipSettingsPage() {
  const { projectOwnerAddress } = useContext(V3ProjectContext)
  return (
    <TransferOwnershipForm
      ownerAddress={projectOwnerAddress}
      useTransferProjectOwnershipTx={useTransferProjectOwnershipTx}
    />
  )
}
