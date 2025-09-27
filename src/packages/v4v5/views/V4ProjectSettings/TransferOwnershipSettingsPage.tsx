import { V4OmnichainTransferOwnershipForm } from 'packages/v4/components/V4OmnichainTransferOwnershipForm'
import useV4ProjectOwnerOf from 'packages/v4/hooks/useV4ProjectOwnerOf'

export function TransferOwnershipSettingsPage() {
  const { data: projectOwnerAddress } = useV4ProjectOwnerOf()
  return (
    <V4OmnichainTransferOwnershipForm
      ownerAddress={projectOwnerAddress}
    />
  )
}
