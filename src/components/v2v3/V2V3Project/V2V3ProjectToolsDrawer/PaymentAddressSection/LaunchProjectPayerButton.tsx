import { Trans } from '@lingui/macro'
import { Button } from 'antd'
import { TransactorInstance } from 'hooks/Transactor'
import { DeployProjectPayerTxArgs } from 'hooks/v2v3/transactor/DeployProjectPayerTx'
import { useState } from 'react'
import { LaunchProjectPayerModal } from '../../modals/LaunchProjectPayerModal'

export function LaunchProjectPayerButton({
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
          <Trans>Create project payer address</Trans>
        </span>
      </Button>

      <LaunchProjectPayerModal
        open={modalVisible}
        onClose={() => setModalVisible(false)}
        useDeployProjectPayerTx={useDeployProjectPayerTx}
      />
    </>
  )
}
