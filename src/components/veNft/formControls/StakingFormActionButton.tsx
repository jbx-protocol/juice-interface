import { Trans } from '@lingui/macro'
import { Button } from 'antd'
import { NetworkContext } from 'contexts/networkContext'
import { useContext } from 'react'

interface StakingFormActionButtonProps {
  useJbToken: boolean
  hasAdequateApproval: boolean
  tokenApprovalLoading: boolean
  onApproveButtonClick: () => void
  onReviewButtonClick: () => void
}

const StakingFormActionButton = ({
  useJbToken,
  hasAdequateApproval,
  tokenApprovalLoading,
  onApproveButtonClick,
  onReviewButtonClick,
}: StakingFormActionButtonProps) => {
  const { userAddress, onSelectWallet } = useContext(NetworkContext)

  const renderActionButton = () => {
    if (!userAddress && onSelectWallet) {
      return (
        <Button block onClick={() => onSelectWallet()}>
          <Trans>Connect Wallet</Trans>
        </Button>
      )
    }
    if (useJbToken && !hasAdequateApproval) {
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
