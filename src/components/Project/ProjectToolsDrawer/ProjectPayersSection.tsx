import { Trans } from '@lingui/macro'
import { Button, Space } from 'antd'
import { MinimalCollapse } from 'components/MinimalCollapse'
import LaunchProjectPayerButton from 'components/v2/V2Project/LaunchProjectPayer/LaunchProjectPayerButton'
import ProjectPayersModal from 'components/v2/V2Project/ProjectPayersModal'
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

      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        <MinimalCollapse header="More information">
          <p>
            ETH-ERC20 Payment addresses are{' '}
            <a
              href="https://github.com/jbx-protocol/juice-contracts-v2/blob/main/contracts/JBETHERC20ProjectPayer.sol"
              target="_blank"
              rel="noopener noreferrer"
            >
              smart contracts
            </a>{' '}
            that allow this project to be paid in <strong>ETH</strong> by
            sending ETH directly to the contract, or in{' '}
            <strong>ERC20 tokens</strong> via the contract's{' '}
            <strong>pay()</strong> function.
          </p>
          <p>
            When a payment address is paid, its <strong>beneficiary</strong>{' '}
            address will receive any minted project tokens.
          </p>
          <p>
            <strong>Add to balance:</strong> payments to this contract will fund
            the project without minting project tokens.
          </p>
          <p>
            <strong>Auto claim:</strong> any minted tokens will automatically be
            claimed as ERC20 (if this project has issued an ERC20 token).
          </p>
        </MinimalCollapse>

        {projectPayers && (
          <Button onClick={() => setProjectPayersModalIsVisible(true)} block>
            {projectPayers.length === 1 ? (
              <Trans>1 deployed payment address</Trans>
            ) : (
              <Trans>{projectPayers.length} deployed payment addresses</Trans>
            )}
          </Button>
        )}

        <LaunchProjectPayerButton
          size="middle"
          type="primary"
          useDeployProjectPayerTx={useDeployProjectPayerTx}
        />
      </Space>

      <ProjectPayersModal
        visible={projectPayersModalIsVisible}
        onCancel={() => setProjectPayersModalIsVisible(false)}
        projectPayers={projectPayers}
      />
    </section>
  )
}
