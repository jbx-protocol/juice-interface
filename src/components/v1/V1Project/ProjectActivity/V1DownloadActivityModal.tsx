import { t, Trans } from '@lingui/macro'
import { Button, Modal } from 'antd'
import { useState } from 'react'
import { V1DownloadPaymentsModal } from './V1DownloadPaymentsModal'

export function V1DownloadActivityModal({
  open,
  onCancel,
}: {
  open: boolean | undefined
  onCancel: VoidFunction | undefined
}) {
  const [paymentsModalVisible, setPaymentsModalVisible] = useState<boolean>()

  return (
    <Modal
      open={open}
      onCancel={onCancel}
      cancelText={t`Close`}
      okButtonProps={{ hidden: true }}
      centered
    >
      <div>
        <h4>
          <Trans>Download CSV of project activity</Trans>
        </h4>

        <div style={{ marginTop: 20 }}>
          <Button block onClick={() => setPaymentsModalVisible(true)}>
            Payments
          </Button>
        </div>
      </div>

      <V1DownloadPaymentsModal
        open={paymentsModalVisible}
        onCancel={() => setPaymentsModalVisible(false)}
      />
    </Modal>
  )
}
