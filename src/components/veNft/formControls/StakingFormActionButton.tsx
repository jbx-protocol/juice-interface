import { Button } from 'antd'
import { NetworkContext } from 'contexts/networkContext'
import { useContext } from 'react'

interface StakingFormActionButtonProps {
  hasAdequateApproval: boolean
  onReviewButtonClick: () => void
}

const StakingFormActionButton = ({
  hasAdequateApproval,
  onReviewButtonClick,
}: StakingFormActionButtonProps) => {
  const { userAddress, onSelectWallet } = useContext(NetworkContext)

  const approve = () => {
    return
  }

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
        <Button block style={{ whiteSpace: 'pre' }} onClick={approve}>
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
