import { TransferUnclaimedTokensModal } from 'components/modals/TransferUnclaimedTokensModal'
import { useProjectContext } from 'components/v2v3/V2V3Project/ProjectDashboard/hooks/useProjectContext'
import { useUnclaimedTokenBalance } from 'components/v2v3/V2V3Project/ProjectDashboard/hooks/useUnclaimedTokenBalance'
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
