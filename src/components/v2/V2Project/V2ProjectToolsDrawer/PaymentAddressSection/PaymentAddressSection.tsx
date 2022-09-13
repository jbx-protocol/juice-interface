import { plural, Trans } from '@lingui/macro'
import { Button, Space } from 'antd'
import { PaymentAddressesModal } from 'components/v2/V2Project/modals/PaymentAddressesModal'
import { LaunchProjectPayerButton } from 'components/v2/V2Project/V2ProjectToolsDrawer/PaymentAddressSection/LaunchProjectPayerButton'
import { V2ProjectContext } from 'contexts/v2/projectContext'
import { useProjectPayers } from 'hooks/ProjectPayers'
import { TransactorInstance } from 'hooks/Transactor'
import { DeployProjectPayerTxArgs } from 'hooks/v2/transactor/DeployProjectPayerTx'
import { useContext, useState } from 'react'

export function PaymentAddressSection({
  useDeployProjectPayerTx,
}: {
  useDeployProjectPayerTx: () =>
    | TransactorInstance<DeployProjectPayerTxArgs>
    | undefined
}) {
  const { projectId } = useContext(V2ProjectContext)

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
