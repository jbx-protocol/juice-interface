import { plural, Trans } from '@lingui/macro'
import { Button, Space } from 'antd'
import LaunchProjectPayerButton from 'components/v2/V2Project/LaunchProjectPayer/LaunchProjectPayerButton'
import ProjectPayersModal from 'components/v2/V2Project/ProjectPayersModal'
import { V2ProjectContext } from 'contexts/v2/projectContext'
import { TransactorInstance } from 'hooks/Transactor'
import { useProjectPayers } from 'hooks/v2/ProjectPayers'
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
            <ProjectPayersModal
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
