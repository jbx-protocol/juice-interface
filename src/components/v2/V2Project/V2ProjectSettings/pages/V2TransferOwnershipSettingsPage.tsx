import { TransferOwnershipForm } from 'components/Project/ProjectToolsDrawer/TransferOwnershipForm'
import { V2ProjectContext } from 'contexts/v2/projectContext'
import { useTransferProjectOwnershipTx } from 'hooks/v2/transactor/TransferProjectOwnershipTx'
import { useContext } from 'react'

export function V2TransferOwnershipSettingsPage() {
  const { projectOwnerAddress } = useContext(V2ProjectContext)
  return (
    <TransferOwnershipForm
      ownerAddress={projectOwnerAddress}
      useTransferProjectOwnershipTx={useTransferProjectOwnershipTx}
    />
  )
}
