import { Trans, t } from '@lingui/macro'
import { Modal } from 'antd'
import React from 'react'

interface VeNftUnlockModalProps {
  visible: boolean
  onCancel: VoidFunction
}

const VeNftUnlockModal = ({ visible, onCancel }: VeNftUnlockModalProps) => {
  const redeem = () => {
    return
  }

  return (
    <Modal
      visible={visible}
      onCancel={onCancel}
      onOk={redeem}
      okText={t`Unlock`}
    >
      <h2>
        <Trans>Unlock Token</Trans>
      </h2>
    </Modal>
  )
}

export default VeNftUnlockModal
