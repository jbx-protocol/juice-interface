import { plural, Trans } from '@lingui/macro'
import { Button, Space } from 'antd'
import { PaymentAddressesModal } from 'components/v2v3/V2V3Project/modals/PaymentAddressesModal'
import { LaunchProjectPayerButton } from 'components/v2v3/V2V3Project/V2V3ProjectToolsDrawer/PaymentAddressSection/LaunchProjectPayerButton'
import { ProjectMetadataContext } from 'contexts/projectMetadataContext'
import { useProjectPayers } from 'hooks/ProjectPayers'
import { TransactorInstance } from 'hooks/Transactor'
import { DeployProjectPayerTxArgs } from 'hooks/v2v3/transactor/DeployProjectPayerTx'
import { useContext, useState } from 'react'

export function PaymentAddressSection({
  useDeployProjectPayerTx,
}: {
  useDeployProjectPayerTx: () =>
    | TransactorInstance<DeployProjectPayerTxArgs>
    | undefined
}) {
  const { projectId } = useContext(ProjectMetadataContext)

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
