import { useProjectContext } from 'components/ProjectDashboard/hooks'
import { useUnclaimedTokenBalance } from 'components/ProjectDashboard/hooks/useUnclaimedTokenBalance'
import { TransferUnclaimedTokensModal } from 'components/modals/TransferUnclaimedTokensModal'
import { useTransferUnclaimedTokensTx } from 'hooks/v2v3/transactor/useTransferUnclaimedTokensTx'

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
