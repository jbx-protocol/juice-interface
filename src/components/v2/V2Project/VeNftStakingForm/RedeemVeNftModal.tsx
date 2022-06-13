import { Modal } from 'antd'

type RedeemVeNftModalProps = {
  visible: boolean
  onCancel: VoidFunction
}

const RedeemVeNftModal = ({ visible, onCancel }: RedeemVeNftModalProps) => {
  const redeem = () => {
    return
  }

  return (
    <Modal
      visible={visible}
      onCancel={onCancel}
      onOk={redeem}
      okText={`Redeem`}
    >
      <h2>Redeem</h2>
    </Modal>
  )
}

export default RedeemVeNftModal
