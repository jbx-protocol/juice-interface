import { TransferOwnershipForm } from 'components/Project/ProjectToolsDrawer/TransferOwnershipForm'
import { V2V3ProjectContext } from 'contexts/v2v3/V2V3ProjectContext'
import { useTransferProjectOwnershipTx } from 'hooks/v2v3/transactor/TransferProjectOwnershipTx'
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
