import { Trans } from '@lingui/macro'
import { Modal } from 'antd'

interface ConfirmStakeModalProps {
  visible: boolean
  onCancel: VoidFunction
  tokenSymbolDisplayText: string
}

const ConfirmStakeModal = ({
  visible,
  onCancel,
  tokenSymbolDisplayText,
}: ConfirmStakeModalProps) => {
  return (
    <Modal
      visible={visible}
      onCancel={onCancel}
      okText={`Lock $${tokenSymbolDisplayText}`}
    >
      <h2>
        <Trans>Confirm Stake</Trans>
      </h2>
    </Modal>
  )
}

export default ConfirmStakeModal
