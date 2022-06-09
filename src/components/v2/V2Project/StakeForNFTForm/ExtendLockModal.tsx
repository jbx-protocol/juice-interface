import { Modal } from 'antd'

type ExtendLockModalProps = {
  visible: boolean
  onCancel: VoidFunction
}

const ExtendLockModal = ({ visible, onCancel }: ExtendLockModalProps) => {
  const extendLock = () => {
    return
  }

  return (
    <Modal
      visible={visible}
      onCancel={onCancel}
      onOk={extendLock}
      okText={`Extend Lock`}
    >
      <h2>Extend Lock</h2>
    </Modal>
  )
}

export default ExtendLockModal
