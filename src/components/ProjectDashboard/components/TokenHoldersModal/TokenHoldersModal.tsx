import { useProjectContext } from 'components/ProjectDashboard/hooks'
import ParticipantsModal from 'components/modals/ParticipantsModal'

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
