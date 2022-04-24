import { t, Trans } from '@lingui/macro'
import { Button, Modal } from 'antd'
import { useState } from 'react'

import DownloadPaymentsModal from './DownloadPaymentsModal'

export default function DownloadActivityModal({
  visible,
  onCancel,
}: {
  visible: boolean | undefined
  onCancel: VoidFunction | undefined
}) {
  const [paymentsModalVisible, setPaymentsModalVisible] = useState<boolean>()

  return (
    <Modal
      visible={visible}
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

      <DownloadPaymentsModal
        visible={paymentsModalVisible}
        onCancel={() => setPaymentsModalVisible(false)}
      />
    </Modal>
  )
}
