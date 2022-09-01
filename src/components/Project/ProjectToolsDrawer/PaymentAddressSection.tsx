import { plural, Trans } from '@lingui/macro'
import { Button } from 'antd'
import LaunchProjectPayerButton from 'components/v2/V2Project/LaunchProjectPayer/LaunchProjectPayerButton'
import ProjectPayersModal from 'components/v2/V2Project/ProjectPayersModal'
import { V2ProjectContext } from 'contexts/v2/projectContext'
import useMobile from 'hooks/Mobile'
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
  const [projectPayersModalIsVisible, setProjectPayersModalIsVisible] =
    useState<boolean>()

  const isMobile = useMobile()

  const { projectId } = useContext(V2ProjectContext)

  const { data: projectPayers } = useProjectPayers(projectId)

  return (
    <>
      <p>
        <Trans>
          Create an Ethereum address that can be used to pay your project
          directly.
        </Trans>
      </p>
      <div>
        <LaunchProjectPayerButton
          useDeployProjectPayerTx={useDeployProjectPayerTx}
        />
      </div>
      {projectPayers && (
        <>
          <Button
            onClick={() => setProjectPayersModalIsVisible(true)}
            block
            size="small"
            style={{
              marginTop: '15px',
              width: isMobile ? '100%' : '55%',
            }}
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
    </>
  )
}
