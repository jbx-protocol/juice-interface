import { Modal } from 'antd'

export default function UnsavedChangesModal({
  visible,
  onOk,
  onCancel,
}: {
  visible: boolean
  onOk: () => void
  onCancel: () => void
}) {
  return (
    <Modal
      title={'Unsaved changes'}
      okText={'Discard'}
      visible={visible}
      onOk={onOk}
      onCancel={onCancel}
      destroyOnClose
    >
      You have unsaved changes, are you sure you want to exit?
    </Modal>
  )
}
