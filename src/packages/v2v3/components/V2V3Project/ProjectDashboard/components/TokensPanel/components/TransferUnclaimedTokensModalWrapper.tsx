import { TransferUnclaimedTokensModal } from 'components/modals/TransferUnclaimedTokensModal'
import { useProjectContext } from 'packages/v2v3/components/V2V3Project/ProjectDashboard/hooks/useProjectContext'
import { useUnclaimedTokenBalance } from 'packages/v2v3/components/V2V3Project/ProjectDashboard/hooks/useUnclaimedTokenBalance'
import { useTransferUnclaimedTokensTx } from 'packages/v2v3/hooks/transactor/useTransferUnclaimedTokensTx'

export const TransferUnclaimedTokensModalWrapper = (props: {
  open: boolean
  onCancel: () => void
  onConfirmed: () => void
}) => {
  const unclaimedBalance = useUnclaimedTokenBalance()
  const { tokenSymbol } = useProjectContext()

  return (
    <TransferUnclaimedTokensModal
      {...props}
      tokenSymbol={tokenSymbol}
      unclaimedBalance={unclaimedBalance}
      useTransferUnclaimedTokensTx={useTransferUnclaimedTokensTx}
    />
  )
}
