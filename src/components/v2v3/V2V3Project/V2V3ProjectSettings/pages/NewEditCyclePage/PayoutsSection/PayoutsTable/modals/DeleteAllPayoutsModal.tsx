import { Trans, t } from '@lingui/macro'
import { Modal } from 'antd'
import { usePayoutsTable } from '../../hooks/usePayoutsTable'

export function DeleteAllPayoutsModal({
  open,
  onClose,
}: {
  open: boolean
  onClose: VoidFunction
}) {
  const { handleDeleteAllPayoutSplits } = usePayoutsTable()

  function onOk() {
    handleDeleteAllPayoutSplits()
    onClose()
  }

  return (
    <Modal
      title={<Trans>Delete all payout recipients</Trans>}
      open={open}
      okText={t`Confirm`}
      onOk={onOk}
      cancelText={t`Cancel`}
      onCancel={onClose}
      destroyOnClose
    >
      <p>
        <Trans>Are you sure you want to delete all payout recipients?</Trans>
      </p>
    </Modal>
  )
}
