import { Trans } from '@lingui/macro'
import { Button } from 'antd'
import { useState } from 'react'
import { LaunchSplitsPayerModal } from './LaunchSplitsPayerModal'

export function LaunchSplitsPayerButton() {
  const [modalVisible, setModalVisible] = useState<boolean>(false)

  return (
    <>
      <Button onClick={() => setModalVisible(true)} type="primary" size="small">
        <span>
          <Trans>Create a splits payer address</Trans>
        </span>
      </Button>

      <LaunchSplitsPayerModal
        open={modalVisible}
        onClose={() => setModalVisible(false)}
      />
    </>
  )
}
