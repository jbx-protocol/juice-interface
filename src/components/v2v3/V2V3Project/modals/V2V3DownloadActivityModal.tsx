import { t, Trans } from '@lingui/macro'
import { Button, Modal, ModalProps } from 'antd'
import { useState } from 'react'

import V2V3DownloadPaymentsModal from './V2V3DownloadPaymentsModal'

export default function V2V3DownloadActivityModal(props: ModalProps) {
  const [paymentsModalVisible, setPaymentsModalVisible] = useState<boolean>()

  return (
    <Modal
      cancelText={t`Close`}
      okButtonProps={{ hidden: true }}
      centered
      {...props}
    >
      <div>
        <h4>
          <Trans>Export project activity</Trans>
        </h4>

        <div style={{ marginTop: 20 }}>
          <Button block onClick={() => setPaymentsModalVisible(true)}>
            <Trans>Download payments CSV</Trans>
          </Button>
        </div>
      </div>

      <V2V3DownloadPaymentsModal
        open={paymentsModalVisible}
        onCancel={() => setPaymentsModalVisible(false)}
      />
    </Modal>
  )
}
