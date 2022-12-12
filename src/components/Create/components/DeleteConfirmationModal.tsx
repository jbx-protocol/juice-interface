import { t, Trans } from '@lingui/macro'
import { Modal } from 'antd'

export const DeleteConfirmationModal = ({
  body,
  open,
  onOk,
  onCancel,
}: {
  body?: React.ReactNode
  open?: boolean
  onOk?: () => void
  onCancel?: () => void
}) => {
  return (
    <Modal
      title={
        <h2 className="text-xl font-medium text-black dark:text-grey-200">
          <Trans>Are you sure?</Trans>
        </h2>
      }
      okText={t`Yes, delete`}
      cancelText={t`No, keep`}
      open={open}
      onOk={onOk}
      onCancel={onCancel}
    >
      {body}
    </Modal>
  )
}
