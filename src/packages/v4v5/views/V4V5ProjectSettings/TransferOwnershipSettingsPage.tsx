import { V4OmnichainTransferOwnershipForm } from 'packages/v4v5/components/V4OmnichainTransferOwnershipForm'
import useV4V5ProjectOwnerOf from 'packages/v4v5/hooks/useV4V5ProjectOwnerOf'

export function TransferOwnershipSettingsPage() {
  const { data: projectOwnerAddress } = useV4V5ProjectOwnerOf()
  return (
    <V4V5OmnichainTransferOwnershipForm
      ownerAddress={projectOwnerAddress}
    />
  )
}
