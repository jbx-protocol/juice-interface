import { plural, Trans } from '@lingui/macro'
import { Button, Space } from 'antd'
import { PaymentAddressesModal } from 'components/v3/V3Project/modals/PaymentAddressesModal'
import { LaunchProjectPayerButton } from 'components/v3/V3Project/V2ProjectToolsDrawer/PaymentAddressSection/LaunchProjectPayerButton'
import { V3ProjectContext } from 'contexts/v3/projectContext'
import { TransactorInstance } from 'hooks/Transactor'
import { useProjectPayers } from 'hooks/v3/ProjectPayers'
import { DeployProjectPayerTxArgs } from 'hooks/v3/transactor/DeployProjectPayerTx'
import { useContext, useState } from 'react'

export function PaymentAddressSection({
  useDeployProjectPayerTx,
}: {
  useDeployProjectPayerTx: () =>
    | TransactorInstance<DeployProjectPayerTxArgs>
    | undefined
}) {
  const { projectId } = useContext(V3ProjectContext)

  const [projectPayersModalIsVisible, setProjectPayersModalIsVisible] =
    useState<boolean>()

  const { data: projectPayers } = useProjectPayers(projectId)

  return (
    <>
      <p>
        <Trans>
          Create an Ethereum address that can be used to pay your project
          directly.
        </Trans>
      </p>
      <Space>
        <LaunchProjectPayerButton
          useDeployProjectPayerTx={useDeployProjectPayerTx}
        />
        {projectPayers && (
          <>
            <Button
              onClick={() => setProjectPayersModalIsVisible(true)}
              size="small"
            >
              {plural(projectPayers.length, {
                one: 'View deployed Payment Address',
                other: 'View deployed Payment Addresses',
              })}
            </Button>
            <PaymentAddressesModal
              visible={projectPayersModalIsVisible}
              onCancel={() => setProjectPayersModalIsVisible(false)}
              projectPayers={projectPayers}
            />
          </>
        )}
      </Space>
    </>
  )
}
