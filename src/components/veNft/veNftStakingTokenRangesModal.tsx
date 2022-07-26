import { Trans } from '@lingui/macro'
import { Modal } from 'antd'

interface StakingTokenRangesModalProps {
  visible: boolean
  onCancel: VoidFunction
}

const StakingTokenRangesModal = ({
  visible,
  onCancel,
}: StakingTokenRangesModalProps) => {
  return (
    <Modal visible={visible} onCancel={onCancel}>
      <h2>
        <Trans>Token Ranges</Trans>
      </h2>
    </Modal>
  )
}

export default StakingTokenRangesModal
