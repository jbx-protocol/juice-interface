import { TransferOwnershipForm } from 'components/Project/ProjectToolsDrawer/TransferOwnershipForm'
import { V2V3ProjectContext } from 'contexts/v2v3/Project/V2V3ProjectContext'
import { useTransferProjectOwnershipTx } from 'hooks/v2v3/transactor/useTransferProjectOwnershipTx'
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
