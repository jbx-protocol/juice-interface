import { Trans } from '@lingui/macro'
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
        <Button block onClick={() => onSelectWallet()}>
          <Trans>Connect Wallet</Trans>
        </Button>
      )
    }
    if (!hasAdequateApproval) {
      return (
        <Button block onClick={approve}>
          <Trans>Approve Token for Transaction</Trans>
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
