import { Trans } from '@lingui/macro'
import { Button } from 'antd'
import LaunchProjectPayerButton from 'components/v2/V2Project/LaunchProjectPayer/LaunchProjectPayerButton'
import ProjectPayersModal from 'components/v2/V2Project/ProjectPayers/ProjectPayersModal'
import { V2ProjectContext } from 'contexts/v2/projectContext'
import { useProjectPayers } from 'hooks/v2/ProjectPayers'
import { useDeployProjectPayerTx } from 'hooks/v2/transactor/DeployProjectPayerTx'
import { useContext, useState } from 'react'

export default function ProjectPayersSection() {
  const { projectId } = useContext(V2ProjectContext)

  const [projectPayersModalIsVisible, setProjectPayersModalIsVisible] =
    useState<boolean>()

  const { data: projectPayers } = useProjectPayers(projectId)

  return (
    <section>
      <h3>
        <Trans>ETH-ERC20 Payment addresses</Trans>
      </h3>

      {projectPayers && (
        <Button onClick={() => setProjectPayersModalIsVisible(true)} block>
          {projectPayers.length === 1 ? (
            <Trans>1 payment address</Trans>
          ) : (
            <Trans>{projectPayers.length} payment addresses</Trans>
          )}
        </Button>
      )}

      <ProjectPayersModal
        visible={projectPayersModalIsVisible}
        onCancel={() => setProjectPayersModalIsVisible(false)}
        projectPayers={projectPayers}
      />

      <LaunchProjectPayerButton
        size="middle"
        type="default"
        useDeployProjectPayerTx={useDeployProjectPayerTx}
      />
    </section>
  )
}
