import { V4OmnichainTransferOwnershipForm } from 'packages/v4v5/components/V4OmnichainTransferOwnershipForm'
import useV4ProjectOwnerOf from 'packages/v4v5/hooks/useV4ProjectOwnerOf'

export function TransferOwnershipSettingsPage() {
  const { data: projectOwnerAddress } = useV4ProjectOwnerOf()
  return (
    <V4OmnichainTransferOwnershipForm
      ownerAddress={projectOwnerAddress}
    />
  )
}
