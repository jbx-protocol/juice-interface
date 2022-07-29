import { t } from '@lingui/macro'
import TransactionModal from 'components/TransactionModal'

interface VeNftSetupModalProps {
  visible: boolean
  onCancel: VoidFunction
}

const VeNftSetupModal = ({ visible, onCancel }: VeNftSetupModalProps) => {
  return (
    <TransactionModal
      title={t`Set Up veNFT Governance`}
      visible={visible}
      onCancel={onCancel}
    >
      Set up and launch veNFT governance for your project.
    </TransactionModal>
  )
}

export default VeNftSetupModal
