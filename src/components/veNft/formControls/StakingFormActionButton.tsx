import { Button } from 'antd'
import { NetworkContext } from 'contexts/networkContext'
import { useContext } from 'react'

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
  const { userAddress, onSelectWallet } = useContext(NetworkContext)

  const renderActionButton = () => {
    if (!userAddress && onSelectWallet) {
      return (
        <Button
          block
          style={{ whiteSpace: 'pre' }}
          onClick={() => onSelectWallet()}
        >
          Connect Wallet
        </Button>
      )
    }
    if (!hasAdequateApproval) {
      return (
        <Button
          block
          style={{ whiteSpace: 'pre' }}
          onClick={onApproveButtonClick}
          loading={tokenApprovalLoading}
        >
          Approve Token for Transaction
        </Button>
      )
    } else {
      return (
        <Button
          block
          style={{ whiteSpace: 'pre' }}
          onClick={onReviewButtonClick}
        >
          Review and Confirm Stake
        </Button>
      )
    }
  }

  return <>{renderActionButton()}</>
}

export default StakingFormActionButton
