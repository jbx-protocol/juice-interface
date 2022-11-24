import { t, Trans } from '@lingui/macro'
import { Button, ModalProps } from 'antd'
import { JuiceModal } from 'components/JuiceModal'
import { useState } from 'react'

import V2V3DownloadPaymentsModal from './V2V3DownloadPaymentsModal'

export default function V2V3DownloadActivityModal(props: ModalProps) {
  const [paymentsModalVisible, setPaymentsModalVisible] = useState<boolean>()

  return (
    <JuiceModal
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
    </JuiceModal>
  )
}
