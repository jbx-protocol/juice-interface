import { plural } from '@lingui/macro'
import { Button, Space } from 'antd'
import { PROJECT_PAYER_ADDRESS_EXPLANATION } from 'components/Explanations'
import { PaymentAddressesModal } from 'components/v2v3/V2V3Project/modals/PaymentAddressesModal'
import { LaunchProjectPayerButton } from 'components/v2v3/V2V3Project/V2V3ProjectToolsDrawer/PaymentAddressSection/LaunchProjectPayerButton'
import { ProjectMetadataContext } from 'contexts/shared/ProjectMetadataContext'
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
      <p>{PROJECT_PAYER_ADDRESS_EXPLANATION}</p>
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
                one: 'View deployed project payer address',
                other: 'View deployed project payer addresses',
              })}
            </Button>
            <PaymentAddressesModal
              open={projectPayersModalIsVisible}
              onCancel={() => setProjectPayersModalIsVisible(false)}
              projectPayers={projectPayers}
            />
          </>
        )}
      </Space>
    </>
  )
}
