import ParticipantsModal from 'components/modals/ParticipantsModal'
import { useProjectContext } from 'packages/v2v3/components/V2V3Project/ProjectDashboard/hooks/useProjectContext'

// TODO: This is hacked together - we should consider rebuilding
export const TokenHoldersModal = ({
  open,
  onClose,
}: {
  open: boolean
  onClose: VoidFunction
}) => {
  const { tokenSymbol, totalTokenSupply, tokenAddress } = useProjectContext()
  return (
    <ParticipantsModal
      tokenSymbol={tokenSymbol}
      tokenAddress={tokenAddress}
      totalTokenSupply={totalTokenSupply}
      open={open}
      onCancel={onClose}
    />
  )
}
