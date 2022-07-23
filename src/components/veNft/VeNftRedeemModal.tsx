import { Trans, t } from '@lingui/macro'
import { Modal } from 'antd'
import React from 'react'

interface VeNftRedeemModalProps {
  visible: boolean
  onCancel: VoidFunction
}

const VeNftRedeemModal = ({ visible, onCancel }: VeNftRedeemModalProps) => {
  const redeem = () => {
    return
  }

  return (
    <Modal
      visible={visible}
      onCancel={onCancel}
      onOk={redeem}
      okText={t`Redeem`}
    >
      <h2>
        <Trans>Redeem Token</Trans>
      </h2>
    </Modal>
  )
}

export default VeNftRedeemModal
