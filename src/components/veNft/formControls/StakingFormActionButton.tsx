import { Trans } from '@lingui/macro'
import { Button } from 'antd'
import { useWallet } from 'hooks/Wallet'
interface StakingFormActionButtonProps {
  hasAdequateApproval: boolean
  tokenApprovalLoading: boolean
  onApproveButtonClick: () => void
  onReviewButtonClick: () => void
}

const StakingFormActionButton = ({
  hasAdequateApproval,
  tokenApprovalLoading,
  onApproveButtonClick,
  onReviewButtonClick,
}: StakingFormActionButtonProps) => {
  const { isConnected, connect } = useWallet()

  const renderActionButton = () => {
    if (!isConnected) {
      return (
        <Button block onClick={async () => await connect()}>
          <Trans>Connect Wallet</Trans>
        </Button>
      )
    }
    if (!hasAdequateApproval) {
      return (
        <Button
          block
          onClick={onApproveButtonClick}
          type="primary"
          loading={tokenApprovalLoading}
        >
          <Trans>Approve token for transaction</Trans>
        </Button>
      )
    } else {
      return (
        <Button block onClick={onReviewButtonClick} type="primary">
          <Trans>Review and confirm stake</Trans>
        </Button>
      )
    }
  }

  return <>{renderActionButton()}</>
}

export default StakingFormActionButton
