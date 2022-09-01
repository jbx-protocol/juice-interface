import { Trans } from '@lingui/macro'
import { Button } from 'antd'
import { TransactorInstance } from 'hooks/Transactor'
import { DeployProjectPayerTxArgs } from 'hooks/v2/transactor/DeployProjectPayerTx'
import { useState } from 'react'
import LaunchProjectPayerModal from './LaunchProjectPayerModal'

export default function LaunchProjectPayerButton({
  useDeployProjectPayerTx,
}: {
  useDeployProjectPayerTx: () =>
    | TransactorInstance<DeployProjectPayerTxArgs>
    | undefined
}) {
  const [modalVisible, setModalVisible] = useState<boolean>(false)

  return (
    <>
      <Button onClick={() => setModalVisible(true)} type="primary" size="small">
        <span>
          <Trans>Create Payment Address</Trans>
        </span>
      </Button>

      <LaunchProjectPayerModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        useDeployProjectPayerTx={useDeployProjectPayerTx}
      />
    </>
  )
}
