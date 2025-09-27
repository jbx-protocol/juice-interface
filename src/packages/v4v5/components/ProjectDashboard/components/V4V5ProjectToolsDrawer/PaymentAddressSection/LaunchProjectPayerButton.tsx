import { Trans } from '@lingui/macro'
import { Button } from 'antd'
import { useState } from 'react'
import { LaunchProjectPayerModal } from './LaunchProjectPayerModal/LaunchProjectPayerModal'

export function LaunchProjectPayerButton() {
  const [modalVisible, setModalVisible] = useState<boolean>(false)

  return (
    <>
      <Button onClick={() => setModalVisible(true)} type="primary" size="small">
        <span>
          <Trans>Create a project payer address</Trans>
        </span>
      </Button>

      <LaunchProjectPayerModal
        open={modalVisible}
        onClose={() => setModalVisible(false)}
      />
    </>
  )
}
