import { Trans, t } from '@lingui/macro'
import { Modal } from 'antd'
import React from 'react'

interface VeNftExtendLockModalProps {
  visible: boolean
  onCancel: VoidFunction
}

const VeNftExtendLockModal = ({
  visible,
  onCancel,
}: VeNftExtendLockModalProps) => {
  const redeem = () => {
    return
  }

  return (
    <Modal
      visible={visible}
      onCancel={onCancel}
      onOk={redeem}
      okText={t`Extend Lock`}
    >
      <h2>
        <Trans>Extend Lock</Trans>
      </h2>
    </Modal>
  )
}

export default VeNftExtendLockModal
