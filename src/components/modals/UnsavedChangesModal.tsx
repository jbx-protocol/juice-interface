import { t, Trans } from '@lingui/macro'
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
      title={t`Unsaved changes`}
      okText={t`Discard`}
      visible={visible}
      onOk={onOk}
      onCancel={onCancel}
      destroyOnClose
    >
      <Trans>
        You have unsaved changes. Are you sure you want to discard them?
      </Trans>
    </Modal>
  )
}
